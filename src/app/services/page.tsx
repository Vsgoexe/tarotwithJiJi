import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Video, FileText, CheckCircle2, Clock, Sparkles, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { FloralCorner } from "@/components/ui/FloralCorner";
import { AUTHORITATIVE_SERVICES } from "@/lib/services";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export const metadata: Metadata = {
  title: `Readings & Offerings | ${siteConfig.name}`,
  description:
    "Explore our complete collection of intuitive tarot consultations: live sessions via chat or call, and bespoke written keepsake spreads.",
};

export default function ServicesPage() {
  const liveServices = AUTHORITATIVE_SERVICES.filter((s) => s.type === "live");
  const writtenServices = AUTHORITATIVE_SERVICES.filter((s) => s.type === "written");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36">
        {/* Page Header */}
        <section className="relative py-16 sm:py-20 bg-paper overflow-hidden border-b border-blush-300">
          <FloralCorner position="top-left" size={280} opacity={0.65} />
          <FloralCorner position="bottom-right" size={280} opacity={0.65} />

          <Container className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
            <span className="font-script text-3xl sm:text-4xl text-wine-600 block">
              sacred consultations
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-normal tracking-tight">
              Readings & Offerings
            </h1>
            <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
              Every consultation is held with reverence and gentle presence. Explore our
              live sessions (held via chat or call) and written keepsake readings below.
            </p>
          </Container>
        </section>

        {/* Live Consultations */}
        <Section id="live" variant="blush">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-wine-600">
              Real-Time Consultations
            </span>
            <Heading level={2} size="h2">
              Live Readings
            </Heading>
            <p className="text-ink-soft text-base">
              Dedicated 1-on-1 sessions with {siteConfig.readerName} to pull cards and explore your path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {liveServices.map((service) => (
              <Card
                key={service.id}
                hoverable
                className="flex flex-col justify-between space-y-8"
              >
                <div className="space-y-6">
                  <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-blush-100 border border-blush-300">
                    <Image
                      src={service.image || "/images/services/tarot-1hr.jpg"}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory/95 border border-blush-300 text-xs font-medium text-wine-600">
                      <Video strokeWidth={1.25} className="w-3.5 h-3.5" />
                      <span>{service.duration_minutes} min live</span>
                    </div>

                    {service.slug === "tarot-1hr" && (
                      <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wine-600 text-ivory text-xs font-medium shadow-xs">
                        <MessageCircle strokeWidth={1.25} className="w-3.5 h-3.5" />
                        <span>Chat or Call</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                        {service.name}
                      </h3>
                      <div className="font-serif text-2xl text-wine-600 font-medium">
                        <PriceDisplay service={service} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-soft font-medium">
                      <Clock strokeWidth={1.25} className="w-3.5 h-3.5 text-wine-600" />
                      <span>{service.duration_minutes} Minutes Duration</span>
                    </div>
                  </div>

                  <p className="text-ink-soft text-base leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-blush-300 text-sm text-ink-soft">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 strokeWidth={1.25} className="w-4 h-4 text-wine-600" />
                      <span>Direct 1-on-1 private sacred room with {siteConfig.readerName}</span>
                    </div>
                    {service.slug === "tarot-1hr" ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 strokeWidth={1.25} className="w-4 h-4 text-wine-600" />
                        <span>Your choice of live Chat or Call selected at booking</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 strokeWidth={1.25} className="w-4 h-4 text-wine-600" />
                        <span>Focused in-depth exploration of your specific query</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 strokeWidth={1.25} className="w-4 h-4 text-wine-600" />
                      <span>Photographic record of all drawn cards emailed post-session</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-blush-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-soft block">
                      Price
                    </span>
                    <div className="font-serif text-2xl text-ink font-medium">
                      <PriceDisplay service={service} />
                    </div>
                  </div>
                  <Button href={`/book?service=${service.slug}`} variant="primary">
                    Book {service.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Written Keepsake Readings */}
        <Section id="written" variant="paper">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-wine-600">
              Archival Written Keepsakes
            </span>
            <Heading level={2} size="h2">
              Written Readings
            </Heading>
            <p className="text-ink-soft text-base">
              Meticulously channeled and delivered as an archival PDF document straight to your inbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {writtenServices.map((service) => (
              <Card
                key={service.id}
                hoverable
                className="flex flex-col justify-between space-y-6"
              >
                <div className="space-y-5">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-blush-100 border border-blush-300">
                    <Image
                      src={service.image || "/images/services/pick-a-card.jpg"}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-ivory/95 border border-blush-300 text-xs font-medium text-wine-600">
                      <FileText strokeWidth={1.25} className="w-3 h-3" />
                      <span>Written reading</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-xl sm:text-2xl text-ink font-medium">
                        {service.name}
                      </h3>
                      <div className="font-serif text-xl text-wine-600 font-medium whitespace-nowrap">
                        <PriceDisplay service={service} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                      <Clock strokeWidth={1.25} className="w-3.5 h-3.5 text-wine-600" />
                      <span>Delivered within 48 hours</span>
                    </div>
                  </div>

                  <p className="text-ink-soft text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-blush-300 text-xs text-ink-soft">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 strokeWidth={1.25} className="w-3.5 h-3.5 text-wine-600" />
                      <span>Digital illustrated PDF keepsake</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 strokeWidth={1.25} className="w-3.5 h-3.5 text-wine-600" />
                      <span>Permanently saved on private link</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-blush-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-soft block">
                      Price
                    </span>
                    <div className="font-serif text-xl text-ink font-medium">
                      <PriceDisplay service={service} />
                    </div>
                  </div>
                  <Button href={`/book?service=${service.slug}`} size="sm" variant="primary">
                    Order
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
