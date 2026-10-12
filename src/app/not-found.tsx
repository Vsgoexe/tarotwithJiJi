import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FloralCorner } from "@/components/ui/FloralCorner";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center relative py-32 sm:py-44 bg-paper overflow-hidden">
        <FloralCorner position="top-left" size={280} opacity={0.65} />
        <FloralCorner position="bottom-right" size={280} opacity={0.65} />

        <Container className="relative z-10 text-center max-w-xl mx-auto space-y-6">
          <span className="font-script text-3xl sm:text-4xl text-wine-600 block">
            an uncharted path
          </span>

          <div className="font-serif text-6xl sm:text-7xl lg:text-8xl text-wine-600 font-light tracking-tight">
            404
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            This card has not yet been drawn.
          </h1>

          <p className="text-ink-soft text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            The page you are looking for may have moved or gently dissolved into
            the ether. Let us return you to the sanctuary.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/" size="lg" variant="primary">
              Return to Sanctuary
            </Button>
            <Button href="/services" size="lg" variant="outline">
              Explore Readings
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
