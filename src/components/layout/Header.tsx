"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency, isUSDEnabled } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isScrolled
          ? "bg-ivory/95 backdrop-blur-none border-b border-blush-300 py-3 shadow-[0_4px_20px_-8px_rgba(122,46,69,0.12)]"
          : "bg-transparent py-5 sm:py-6"
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Logo Wordmark Left */}
        <Link
          href="/"
          className="group inline-flex items-baseline font-serif tracking-tight text-ink hover:text-wine-600 transition-colors focus-visible:outline-wine-600"
          aria-label={siteConfig.name}
        >
          <span className="text-2xl sm:text-[1.75rem] font-normal tracking-tight">Tarot</span>
          <span className="font-serif italic font-normal text-[0.82em] text-ink-soft/90 px-1.5">with</span>
          <span className="text-2xl sm:text-[1.75rem] font-normal tracking-tight">Jiji</span>
        </Link>

        {/* Desktop Nav Center */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main Navigation"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide text-ink-soft hover:text-wine-600 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Currency Toggle + CTA Button */}
        <div className="hidden md:flex items-center gap-5">
          {/* Subtle currency toggle (shown only when USD payments enabled) */}
          {isUSDEnabled && (
            <div
              className="flex items-center p-1 rounded-full bg-blush-100 border border-blush-300 text-xs font-medium"
              role="group"
              aria-label="Select Currency"
            >
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer",
                  currency === "INR"
                    ? "bg-wine-600 text-ivory font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                )}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer",
                  currency === "USD"
                    ? "bg-wine-600 text-ivory font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                )}
              >
                $ USD
              </button>
            </div>
          )}

          <Button href="/services" size="sm" variant="primary">
            Book a reading
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 text-ink hover:text-wine-600 focus-visible:outline-wine-600 rounded-md"
          >
            <Menu strokeWidth={1.25} className="w-6 h-6" />
          </button>
        </div>
      </Container>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-ivory border-l border-blush-300 p-6 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-blush-300">
                <div className="inline-flex items-baseline font-serif tracking-tight text-ink">
                  <span className="text-xl font-normal">Tarot</span>
                  <span className="font-serif italic font-normal text-[0.82em] text-ink-soft/90 px-1">with</span>
                  <span className="text-xl font-normal">Jiji</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-ink-soft hover:text-wine-600 rounded-md"
                >
                  <X strokeWidth={1.25} className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col space-y-5">
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-2xl text-ink hover:text-wine-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-blush-300 space-y-4">
              {isUSDEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-soft font-medium uppercase tracking-wider">
                    Currency
                  </span>
                  <div className="flex items-center p-0.5 rounded-full bg-blush-100 border border-blush-300 text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrency("INR")}
                      className={cn(
                        "px-3 py-1 rounded-full transition-all",
                        currency === "INR"
                          ? "bg-wine-600 text-ivory font-medium"
                          : "text-ink-soft"
                      )}
                    >
                      INR
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={cn(
                        "px-3 py-1 rounded-full transition-all",
                        currency === "USD"
                          ? "bg-wine-600 text-ivory font-medium"
                          : "text-ink-soft"
                      )}
                    >
                      USD
                    </button>
                  </div>
                </div>
              )}

              <Button
                href="/services"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a reading
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
