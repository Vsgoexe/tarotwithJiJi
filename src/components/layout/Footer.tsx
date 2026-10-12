import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export const Footer: React.FC = () => {
  const currentYear = 2026;

  return (
    <footer className="bg-blush-100/60 border-t border-blush-300 pt-16 pb-12 text-ink">
      <Container className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Wordmark and bio summary */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-baseline font-serif tracking-tight text-ink group hover:text-wine-600 transition-colors focus-visible:outline-wine-600"
              aria-label={siteConfig.name}
            >
              <span className="text-3xl sm:text-4xl font-normal tracking-tight">Tarot</span>
              <span className="font-serif italic font-normal text-[0.82em] text-ink-soft/90 px-2">with</span>
              <span className="text-3xl sm:text-4xl font-normal tracking-tight">Jiji</span>
            </Link>
            <p className="text-ink-soft text-sm sm:text-base max-w-sm leading-relaxed">
              Quiet clarity and heartfelt guidance for life&apos;s crossroads.
              Bespoke live sessions and written card spreads crafted with reverence.
            </p>
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4 text-wine-600">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Instagram @${siteConfig.social.instagramHandle}`}
                  className="inline-flex items-center gap-2 hover:text-wine-700 transition-colors text-sm font-medium"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>@{siteConfig.social.instagramHandle}</span>
                </a>
                {siteConfig.social.youtube && (
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="p-1.5 rounded-full hover:bg-blush-300/50 transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                      <polygon points="10 15 15 12 10 9 10 15" />
                    </svg>
                  </a>
                )}
                {siteConfig.social.pinterest && (
                  <a
                    href={siteConfig.social.pinterest}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Pinterest"
                    className="p-1.5 rounded-full hover:bg-blush-300/50 transition-colors"
                  >
                    <Compass strokeWidth={1.25} className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="text-xs text-ink-soft">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-wine-600 transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <Link
                  href="/services"
                  className="hover:text-wine-600 transition-colors"
                >
                  Readings & Offerings
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-wine-600 transition-colors"
                >
                  About {siteConfig.readerName}
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-wine-600 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-wine-600 transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-wine-600 transition-colors"
                >
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and trust */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
              Legal & Disclaimers
            </h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              {siteConfig.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-wine-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <p className="text-xs text-ink-soft/90 leading-relaxed italic border-l-2 border-blush-300 pl-3">
                {siteConfig.disclaimer}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-blush-300 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-soft gap-4">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="font-serif italic text-wine-600 text-sm">
            Handcrafted with calm & presence.
          </p>
        </div>
      </Container>
    </footer>
  );
};
