import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabase";
import {
  notifyCustomerBookingConfirmed,
  notifyCustomerBookingRejected,
} from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const status = req.nextUrl.searchParams.get("status");

    let query = supabase
      .from("orders")
      .select("*, services:service_id (name, slug, type, duration_minutes)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: orders, error } = await query;
    if (error) {
      console.error("Failed to fetch admin orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    const formatted = (orders || []).map((o: any) => ({
      ...o,
      service_name: o.services?.name || "Tarot Consultation",
    }));

    return NextResponse.json({ orders: formatted });
  } catch (err: any) {
    if (err?.digest?.startsWith?.("NEXT_")) {
      throw err;
    }
    console.error("Admin orders GET exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, action, rejectionReason } = body;

    if (!orderId || !action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Valid orderId and action ('approve' | 'reject') are required" }, { status: 400 });
    }

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*, services:service_id (name)")
      .eq("id", orderId)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderWithService = {
      ...order,
      service_name: (order as any).services?.name || "Tarot Reading",
    };

    if (action === "approve") {
      // Idempotent: if already confirmed, return success without duplicate notifications
      if (order.status === "confirmed") {
        return NextResponse.json({ success: true, alreadyConfirmed: true, order: orderWithService });
      }

      const { data: updated, error: updateErr } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          verified_at: new Date().toISOString(),
          verified_by: "admin_portal",
        })
        .eq("id", order.id)
        .select("*, services:service_id (name)")
        .single();

      if (updateErr) {
        return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
      }

      // Send confirmed email to customer
      notifyCustomerBookingConfirmed({
        ...updated,
        service_name: (updated as any).services?.name || "Tarot Reading",
      }).catch((e) => console.error("Error sending customer confirmed email:", e));

      return NextResponse.json({ success: true, status: "confirmed", order: updated });
    } else {
      // Reject action
      const reason = rejectionReason || "UTR transaction reference could not be verified with bank deposit.";
      const { data: updated, error: updateErr } = await supabase
        .from("orders")
        .update({
          status: "rejected",
          rejection_reason: reason,
          verified_at: new Date().toISOString(),
          verified_by: "admin_portal",
        })
        .eq("id", order.id)
        .select("*, services:service_id (name)")
        .single();

      if (updateErr) {
        return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
      }

      notifyCustomerBookingRejected(
        {
          ...updated,
          service_name: (updated as any).services?.name || "Tarot Reading",
        },
        reason
      ).catch((e) => console.error("Error sending customer rejection email:", e));

      return NextResponse.json({ success: true, status: "rejected", order: updated });
    }
  } catch (err: any) {
    console.error("Admin order action exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
