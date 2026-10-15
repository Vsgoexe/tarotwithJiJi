import QRCode from "qrcode";
import { getRazorpayInstance } from "@/lib/razorpay";

export interface PaymentOrderParams {
  service: {
    id: string;
    slug: string;
    name: string;
    price_inr: number;
    price_usd?: number | null;
  };
  publicId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  currency: "INR" | "USD";
  finalAmount: number; // in paise or cents
}

export interface ManualUPIPaymentData {
  provider: "manual_upi";
  upiId: string;
  payeeName: string;
  amountRupees: number;
  amountPaise: number;
  upiLink: string;
  qrCodeDataUrl: string;
  publicId: string;
  holdMinutes: number;
  serviceName: string;
}

export interface RazorpayPaymentData {
  provider: "razorpay";
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  publicId: string;
  serviceName: string;
}

export type PaymentInitiationResult =
  | ManualUPIPaymentData
  | RazorpayPaymentData;

/**
 * Returns currently active payment provider.
 * Defaults to "manual_upi" unless explicitly configured as "razorpay".
 */
export function getPaymentProviderName(): "manual_upi" | "razorpay" {
  return process.env.PAYMENT_PROVIDER === "razorpay" ? "razorpay" : "manual_upi";
}

/**
 * Generates an authoritative UPI deep link and matching QR code data URL.
 * upi://pay?pa=<UPI_ID>&pn=<UPI_PAYEE_NAME>&am=<amount in rupees>&cu=INR&tn=<booking reference>
 */
export async function generateManualUPIData({
  publicId,
  serviceName,
  amountPaise,
}: {
  publicId: string;
  serviceName: string;
  amountPaise: number;
}): Promise<{
  upiId: string;
  payeeName: string;
  amountRupees: number;
  upiLink: string;
  qrCodeDataUrl: string;
}> {
  const upiId = process.env.UPI_ID || "tarotwithjiji@okhdfcbank";
  const payeeName = process.env.UPI_PAYEE_NAME || "jeevani V";
  const amountRupees = Math.round(amountPaise / 100);

  // Clean note/reference
  const note = `Tarot-${publicId.slice(0, 10)}`;
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amountRupees}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generate high-resolution luxury QR code (wine and ivory color scheme)
  const qrCodeDataUrl = await QRCode.toDataURL(upiLink, {
    width: 320,
    margin: 2,
    color: {
      dark: "#7A2E45", // Wine-600
      light: "#FFFDFB", // Ivory
    },
    errorCorrectionLevel: "M",
  });

  return {
    upiId,
    payeeName,
    amountRupees,
    upiLink,
    qrCodeDataUrl,
  };
}

/**
 * Uniform payment initiation handler behind provider switch
 */
export async function createPaymentOrder(
  params: PaymentOrderParams
): Promise<PaymentInitiationResult> {
  const provider = getPaymentProviderName();

  if (provider === "manual_upi") {
    const upiData = await generateManualUPIData({
      publicId: params.publicId,
      serviceName: params.service.name,
      amountPaise: params.finalAmount,
    });

    return {
      provider: "manual_upi",
      upiId: upiData.upiId,
      payeeName: upiData.payeeName,
      amountRupees: upiData.amountRupees,
      amountPaise: params.finalAmount,
      upiLink: upiData.upiLink,
      qrCodeDataUrl: upiData.qrCodeDataUrl,
      publicId: params.publicId,
      holdMinutes: 30, // 30-minute hold for manual UPI
      serviceName: params.service.name,
    };
  }

  // Razorpay branch (kept intact and ready for later activation)
  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    throw new Error(
      "Razorpay payment provider is active but keys are missing or invalid."
    );
  }

  const rzpOrder = await razorpay.orders.create({
    amount: params.finalAmount,
    currency: params.currency,
    receipt: params.publicId,
    notes: {
      public_id: params.publicId,
      service_slug: params.service.slug,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
    },
  });

  const keyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";

  return {
    provider: "razorpay",
    razorpayOrderId: rzpOrder.id,
    amount: params.finalAmount,
    currency: params.currency,
    keyId,
    publicId: params.publicId,
    serviceName: params.service.name,
  };
}
