import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Action token required" }, { status: 400 });
    }

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const { data: actionToken, error } = await supabase
      .from("order_action_tokens")
      .select("id, order_id, action, expires_at, used_at, orders:order_id (*, services:service_id (name))")
      .eq("token", token)
      .maybeSingle();

    if (error || !actionToken) {
      return NextResponse.json({ error: "Invalid action link" }, { status: 404 });
    }

    if (actionToken.used_at) {
      return NextResponse.json({
        valid: false,
        alreadyUsed: true,
        action: actionToken.action,
        usedAt: actionToken.used_at,
        order: (actionToken as any).orders,
      });
    }

    const isExpired = new Date(actionToken.expires_at) < new Date();
    if (isExpired) {
      return NextResponse.json({
        valid: false,
        expired: true,
        action: actionToken.action,
        order: (actionToken as any).orders,
      });
    }

    const orderData = (actionToken as any).orders;
    const serviceName = orderData?.services?.name || "Tarot Consultation";

    return NextResponse.json({
      valid: true,
      action: actionToken.action,
      token,
      order: {
        ...orderData,
        service_name: serviceName,
      },
    });
  } catch (err: any) {
    console.error("Action validation error:", err);
    return NextResponse.json({ error: "Failed to validate action" }, { status: 500 });
  }
}
