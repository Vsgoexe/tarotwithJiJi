import { NextRequest, NextResponse } from "next/server";
import { findService, getServicePriceUSD } from "@/lib/services";
import { ContactMode } from "@/types/service";
import { siteConfig } from "@/config/site";

// In-memory fallback order storage for test and verification
export const ordersStore: Record<string, any> = {};

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
      currency = "INR",
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

    // Price is ALWAYS retrieved server-side in smallest unit (paise/cents)
    let finalCurrency: "INR" | "USD" = "INR";
    let finalAmount = service.price_inr; // in paise

    if (currency === "USD") {
      finalCurrency = "USD";
      finalAmount = getServicePriceUSD(service); // in cents
    }

    const publicId = generatePublicId();
    const orderRecord = {
      id: crypto.randomUUID(),
      public_id: publicId,
      service_id: service.id,
      service_slug: service.slug,
      service_name: service.name,
      status: "pending",
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      question,
      birth_date: birthDate || null,
      currency: finalCurrency,
      amount: finalAmount, // strictly server-looked up amount in paise (e.g. 99900)
      contact_mode: resolvedContactMode,
      razorpay_order_id: `order_mock_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    // Store order
    ordersStore[publicId] = orderRecord;

    return NextResponse.json({
      success: true,
      publicId: orderRecord.public_id,
      razorpayOrderId: orderRecord.razorpay_order_id,
      amount: orderRecord.amount,
      currency: orderRecord.currency,
      contactMode: orderRecord.contact_mode,
      serviceName: orderRecord.service_name,
      razorpayCheckoutName: siteConfig.name,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error creating order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publicId = searchParams.get("publicId");

  if (!publicId || !ordersStore[publicId]) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: ordersStore[publicId] });
}
