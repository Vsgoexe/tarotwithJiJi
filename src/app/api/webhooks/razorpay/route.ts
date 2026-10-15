import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getServiceSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.warn("Razorpay webhook received without signature header");
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    // 1. Verify webhook signature against raw payload
    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      console.warn("Razorpay webhook signature verification failed");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `event_${Date.now()}`;
    const eventType = payload.event;

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      console.error("Database unavailable in webhook handler");
      // Acknowledge receipt to avoid infinite retries if DB is momentarily unreachable, but log error
      return NextResponse.json({ status: "db_unavailable" }, { status: 503 });
    }

    // 2. Check Idempotency in payment_events table
    const { data: existingEvent } = await supabase
      .from("payment_events")
      .select("id")
      .eq("razorpay_event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      // Event has already been processed idempotently
      return NextResponse.json({ status: "already_processed" }, { status: 200 });
    }

    // Record this event
    await supabase.from("payment_events").insert({
      razorpay_event_id: eventId,
      type: eventType,
      payload: payload,
    });

    // 3. Process payment events
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload?.payload?.payment?.entity;
      const orderEntity = payload?.payload?.order?.entity;

      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const publicId = paymentEntity?.notes?.public_id || orderEntity?.notes?.public_id;

      if (razorpayOrderId || publicId) {
        let query = supabase.from("orders").select("id, status");
        if (publicId) {
          query = query.eq("public_id", publicId);
        } else if (razorpayOrderId) {
          query = query.eq("razorpay_order_id", razorpayOrderId);
        }

        const { data: order } = await query.maybeSingle();

        if (order && order.status !== "paid" && order.status !== "completed" && order.status !== "delivered") {
          await supabase
            .from("orders")
            .update({
              status: "paid",
              razorpay_payment_id: paymentId || null,
              paid_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          console.log(`Order ${order.id} marked paid via Razorpay webhook (${eventType})`);
        }
      }
    }

    // 4. Return fast 200 OK acknowledgment
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err: any) {
    console.error("Exception in Razorpay webhook handler:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
