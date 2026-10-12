"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Calendar, Mail, FileText, ArrowRight, MessageCircle, PhoneCall } from "lucide-react";
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

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch(`/api/orders?publicId=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error("Error fetching order:", err))
      .finally(() => setLoading(false));
  }, [orderId]);

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
                A confirmation has been dispatched to your email address.
              </p>
            </div>

            {order && (
              <div className="bg-blush-100/50 rounded-2xl p-6 border border-blush-300 text-left space-y-3 text-sm">
                <div className="flex justify-between border-b border-blush-300 pb-2">
                  <span className="text-ink-soft">Order Reference:</span>
                  <span className="font-mono text-xs font-semibold text-ink">{order.public_id}</span>
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
            )}

            <div className="space-y-3 text-xs sm:text-sm text-ink-soft text-left bg-ivory p-5 rounded-xl border border-blush-300">
              <h4 className="font-semibold text-ink uppercase tracking-wider text-xs">
                What happens next:
              </h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>Check your inbox for your detailed receipt and calendar link.</li>
                {order?.service_slug === "tarot-1hr" ? (
                  <li>
                    {siteConfig.readerName} will connect with you via your chosen mode (
                    <strong className="text-wine-600 uppercase">{order.contact_mode || "call"}</strong>) at your scheduled session time.
                  </li>
                ) : (
                  <li>
                    For written readings, your archival illustrated PDF will arrive within 48 to 72 hours.
                  </li>
                )}
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button href="/" variant="primary">
                Return to Sanctuary
              </Button>
              <Button href="/services" variant="outline">
                Browse Other Readings
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
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center font-serif text-xl">Loading order receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
