"use client";

import React, { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FloralCorner } from "@/components/ui/FloralCorner";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled client error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center relative py-32 sm:py-44 bg-paper overflow-hidden">
        <FloralCorner position="top-left" size={280} opacity={0.65} />
        <FloralCorner position="bottom-right" size={280} opacity={0.65} />

        <Container className="relative z-10 text-center max-w-xl mx-auto space-y-6">
          <span className="font-script text-3xl sm:text-4xl text-wine-600 block">
            a gentle pause
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            Something unexpected occurred.
          </h1>

          <p className="text-ink-soft text-base leading-relaxed max-w-md mx-auto">
            We encountered a temporary ripple in the session. Please try refreshing
            or return to the home sanctuary.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button type="button" onClick={() => reset()} size="lg" variant="primary">
              Try Again
            </Button>
            <Button href="/" size="lg" variant="outline">
              Return Home
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
