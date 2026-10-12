import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { FloralCorner } from "@/components/ui/FloralCorner";

export const metadata: Metadata = {
  title: `Refund & Rescheduling Policy | ${siteConfig.name}`,
  description: `Cancellation, rescheduling, and refund terms for tarot consultations at ${siteConfig.name}.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36">
        <section className="relative py-14 sm:py-20 bg-paper border-b border-blush-300">
          <FloralCorner position="top-left" size={260} opacity={0.6} />
          <Container className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-script text-3xl text-wine-600 block">
              clarity & consideration
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xs uppercase tracking-widest text-ink-soft">
              Last Updated: October 2026 • Status: Draft
            </p>
          </Container>
        </section>

        <section className="py-16 sm:py-24 bg-blush-100/50">
          <Container className="max-w-3xl">
            <div className="mb-6 p-4 rounded-xl bg-blush-100 border border-blush-300 text-xs text-wine-700 italic">
              <strong>Note:</strong> TODO: review with a legal professional before launch.
            </div>

            <Card className="space-y-8 text-ink text-base leading-relaxed p-8 sm:p-12">
              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  1. Nature of Bespoke Intuitive Services
                </h2>
                <p className="text-ink-soft">
                  Because consultations involve the reservation of personalized
                  time slots and energetic preparation dedicated solely to you,
                  all sales are considered final once completed or delivered.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  2. Rescheduling Policy (Live Video Readings)
                </h2>
                <p className="text-ink-soft">
                  We understand unforeseen life circumstances arise. You may
                  reschedule your confirmed appointment without penalty up to{" "}
                  <strong>24 hours prior</strong> to the scheduled start time using
                  the calendar link in your booking confirmation or by writing to{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-wine-600 underline">
                    {siteConfig.email}
                  </a>.
                </p>
                <p className="text-ink-soft">
                  Rescheduling requests made with less than 24 hours&apos; notice
                  cannot be accommodated, as that slot was held exclusively for you
                  and prevented other seekers from booking.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  3. Written Keepsake Readings
                </h2>
                <p className="text-ink-soft">
                  Once your written order has been placed and payment confirmed,
                  preparation begins promptly in meditation. Written readings are
                  non-refundable once payment has cleared. If there is a typographical
                  error or delivery transmission delay, we will gladly re-issue your
                  document.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  4. Reader Cancellation or Unforeseen Emergencies
                </h2>
                <p className="text-ink-soft">
                  In the rare event that {siteConfig.readerName} is unable to conduct
                  a scheduled live reading due to acute illness or emergency, you will
                  be contacted promptly and offered your choice of an immediate
                  rescheduled time or a 100% full refund to your original payment method.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  5. Payment Inquiries
                </h2>
                <p className="text-ink-soft">
                  For any billing inquiries or duplicate transaction concerns, please
                  contact our sanctuary at{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-wine-600 underline">
                    {siteConfig.email}
                  </a>{" "}
                  with your order number.
                </p>
              </section>
            </Card>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
