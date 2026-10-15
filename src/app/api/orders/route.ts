import { NextRequest, NextResponse } from "next/server";
import { findService } from "@/lib/services";
import { ContactMode } from "@/types/service";
import { createPaymentOrder, getPaymentProviderName } from "@/lib/payments/provider";
import { getServiceSupabaseClient } from "@/lib/supabase";

function generatePublicId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceSlug,
      customerName,
      customerEmail,
      customerPhone,
      question,
      birthDate,
      contactMode,
    } = body;

    if (!serviceSlug) {
      return NextResponse.json(
        { error: "Service identifier is required" },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !question) {
      return NextResponse.json(
        { error: "Name, email, and question are required" },
        { status: 400 }
      );
    }

    // Server-side price and service lookup (NEVER trust client amount)
    const service = await findService(serviceSlug);
    if (!service) {
      return NextResponse.json(
        { error: "Service not found or inactive" },
        { status: 404 }
      );
    }

    // For tarot-1hr: require contactMode to be 'chat' or 'call'
    let resolvedContactMode: ContactMode | null = null;
    if (service.slug === "tarot-1hr") {
      if (!contactMode || (contactMode !== "chat" && contactMode !== "call")) {
        return NextResponse.json(
          { error: "For 'Tarot reading 1hr (chat/call)', choosing 'chat' or 'call' is required." },
          { status: 400 }
        );
      }
      resolvedContactMode = contactMode;
    }

    // In current manual UPI mode and Indian visitors, price is strictly in paise
    const finalCurrency: "INR" = "INR";
    const finalAmount = service.price_inr; // in paise (e.g. 99900)
    const publicId = generatePublicId();
    const providerName = getPaymentProviderName();

    // Authoritative payment order generation behind provider switch
    const paymentResult = await createPaymentOrder({
      service,
      publicId,
      customerName,
      customerEmail,
      customerPhone,
      currency: finalCurrency,
      finalAmount,
    });

    // Authoritative database persistence
    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      console.error("Supabase client not configured: Missing SUPABASE environment variables");
      return NextResponse.json(
        { error: "Database service unavailable. Please configure environment keys." },
        { status: 500 }
      );
    }

    const initialStatus =
      providerName === "manual_upi" ? "pending_payment" : "pending";

    const { error: dbError } = await supabase.from("orders").insert({
      public_id: publicId,
      service_id: service.id,
      status: initialStatus,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      question,
      birth_date: birthDate || null,
      currency: finalCurrency,
      amount: finalAmount, // strictly server-looked up amount in paise
      contact_mode: resolvedContactMode,
      payment_provider: providerName,
      razorpay_order_id:
        paymentResult.provider === "razorpay"
          ? paymentResult.razorpayOrderId
          : null,
    });

    if (dbError) {
      console.error("Failed to insert order into database:", dbError);
      return NextResponse.json(
        { error: "Failed to persist order record. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      publicId,
      provider: paymentResult.provider,
      paymentData: paymentResult,
      serviceName: service.name,
      contactMode: resolvedContactMode,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error creating order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const publicId = req.nextUrl.searchParams.get("publicId");

  if (!publicId) {
    return NextResponse.json({ error: "publicId parameter is required" }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      public_id,
      service_id,
      status,
      customer_name,
      customer_email,
      customer_phone,
      question,
      birth_date,
      currency,
      amount,
      contact_mode,
      payment_provider,
      utr,
      screenshot_path,
      verified_at,
      rejection_reason,
      razorpay_order_id,
      paid_at,
      created_at,
      services:service_id (name, slug, type, duration_minutes)
    `)
    .eq("public_id", publicId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const serviceInfo = (order as any).services;
  return NextResponse.json({
    order: {
      ...order,
      service_name: serviceInfo?.name || "Tarot Reading",
      service_slug: serviceInfo?.slug || "",
      service_type: serviceInfo?.type || "written",
    },
  });
}
