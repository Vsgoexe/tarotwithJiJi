import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { readerProfile } from "@/config/reader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FloralCorner } from "@/components/ui/FloralCorner";

// SEO Metadata: meta description = paragraph_1's first sentence
const firstSentence = readerProfile.paragraphs[0].split(". ")[0] + ".";

export const metadata: Metadata = {
  title: readerProfile.headline,
  description: firstSentence,
  openGraph: {
    title: `${readerProfile.headline} | ${siteConfig.name}`,
    description: firstSentence,
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: siteConfig.name }],
  },
};

export default function AboutPage() {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.readerName,
    jobTitle: "Tarot Reader & Astrologer",
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
    description: readerProfile.paragraphs[0],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
      />

      <Header />

      <main className="flex-grow pt-28 sm:pt-36">
        {/* Editorial Narrative Section */}
        <Section variant="paper" className="relative py-16 sm:py-24">
          <FloralCorner position="top-left" size={280} opacity={0.65} />
          <FloralCorner position="bottom-right" size={280} opacity={0.65} />

          <Container className="relative z-10 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Portrait & Credentials Chips */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-6">
                <div className="relative w-full max-w-sm">
                  <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-blush-100 border border-blush-300 shadow-[0_20px_50px_-30px_rgba(122,46,69,0.25)]">
                    <Image
                      src="/images/reader-portrait.jpg"
                      alt={`Portrait of ${siteConfig.readerName}, Tarot Reader & Astrologer`}
                      fill
                      priority
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Credentials Chips (Derived only from copy, with subtle gold-hair star icon, aria-hidden, no emoji) */}
                <div className="w-full max-w-sm space-y-2.5">
                  {readerProfile.credentials.map((chip, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-ivory border border-blush-300 text-xs sm:text-sm font-medium text-ink shadow-xs"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C9A27A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>{chip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Single H1 & Verbatim Copy */}
              <div className="lg:col-span-7 space-y-8">
                {/* Single H1 per page */}
                <div className="space-y-3">
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight text-balance">
                    {readerProfile.headline}
                  </h1>
                </div>

                {/* Verbatim Paragraphs 1-4 with 17-18px body, 1.7 line-height, max-width 65ch */}
                <div className="space-y-6 text-ink text-[17px] sm:text-[18px] leading-[1.7] max-w-[65ch]">
                  <p>{readerProfile.paragraphs[0]}</p>
                  <p>{readerProfile.paragraphs[1]}</p>
                  <p>{readerProfile.paragraphs[2]}</p>
                  <p>{readerProfile.paragraphs[3]}</p>
                </div>

                {/* Closing Flourishes & CTA */}
                <div className="pt-6 border-t border-blush-300 space-y-5">
                  {/* Closing script line (the ONLY script text on the page) */}
                  <div className="font-script text-3xl sm:text-4xl text-wine-600 block leading-tight">
                    {readerProfile.closingScriptLine}
                  </div>

                  {/* Closing line in Cormorant Garamond serif */}
                  <div className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug">
                    {readerProfile.closingLine}
                  </div>

                  <div className="pt-3">
                    <Button href="/services" size="lg" variant="primary">
                      Book a reading
                    </Button>
                  </div>
                </div>

                {/* Visible guidance and entertainment disclaimer */}
                <div className="pt-6 border-t border-blush-300">
                  <p className="text-xs text-ink-soft italic leading-relaxed bg-blush-100/60 p-4 rounded-xl border border-blush-300/80">
                    {siteConfig.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
