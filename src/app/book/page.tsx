"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  PhoneCall,
  Calendar as CalendarIcon,
} from "lucide-react";
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
import { AUTHORITATIVE_SERVICES, getServicePriceUSD } from "@/lib/services";
import { useCurrency } from "@/context/CurrencyContext";
import { Service, ContactMode } from "@/types/service";

function BookingFlowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialServiceSlug = searchParams.get("service") || "tarot-1hr";

  // Step state: 1 (Service), 2 (Details), 3 (Slot - live only), 4 (Review & Pay)
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service>(() => {
    return (
      AUTHORITATIVE_SERVICES.find((s) => s.slug === initialServiceSlug) ||
      AUTHORITATIVE_SERVICES[0]
    );
  });

  // Form Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [contactMode, setContactMode] = useState<ContactMode>("chat");
  const [consent, setConsent] = useState(false);

  // Time slot for live readings
  const [selectedDate, setSelectedDate] = useState("2026-10-15");
  const [selectedSlot, setSelectedSlot] = useState("11:00 AM IST");

  // Global Currency
  const { currency, setCurrency, formatPrice } = useCurrency();

  // Loading & Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync service from query param if changed
  useEffect(() => {
    const slug = searchParams.get("service");
    if (slug) {
      const match = AUTHORITATIVE_SERVICES.find((s) => s.slug === slug);
      if (match) setSelectedService(match);
    }
  }, [searchParams]);

  const isLive = selectedService.type === "live";

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!name || !email || !question) {
        setErrorMsg("Please provide your name, email, and focus question.");
        return;
      }
      if (selectedService.slug === "tarot-1hr" && !contactMode) {
        setErrorMsg("Please choose either Chat or Call for this 1-hour session.");
        return;
      }
      if (!consent) {
        setErrorMsg("Please agree to the guidance and entertainment terms to proceed.");
        return;
      }

      // If live, proceed to slot selection; if written, proceed straight to review
      if (isLive) {
        setStep(3);
      } else {
        setStep(4);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    if (step === 4) {
      setStep(isLive ? 3 : 2);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleCreateOrderAndPay = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: selectedService.slug,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || undefined,
          question,
          birthDate: birthDate || undefined,
          contactMode: selectedService.slug === "tarot-1hr" ? contactMode : undefined,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order creation failed");
      }

      // Route to success page
      router.push(`/book/success?order=${data.publicId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while creating your order.");
      setIsSubmitting(false);
    }
  };

  const liveServices = AUTHORITATIVE_SERVICES.filter((s) => s.type === "live");
  const writtenServices = AUTHORITATIVE_SERVICES.filter((s) => s.type === "written");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36 pb-24">
        {/* Step Indicator Header */}
        <section className="py-8 bg-paper border-b border-blush-300">
          <Container className="max-w-3xl">
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className={step >= 1 ? "text-wine-600 font-semibold" : "text-ink-soft"}>
                1. Service
              </span>
              <span className="text-blush-300">──</span>
              <span className={step >= 2 ? "text-wine-600 font-semibold" : "text-ink-soft"}>
                2. Details
              </span>
              {isLive && (
                <>
                  <span className="text-blush-300">──</span>
                  <span className={step >= 3 ? "text-wine-600 font-semibold" : "text-ink-soft"}>
                    3. Time Slot
                  </span>
                </>
              )}
              <span className="text-blush-300">──</span>
              <span className={step >= 4 ? "text-wine-600 font-semibold" : "text-ink-soft"}>
                {isLive ? "4. Review & Pay" : "3. Review & Pay"}
              </span>
            </div>
          </Container>
        </section>

        <Container className="max-w-4xl pt-10">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-400/15 border border-rose-400 text-sm text-wine-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: SERVICE PICKER */}
          {step === 1 && (
            <div className="space-y-10">
              <div className="text-center space-y-2">
                <span className="font-script text-3xl text-wine-600 block">step one</span>
                <Heading level={1} size="h2" className="text-center">
                  Select Your Reading
                </Heading>
                <p className="text-ink-soft text-sm sm:text-base">
                  Choose between a live 1-on-1 session or a written keepsake reading.
                </p>
              </div>

              {/* Live Readings Group */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-blush-300 pb-2">
                  <Video strokeWidth={1.25} className="w-5 h-5 text-wine-600" />
                  <h3 className="font-serif text-xl text-ink font-medium">
                    Live Readings
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveServices.map((service) => {
                    const isSelected = selectedService.slug === service.slug;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-blush-100/70 border-wine-600 shadow-md ring-1 ring-wine-600"
                            : "bg-ivory border-blush-300 hover:border-rose-400"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-blush-100 border border-blush-300">
                            <Image
                              src={service.image || "/images/services/tarot-1hr.jpg"}
                              alt={service.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 350px"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider font-semibold text-wine-600">
                              {service.duration_minutes} min live
                            </span>
                            {service.slug === "tarot-1hr" && (
                              <span className="text-xs bg-ivory px-2 py-0.5 rounded-full border border-blush-300 text-ink-soft">
                                Chat / Call
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-xl text-ink font-medium">
                            {service.name}
                          </h4>
                          <p className="text-ink-soft text-xs sm:text-sm leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-blush-300 flex items-center justify-between">
                          <span className="font-serif text-2xl text-wine-600 font-medium">
                            {formatPrice(service)}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "bg-wine-600 border-wine-600 text-ivory"
                                : "border-blush-300"
                            }`}
                          >
                            {isSelected && <Check strokeWidth={2} className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Written Readings Group */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 border-b border-blush-300 pb-2">
                  <FileText strokeWidth={1.25} className="w-5 h-5 text-wine-600" />
                  <h3 className="font-serif text-xl text-ink font-medium">
                    Written Readings
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {writtenServices.map((service) => {
                    const isSelected = selectedService.slug === service.slug;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-blush-100/70 border-wine-600 shadow-md ring-1 ring-wine-600"
                            : "bg-ivory border-blush-300 hover:border-rose-400"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-blush-100 border border-blush-300">
                            <Image
                              src={service.image || "/images/services/pick-a-card.jpg"}
                              alt={service.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 300px"
                            />
                          </div>
                          <span className="text-xs uppercase tracking-wider font-semibold text-ink-soft">
                            Written spread
                          </span>
                          <h4 className="font-serif text-lg text-ink font-medium">
                            {service.name}
                          </h4>
                          <p className="text-ink-soft text-xs leading-relaxed line-clamp-3">
                            {service.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-blush-300 flex items-center justify-between">
                          <span className="font-serif text-xl text-wine-600 font-medium">
                            {formatPrice(service)}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "bg-wine-600 border-wine-600 text-ivory"
                                : "border-blush-300"
                            }`}
                          >
                            {isSelected && <Check strokeWidth={2} className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleNextStep}>
                  Continue to Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <Card className="max-w-2xl mx-auto p-8 sm:p-12 space-y-8">
              <div className="text-center space-y-2">
                <span className="font-script text-3xl text-wine-600 block">step two</span>
                <Heading level={2} size="h2" className="text-center">
                  Share Your Focus
                </Heading>
                <p className="text-ink-soft text-sm">
                  Selected: <strong>{selectedService.name}</strong> (
                  {formatPrice(selectedService)})
                </p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-6">
                <Input
                  label="Your Full Name"
                  required
                  placeholder="e.g. Clara Oswald"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="clara@example.com"
                  helperText="Session confirmation and readings will be sent here."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* MANDATORY CONTACT MODE FOR TAROT-1HR */}
                {selectedService.slug === "tarot-1hr" && (
                  <div className="p-5 rounded-2xl bg-blush-100/60 border border-blush-300 space-y-3">
                    <label className="block text-sm font-semibold text-ink">
                      Choose Session Mode for Tarot 1hr <span className="text-wine-600">*</span>
                    </label>
                    <p className="text-xs text-ink-soft">
                      Please specify how you would like to connect with {siteConfig.readerName}:
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div
                        onClick={() => setContactMode("chat")}
                        className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          contactMode === "chat"
                            ? "bg-ivory border-wine-600 ring-1 ring-wine-600"
                            : "bg-paper border-blush-300 hover:border-wine-600"
                        }`}
                      >
                        <MessageCircle strokeWidth={1.25} className="w-5 h-5 text-wine-600" />
                        <div>
                          <span className="text-sm font-medium text-ink block">Chat</span>
                          <span className="text-xs text-ink-soft">Real-time messaging</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setContactMode("call")}
                        className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          contactMode === "call"
                            ? "bg-ivory border-wine-600 ring-1 ring-wine-600"
                            : "bg-paper border-blush-300 hover:border-wine-600"
                        }`}
                      >
                        <PhoneCall strokeWidth={1.25} className="w-5 h-5 text-wine-600" />
                        <div>
                          <span className="text-sm font-medium text-ink block">Call</span>
                          <span className="text-xs text-ink-soft">Voice or video room</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Textarea
                  label="Your Question or Life Crossroads"
                  required
                  rows={4}
                  maxChars={500}
                  currentChars={question.length}
                  placeholder="Describe what is on your heart—themes of career leap, relationship, or personal threshold..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value.slice(0, 500))}
                />

                <Input
                  label="Birth Date (Optional)"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  helperText="Helpful for astrological or numerological card alignments."
                />

                <div className="pt-2 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent-check"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-wine-600 rounded border-blush-300 focus:ring-wine-600"
                  />
                  <label htmlFor="consent-check" className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                    I understand and agree that tarot readings are offered for intuitive
                    guidance, contemplation, and entertainment purposes only.
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-blush-300">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary">
                    {isLive ? "Choose Time Slot" : "Review Order"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* STEP 3: TIME SLOT (LIVE ONLY) */}
          {step === 3 && isLive && (
            <Card className="max-w-2xl mx-auto p-8 sm:p-12 space-y-8">
              <div className="text-center space-y-2">
                <span className="font-script text-3xl text-wine-600 block">step three</span>
                <Heading level={2} size="h2" className="text-center">
                  Select Your Time Slot
                </Heading>
                <p className="text-ink-soft text-sm">
                  Duration: {selectedService.duration_minutes} minutes • Timezone: Asia/Kolkata (IST)
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Select Date</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["2026-10-15", "2026-10-16", "2026-10-17"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedDate === d
                            ? "bg-wine-600 text-ivory border-wine-600"
                            : "bg-paper border-blush-300 text-ink hover:border-wine-600"
                        }`}
                      >
                        <div className="text-xs uppercase opacity-80">Oct</div>
                        <div className="font-serif text-lg font-medium">{d.split("-")[2]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Available Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["11:00 AM IST", "02:30 PM IST", "04:00 PM IST", "06:30 PM IST"].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-center text-sm transition-all ${
                          selectedSlot === slot
                            ? "bg-wine-600 text-ivory border-wine-600"
                            : "bg-paper border-blush-300 text-ink hover:border-wine-600"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-blush-300">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" onClick={handleNextStep}>
                    Review & Pay
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* STEP 4: REVIEW & PAY */}
          {step === 4 && (
            <Card className="max-w-2xl mx-auto p-8 sm:p-12 space-y-8">
              <div className="text-center space-y-2">
                <span className="font-script text-3xl text-wine-600 block">final step</span>
                <Heading level={2} size="h2" className="text-center">
                  Review & Confirm
                </Heading>
                <p className="text-ink-soft text-sm">
                  Review your order details before proceeding to encrypted checkout.
                </p>
              </div>

              <div className="bg-blush-100/50 rounded-2xl p-6 border border-blush-300 space-y-4">
                <div className="flex justify-between items-start border-b border-blush-300 pb-3 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-blush-100 border border-blush-300 flex-shrink-0">
                      <Image
                        src={selectedService.image || "/images/services/tarot-1hr.jpg"}
                        alt={selectedService.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl text-ink font-medium">
                        {selectedService.name}
                      </h4>
                      <span className="text-xs uppercase tracking-wider text-ink-soft">
                        {selectedService.type === "live" ? `${selectedService.duration_minutes} min live` : "Written reading"}
                      </span>
                    </div>
                  </div>
                  <div className="font-serif text-3xl text-wine-600 font-medium whitespace-nowrap">
                    {formatPrice(selectedService)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-ink-soft">
                  <div className="flex justify-between">
                    <span>Seeker:</span>
                    <strong className="text-ink">{name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <strong className="text-ink">{email}</strong>
                  </div>
                  {selectedService.slug === "tarot-1hr" && (
                    <div className="flex justify-between">
                      <span>Selected Mode:</span>
                      <strong className="text-wine-600 uppercase font-semibold">{contactMode}</strong>
                    </div>
                  )}
                  {isLive && (
                    <div className="flex justify-between">
                      <span>Scheduled Slot:</span>
                      <strong className="text-ink">{selectedDate} at {selectedSlot}</strong>
                    </div>
                  )}
                  <div className="pt-2 border-t border-blush-300">
                    <span className="text-xs uppercase tracking-wider text-ink-soft block mb-1">
                      Focus Query:
                    </span>
                    <p className="text-ink italic text-xs leading-relaxed bg-ivory p-3 rounded-lg border border-blush-300">
                      &quot;{question}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Price is locked to database lookup in paise */}
              <div className="p-4 rounded-xl bg-ivory border border-blush-300 flex items-center justify-between">
                <div>
                  <span className="text-xs text-ink-soft uppercase tracking-wider block">
                    Amount to Pay (Secure Razorpay)
                  </span>
                  <div className="font-serif text-2xl text-ink font-semibold">
                    {formatPrice(selectedService)}
                  </div>
                </div>
                <div className="text-xs text-ink-soft text-right">
                  <span>Server-verified</span>
                  <span className="block text-wine-600 font-mono">
                    {currency === "USD"
                      ? `${getServicePriceUSD(selectedService)} cents`
                      : `${selectedService.price_inr} paise`}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-blush-300">
                <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleCreateOrderAndPay}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : `Pay ${formatPrice(selectedService)}`}
                </Button>
              </div>
            </Card>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center font-serif text-xl">Loading booking sanctuary...</div>}>
      <BookingFlowContent />
    </Suspense>
  );
}
