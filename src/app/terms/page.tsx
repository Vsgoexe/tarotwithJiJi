import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { FloralCorner } from "@/components/ui/FloralCorner";

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description: `Terms and conditions of service for booking tarot consultations with ${siteConfig.name}.`,
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36">
        <section className="relative py-14 sm:py-20 bg-paper border-b border-blush-300">
          <FloralCorner position="top-left" size={260} opacity={0.6} />
          <Container className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-script text-3xl text-wine-600 block">
              honor & agreement
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight">
              Terms of Service
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
                  1. Acceptance of Terms
                </h2>
                <p className="text-ink-soft">
                  By accessing this website and purchasing any consultation or
                  reading offered by {siteConfig.name}, you agree to be bound by
                  these Terms of Service. If you do not agree, please refrain from
                  booking a reading.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  2. Mandatory Guidance & Entertainment Disclaimer
                </h2>
                <div className="p-4 rounded-xl bg-paper border border-blush-300 text-sm text-ink-soft space-y-2">
                  <p>
                    All tarot readings, written manuscripts, and live consultations
                    are provided for intuitive guidance, personal self-reflection,
                    and entertainment purposes only.
                  </p>
                  <p>
                    Tarot consultations are <strong>not</strong> a substitute for
                    licensed medical treatment, psychological evaluation, legal
                    representation, or certified financial advice. You retain sole
                    responsibility for all choices and actions taken following a session.
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  3. Age of Majority
                </h2>
                <p className="text-ink-soft">
                  You must be at least 18 years of age (or the legal age of majority
                  in your jurisdiction) to purchase a reading from this website.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  4. Attendance & Late Arrival (Live Readings)
                </h2>
                <p className="text-ink-soft">
                  Clients are expected to arrive on time for their scheduled video
                  sessions. The room will remain open for 15 minutes past the start
                  time. Sessions will conclude at the pre-allocated finish time regardless
                  of client tardiness.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  5. Intellectual Property
                </h2>
                <p className="text-ink-soft">
                  Written reading documents, bespoke PDF artworks, and text authored
                  by {siteConfig.readerName} are licensed to you for personal, non-commercial use.
                  Reproduction or public commercial redistribution is strictly prohibited.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  6. Amendments
                </h2>
                <p className="text-ink-soft">
                  We reserve the right to update these terms as needed. Revisions
                  will be published directly to this page.
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
