"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { FloralCorner } from "@/components/ui/FloralCorner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot spam trap
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for bot spam

    setIsSubmitting(true);
    // Phase 2 UI feedback simulation (Resend API hooked up in upcoming phase)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36">
        <section className="relative py-16 sm:py-20 bg-paper overflow-hidden border-b border-blush-300">
          <FloralCorner position="top-left" size={280} opacity={0.65} />
          <FloralCorner position="bottom-right" size={280} opacity={0.65} />

          <Container className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
            <span className="font-script text-3xl sm:text-4xl text-wine-600 block">
              reach out
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-normal tracking-tight">
              Contact & Inquiries
            </h1>
            <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
              Have a question regarding session availability, custom private
              events, or choosing the right reading format? Send a gentle note below.
            </p>
          </Container>
        </section>

        <Section variant="blush" className="relative">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Info / FAQ reminder Column */}
            <div className="md:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-wine-600">
                  Direct Inquiries
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                  We reply within 24 to 48 hours.
                </h3>
                <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
                  Every message is read personally by {siteConfig.readerName}. Please note
                  that intuitive questions regarding your situation are answered
                  within booked readings rather than over email.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-blush-300">
                <div className="flex items-start gap-3 text-ink-soft text-sm">
                  <Mail strokeWidth={1.25} className="w-5 h-5 text-wine-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-ink block">Direct Email</span>
                    <a href={`mailto:${siteConfig.email}`} className="text-wine-600 hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-ink-soft text-sm">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-wine-600 mt-0.5 flex-shrink-0"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-ink block">Instagram</span>
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-wine-600 hover:underline"
                    >
                      @{siteConfig.social.instagramHandle}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-ink-soft text-sm">
                  <Clock strokeWidth={1.25} className="w-5 h-5 text-wine-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-ink block">Response Hours</span>
                    <span>Monday – Friday, 10:00 AM – 6:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-ivory border border-blush-300 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-wine-600 block">
                  Quick Answer?
                </span>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Looking for details on our rescheduling rules, privacy, or payment
                  options? Check our{" "}
                  <Link href="/#faq" className="text-wine-600 underline font-medium">
                    FAQ section
                  </Link>{" "}
                  for instant answers.
                </p>
              </div>
            </div>

            {/* Form Column */}
            <div className="md:col-span-7">
              <Card className="p-8 sm:p-10">
                {submitted ? (
                  <div className="py-12 text-center space-y-5">
                    <div className="w-16 h-16 rounded-full bg-blush-100 border border-blush-300 text-wine-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 strokeWidth={1.25} className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-3xl text-ink font-medium">
                      Message Received
                    </h3>
                    <p className="text-ink-soft text-base max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out, {name || "friend"}. We have
                      received your inquiry and will be in touch with you shortly.
                    </p>
                    <div className="pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setSubmitted(false);
                          setName("");
                          setEmail("");
                          setMessage("");
                        }}
                      >
                        Send another message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hidden Honeypot Field for anti-bot spam protection */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="website_hp"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <Input
                      label="Your Name"
                      type="text"
                      required
                      placeholder="e.g. Clara Oswald"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                      label="Your Email Address"
                      type="email"
                      required
                      placeholder="clara@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Textarea
                      label="Your Message or Inquiry"
                      required
                      placeholder="Share what is on your mind regarding our offerings, scheduling, or collaborations..."
                      rows={5}
                      maxChars={800}
                      currentChars={message.length}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="md"
                        variant="primary"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
