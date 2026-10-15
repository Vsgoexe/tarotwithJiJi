import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabase";
import {
  notifyCustomerBookingConfirmed,
  notifyCustomerBookingRejected,
} from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, rejectionReason } = body;

    if (!token) {
      return NextResponse.json({ error: "Action token required" }, { status: 400 });
    }

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    // 1. Fetch action token
    const { data: actionToken, error: tokenError } = await supabase
      .from("order_action_tokens")
      .select("id, order_id, action, expires_at, used_at")
      .eq("token", token)
      .maybeSingle();

    if (tokenError || !actionToken) {
      return NextResponse.json({ error: "Action token not found" }, { status: 404 });
    }

    if (actionToken.used_at) {
      return NextResponse.json(
        { error: `This action link has already been used on ${new Date(actionToken.used_at).toLocaleString()}` },
        { status: 400 }
      );
    }

    if (new Date(actionToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This action link has expired. Please use the /admin portal." },
        { status: 400 }
      );
    }

    // 2. Fetch target order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, services:service_id (name)")
      .eq("id", actionToken.order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Associated order not found" }, { status: 404 });
    }

    // 3. Mark token used immediately (idempotency barrier)
    await supabase
      .from("order_action_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", actionToken.id);

    const orderWithServiceName = {
      ...order,
      service_name: (order as any).services?.name || "Tarot Reading",
    };

    // 4. Execute Approve or Reject
    if (actionToken.action === "approve") {
      // Update order to 'confirmed'
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          verified_at: new Date().toISOString(),
          verified_by: "email_action_link",
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Failed to approve order:", updateError);
        return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
      }

      // Send confirmed email to customer (guaranteed single-send by internal tracking)
      notifyCustomerBookingConfirmed(orderWithServiceName).catch((e) =>
        console.error("Failed to send customer confirmed email:", e)
      );

      return NextResponse.json({
        success: true,
        action: "approved",
        publicId: order.public_id,
        message: "Payment successfully approved. Booking confirmed and customer notified.",
      });
    } else {
      // Reject action
      const reason = rejectionReason || "UTR transaction reference could not be validated with bank.";
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "rejected",
          rejection_reason: reason,
          verified_at: new Date().toISOString(),
          verified_by: "email_action_link",
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Failed to reject order:", updateError);
        return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
      }

      // Send rejection notification to customer offering retry
      notifyCustomerBookingRejected(orderWithServiceName, reason).catch((e) =>
        console.error("Failed to send customer rejection email:", e)
      );

      return NextResponse.json({
        success: true,
        action: "rejected",
        publicId: order.public_id,
        message: "Order marked rejected. Notification dispatched to customer.",
      });
    }
  } catch (err: any) {
    console.error("Action execution exception:", err);
    return NextResponse.json({ error: "Internal server error executing action" }, { status: 500 });
  }
}
