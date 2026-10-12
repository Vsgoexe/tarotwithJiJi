import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { FloralCorner } from "@/components/ui/FloralCorner";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy policy and personal data protection standards for ${siteConfig.name}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36">
        <section className="relative py-14 sm:py-20 bg-paper border-b border-blush-300">
          <FloralCorner position="top-left" size={260} opacity={0.6} />
          <Container className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-script text-3xl text-wine-600 block">
              privacy & sanctity
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight">
              Privacy Policy
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
                  1. Overview & Commitment to Discretion
                </h2>
                <p className="text-ink-soft">
                  At {siteConfig.name}, we hold your personal sanctuary in highest regard.
                  This Privacy Policy describes how we collect, store, and safeguard
                  the information you provide when using our website and scheduling
                  consultations.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  2. Information We Collect
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-ink-soft">
                  <li>
                    <strong>Client Identification:</strong> Name, email address,
                    and optional phone number provided during booking or contact.
                  </li>
                  <li>
                    <strong>Consultation Details:</strong> The focus question,
                    intuitive query, and optional birth details you submit for your reading.
                  </li>
                  <li>
                    <strong>Transactional Records:</strong> Order IDs, amounts, and
                    currencies processed securely via Razorpay. We never see or store
                    your raw credit/debit card numbers or bank credentials.
                  </li>
                  <li>
                    <strong>Technical Usage:</strong> Geographic country detection
                    (for automatic INR/USD currency selection) and session cookies.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  3. Use of Information
                </h2>
                <p className="text-ink-soft">
                  Your information is utilized solely to prepare your consultation,
                  coordinate scheduling, send calendar invitations, deliver written
                  PDF keepsakes, and communicate important service notifications. We
                  never sell, rent, or trade your data to any third party for marketing.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  4. Confidentiality of Readings
                </h2>
                <p className="text-ink-soft">
                  All discussions, card layouts, recordings (if agreed), and notes
                  from your reading are strictly confidential between you and{" "}
                  {siteConfig.readerName}. We will never share personal disclosures
                  without your express written permission.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  5. Storage & Retention
                </h2>
                <p className="text-ink-soft">
                  Written readings are archived within private, encrypted cloud storage
                  buckets. Customer access is provisioned strictly through short-lived,
                  cryptographically signed URLs tied to your unguessable order token.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">
                  6. Contact & Rights
                </h2>
                <p className="text-ink-soft">
                  You have the right to request access to or deletion of your stored
                  consultation inquiries at any time. For questions regarding this
                  policy, please email us directly at{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-wine-600 underline">
                    {siteConfig.email}
                  </a>.
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
