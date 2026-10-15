import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getServiceSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      publicId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    // 1. Authoritative HMAC SHA-256 signature verification
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.warn("Payment signature verification failed for order:", razorpay_order_id);
      return NextResponse.json(
        { error: "Invalid payment signature. Payment verification failed." },
        { status: 400 }
      );
    }

    // 2. Lookup order in database
    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 }
      );
    }

    let query = supabase.from("orders").select("id, public_id, status, razorpay_order_id");
    if (publicId) {
      query = query.eq("public_id", publicId);
    } else {
      query = query.eq("razorpay_order_id", razorpay_order_id);
    }

    const { data: order, error: findError } = await query.single();

    if (findError || !order) {
      console.error("Order not found during verification:", razorpay_order_id, publicId);
      return NextResponse.json({ error: "Order record not found" }, { status: 404 });
    }

    // 3. Idempotency: if already paid, return success immediately
    if (order.status === "paid" || order.status === "completed" || order.status === "delivered") {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        publicId: order.public_id,
        status: order.status,
      });
    }

    // 4. Update order status to 'paid'
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        razorpay_payment_id,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to mark order paid:", updateError);
      return NextResponse.json(
        { error: "Failed to update order status in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      publicId: order.public_id,
      status: "paid",
    });
  } catch (err: any) {
    console.error("Payment verification route exception:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error verifying payment" },
      { status: 500 }
    );
  }
}
