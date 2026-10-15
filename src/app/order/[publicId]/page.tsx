"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  MessageCircle,
  PhoneCall,
  Lock,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FloralCorner } from "@/components/ui/FloralCorner";
import { formatPriceINR, formatPriceUSD } from "@/lib/services";

interface OrderPageProps {
  params: Promise<{ publicId: string }>;
}

function OrderContent({ params }: OrderPageProps) {
  const { publicId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!publicId) {
      setLoading(false);
      setErrorMsg("No order link provided.");
      return;
    }

    fetch(`/api/orders?publicId=${encodeURIComponent(publicId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Order not found");
        }
        return res.json();
      })
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        } else {
          setErrorMsg("Could not find order details.");
        }
      })
      .catch((err) => {
        console.error("Order fetch error:", err);
        setErrorMsg(err.message || "Failed to load order.");
      })
      .finally(() => setLoading(false));
  }, [publicId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-paper">
        <Header />
        <main className="flex-grow pt-36 pb-24 flex items-center justify-center">
          <div className="text-center space-y-3 font-serif text-ink">
            <div className="w-10 h-10 border-2 border-wine-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-sans text-ink-soft">Retrieving private sanctuary reading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-paper">
        <Header />
        <main className="flex-grow pt-36 pb-24">
          <Container className="max-w-xl">
            <Card className="p-8 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-rose-400/20 text-wine-600 mx-auto flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-ink">Order Not Found</h1>
                <p className="text-ink-soft text-sm">
                  {errorMsg || "The private link provided could not be matched with an active reading record."}
                </p>
              </div>
              <div className="pt-4 flex justify-center gap-4">
                <Button href="/services" variant="primary">
                  Browse Offerings
                </Button>
                <Button href="/" variant="outline">
                  Return Home
                </Button>
              </div>
            </Card>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  const isConfirmed =
    order.status === "confirmed" ||
    order.status === "paid" ||
    order.status === "scheduled" ||
    order.status === "completed" ||
    order.status === "delivered";

  const isAwaiting = order.status === "awaiting_verification";
  const isRejected = order.status === "rejected";

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36 pb-24">
        <Container className="max-w-3xl pt-10">
          <Card className="p-8 sm:p-12 space-y-8 relative overflow-hidden">
            <FloralCorner position="top-left" size={200} opacity={0.6} />

            {/* Header Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-blush-300 pb-6 gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-soft bg-blush-100 px-2.5 py-0.5 rounded-full border border-blush-300">
                  <Lock className="w-3 h-3 text-wine-600" />
                  <span>Private Order Sanctuary</span>
                </div>
                <h1 className="font-serif text-3xl text-ink font-medium">
                  {order.service_name}
                </h1>
                <p className="text-xs font-mono text-ink-soft">
                  Ref: {order.public_id}
                </p>
              </div>

              <div>
                {isConfirmed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified & Confirmed
                  </span>
                )}
                {isAwaiting && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting Verification
                  </span>
                )}
                {!isConfirmed && !isAwaiting && !isRejected && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Payment
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-wine-700 border border-rose-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Payment Rejected
                  </span>
                )}
              </div>
            </div>

            {/* Notice banner for non-confirmed states */}
            {isAwaiting && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span>Payment received, we are verifying it</span>
                </div>
                <p className="text-amber-800 text-xs sm:text-sm">
                  We have logged your transaction ID (UTR: <code className="font-mono font-bold">{order.utr}</code>). Our sanctuary reader is cross-checking with our bank credit. You will receive an email once confirmed.
                </p>
              </div>
            )}

            {!isConfirmed && !isAwaiting && !isRejected && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span>Payment Pending</span>
                </div>
                <p className="text-amber-800 text-xs sm:text-sm">
                  Your booking is currently on hold. Please complete the UPI payment and submit your 12-digit UTR to confirm your reading reservation.
                </p>
                <div className="pt-2">
                  <Button href="/book" size="sm" variant="primary">
                    Complete UPI Payment
                  </Button>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-300 text-sm space-y-3">
                <div className="flex items-center gap-2 text-wine-800 font-semibold">
                  <AlertCircle className="w-5 h-5 text-wine-600" />
                  <span>Payment Verification Unsuccessful</span>
                </div>
                <p className="text-wine-800 text-xs sm:text-sm">
                  Reason: {order.rejection_reason || "The transaction reference could not be verified in our bank statement."}
                </p>
                <div className="pt-2">
                  <Button href="/book" size="sm" variant="primary">
                    Retry Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Seeker Query & Information */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-ink font-medium">
                Reading Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-blush-100/40 p-5 rounded-2xl border border-blush-300">
                <div>
                  <span className="text-xs text-ink-soft block uppercase tracking-wider">
                    Seeker Name
                  </span>
                  <span className="font-medium text-ink">{order.customer_name}</span>
                </div>
                <div>
                  <span className="text-xs text-ink-soft block uppercase tracking-wider">
                    Email Address
                  </span>
                  <span className="font-medium text-ink">{order.customer_email}</span>
                </div>
                {order.contact_mode && (
                  <div>
                    <span className="text-xs text-ink-soft block uppercase tracking-wider">
                      Selected Session Mode
                    </span>
                    <span className="font-semibold text-wine-600 uppercase">
                      {order.contact_mode === "chat" ? "Live Chat" : "Voice / Video Call"}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-ink-soft block uppercase tracking-wider">
                    Amount
                  </span>
                  <span className="font-serif text-base text-wine-600 font-medium">
                    {order.currency === "USD"
                      ? formatPriceUSD(order.amount)
                      : formatPriceINR(order.amount)}
                  </span>
                </div>
              </div>

              {order.question && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs text-ink-soft uppercase tracking-wider font-semibold">
                    Focus Question / Life Crossroads:
                  </span>
                  <p className="p-4 rounded-xl bg-ivory border border-blush-300 italic text-sm text-ink leading-relaxed">
                    &quot;{order.question}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Next Steps / Turnaround */}
            {isConfirmed && (
              <div className="p-5 rounded-2xl bg-ivory border border-blush-300 space-y-3 text-xs sm:text-sm text-ink-soft">
                <h4 className="font-semibold text-ink uppercase tracking-wider text-xs">
                  What to expect next:
                </h4>
                <ul className="space-y-2 list-disc pl-4">
                  {order.service_type === "live" ? (
                    <li>
                      {siteConfig.readerName} will reach out at your scheduled appointment time via your chosen mode (
                      <strong className="text-wine-600 uppercase">{order.contact_mode || "call"}</strong>).
                    </li>
                  ) : (
                    <li>
                      Your bespoke illustrated PDF reading is being intuitively prepared and will arrive within 48 to 72 hours.
                    </li>
                  )}
                  <li>
                    Bookmark this private link anytime to check reading fulfillment.
                  </li>
                </ul>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center border-t border-blush-300">
              <span className="text-xs text-ink-soft">
                Tarot with Jiji Sanctuary
              </span>
              <Button href="/" variant="outline" size="sm">
                Return to Sanctuary
              </Button>
            </div>
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function PrivateOrderPage(props: OrderPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center font-serif text-xl">
          Loading sanctuary order...
        </div>
      }
    >
      <OrderContent {...props} />
    </Suspense>
  );
}
