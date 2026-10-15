"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Mail,
  FileText,
  ArrowRight,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FloralCorner } from "@/components/ui/FloralCorner";
import { formatPriceINR, formatPriceUSD } from "@/lib/services";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setFetchError("No order reference provided.");
      return;
    }

    fetch(`/api/orders?publicId=${encodeURIComponent(orderId)}`)
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
          setFetchError("Order could not be located.");
        }
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setFetchError(err.message || "Failed to load order receipt.");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-36 pb-24 flex items-center justify-center">
          <div className="text-center space-y-3 font-serif text-ink">
            <div className="w-10 h-10 border-2 border-wine-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-sans text-ink-soft">Verifying order status with sanctuary...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="flex flex-col min-h-screen">
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
                  {fetchError || "The order reference appears invalid or has expired."}
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

  // If order is awaiting verification or pending payment
  if (!isConfirmed) {
    const isAwaiting = order.status === "awaiting_verification";

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-28 sm:pt-36 pb-24">
          <Container className="max-w-2xl pt-10">
            <Card className="p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
              <FloralCorner position="top-left" size={200} opacity={0.6} />

              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-800 mx-auto flex items-center justify-center">
                <Clock strokeWidth={1.5} className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-script text-3xl text-wine-600 block">
                  {isAwaiting ? "verification in progress" : "payment status"}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
                  {isAwaiting
                    ? "Payment Received — We Are Verifying It"
                    : "Payment Pending"}
                </h1>
                <p className="text-ink-soft text-sm sm:text-base">
                  {isAwaiting
                    ? "Payment received, we are verifying it. You will get an email once confirmed."
                    : "Your booking is on hold. Please complete payment and submit your 12-digit UTR to confirm."}
                </p>
              </div>

              <div className="bg-blush-100/50 rounded-2xl p-6 border border-blush-300 text-left space-y-3 text-sm">
                <div className="flex justify-between border-b border-blush-300 pb-2">
                  <span className="text-ink-soft">Order Reference:</span>
                  <span className="font-mono text-xs font-semibold text-ink">{order.public_id}</span>
                </div>
                <div className="flex justify-between border-b border-blush-300 pb-2">
                  <span className="text-ink-soft">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    {isAwaiting ? "Awaiting Verification" : "Pending Payment"}
                  </span>
                </div>
                {order.utr && (
                  <div className="flex justify-between border-b border-blush-300 pb-2">
                    <span className="text-ink-soft">Submitted UTR:</span>
                    <span className="font-mono text-xs font-bold text-wine-600">{order.utr}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-blush-300 pb-2">
                  <span className="text-ink-soft">Service:</span>
                  <strong className="text-ink font-serif text-base">{order.service_name}</strong>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-ink-soft">Amount:</span>
                  <strong className="text-wine-600 font-serif text-lg">
                    {formatPriceINR(order.amount)}
                  </strong>
                </div>
              </div>

              <div className="p-4 bg-ivory rounded-xl border border-blush-300 text-xs text-ink-soft text-left space-y-2">
                <p>
                  {isAwaiting
                    ? "Our sanctuary reader is personally cross-checking the bank transaction credit. You will receive an official confirmation email with all reading details as soon as it is approved."
                    : "You may return to the booking page anytime to submit your UPI UTR reference."}
                </p>
                <p>
                  Your private reading link:{" "}
                  <Link href={`/order/${order.public_id}`} className="text-wine-600 underline font-mono">
                    /order/{order.public_id}
                  </Link>
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => window.location.reload()} variant="primary">
                  Refresh Status
                </Button>
                <Button href="/" variant="outline">
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

  // Confirmed payment state
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36 pb-24">
        <Container className="max-w-2xl pt-10">
          <Card className="p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
            <FloralCorner position="top-left" size={200} opacity={0.6} />

            <div className="w-16 h-16 rounded-full bg-blush-100 border border-blush-300 text-wine-600 mx-auto flex items-center justify-center">
              <CheckCircle2 strokeWidth={1.25} className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-script text-3xl text-wine-600 block">blessed presence</span>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
                Your Reading is Confirmed
              </h1>
              <p className="text-ink-soft text-sm sm:text-base">
                Your payment has been verified. A confirmation receipt has been dispatched to {order.customer_email}.
              </p>
            </div>

            <div className="bg-blush-100/50 rounded-2xl p-6 border border-blush-300 text-left space-y-3 text-sm">
              <div className="flex justify-between border-b border-blush-300 pb-2">
                <span className="text-ink-soft">Order Reference:</span>
                <span className="font-mono text-xs font-semibold text-ink">{order.public_id}</span>
              </div>
              <div className="flex justify-between border-b border-blush-300 pb-2">
                <span className="text-ink-soft">Payment Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                  Verified & Paid
                </span>
              </div>
              <div className="flex justify-between border-b border-blush-300 pb-2">
                <span className="text-ink-soft">Service:</span>
                <strong className="text-ink font-serif text-base">{order.service_name}</strong>
              </div>
              {order.contact_mode && (
                <div className="flex justify-between border-b border-blush-300 pb-2">
                  <span className="text-ink-soft">Selected Mode:</span>
                  <strong className="text-wine-600 uppercase font-semibold">
                    {order.contact_mode === "chat" ? "Chat (Live Messaging)" : "Call (Voice/Video)"}
                  </strong>
                </div>
              )}
              <div className="flex justify-between border-b border-blush-300 pb-2">
                <span className="text-ink-soft">Seeker Name:</span>
                <span className="text-ink font-medium">{order.customer_name}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-soft">Amount Paid:</span>
                <strong className="text-wine-600 font-serif text-lg">
                  {order.currency === "USD"
                    ? formatPriceUSD(order.amount)
                    : formatPriceINR(order.amount)}
                </strong>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-ink-soft text-left bg-ivory p-5 rounded-xl border border-blush-300">
              <h4 className="font-semibold text-ink uppercase tracking-wider text-xs">
                What happens next:
              </h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>Check your inbox for your detailed receipt and reading reference.</li>
                {order.service_type === "live" ? (
                  <li>
                    {siteConfig.readerName} will connect with you via your chosen mode (
                    <strong className="text-wine-600 uppercase">{order.contact_mode || "call"}</strong>) at your session time.
                  </li>
                ) : (
                  <li>
                    For written readings, your archival illustrated PDF will arrive within 48 to 72 hours.
                  </li>
                )}
                <li>
                  Your private sanctuary link is always available at:{" "}
                  <Link href={`/order/${order.public_id}`} className="text-wine-600 underline font-mono text-xs">
                    /order/{order.public_id}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button href={`/order/${order.public_id}`} variant="primary">
                View Private Order Page
              </Button>
              <Button href="/" variant="outline">
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

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center font-serif text-xl">
          Loading order receipt...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
