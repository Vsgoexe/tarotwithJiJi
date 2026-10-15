import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabase";
import {
  createOrderActionTokens,
  notifyCustomerAwaitingVerification,
  notifyOwnerNewPayment,
} from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicId, utr, screenshotPath } = body;

    if (!publicId || !utr) {
      return NextResponse.json(
        { error: "Booking reference and 12-digit UPI Transaction ID (UTR) are required." },
        { status: 400 }
      );
    }

    // Validate UTR: 12 alphanumeric characters (standard UPI reference / UTR format)
    const cleanedUtr = String(utr).trim();
    const utrRegex = /^[A-Za-z0-9]{12}$/;
    if (!utrRegex.test(cleanedUtr)) {
      return NextResponse.json(
        {
          error:
            "Invalid UPI Transaction ID (UTR). It must be exactly 12 alphanumeric digits as shown in your UPI payment receipt (GPay, PhonePe, Paytm).",
        },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database service unavailable" }, { status: 500 });
    }

    // 1. Fetch current order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*, services:service_id (name, slug, type)")
      .eq("public_id", publicId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order is already confirmed, prevent overwriting
    if (order.status === "confirmed" || order.status === "completed" || order.status === "delivered") {
      return NextResponse.json(
        { error: "This booking has already been verified and confirmed." },
        { status: 400 }
      );
    }

    // 2. Strict Uniqueness Check: Has this UTR been used on ANY other order?
    const { data: existingUtrOrder } = await supabase
      .from("orders")
      .select("id, public_id")
      .eq("utr", cleanedUtr)
      .neq("id", order.id)
      .maybeSingle();

    if (existingUtrOrder) {
      return NextResponse.json(
        {
          error:
            "This UPI Transaction ID / UTR has already been submitted for another booking. Every payment reference must be unique.",
        },
        { status: 400 }
      );
    }

    // 3. Update order status to 'awaiting_verification'
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "awaiting_verification",
        utr: cleanedUtr,
        screenshot_path: screenshotPath || order.screenshot_path || null,
        rejection_reason: null, // clear previous rejection if re-submitting
      })
      .eq("id", order.id)
      .select("*, services:service_id (name, slug, type)")
      .single();

    if (updateError) {
      console.error("Failed to update order with UTR:", updateError);
      return NextResponse.json(
        { error: "Failed to record payment details. Please check the UTR number." },
        { status: 500 }
      );
    }

    // 4. Create single-use expiring action tokens for Owner Email
    const actionUrls = await createOrderActionTokens(order.id);

    // 5. Asynchronously dispatch notifications (Resend; non-blocking)
    const orderWithService = {
      ...updatedOrder,
      service_name: (updatedOrder as any).services?.name || "Tarot Consultation",
    };

    // Customer & Owner notifications
    notifyCustomerAwaitingVerification(orderWithService).catch((e) =>
      console.error("Customer verification notify failed:", e)
    );
    notifyOwnerNewPayment(orderWithService, actionUrls).catch((e) =>
      console.error("Owner payment notify failed:", e)
    );

    return NextResponse.json({
      success: true,
      publicId: order.public_id,
      status: "awaiting_verification",
      message: "Payment received. We are verifying it. You will receive an email once confirmed.",
    });
  } catch (err: any) {
    console.error("Exception in submit-utr route:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error submitting UTR" },
      { status: 500 }
    );
  }
}
