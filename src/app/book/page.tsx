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
import { AUTHORITATIVE_SERVICES, getServicePriceUSD, isUSDPaymentsEnabled } from "@/lib/services";
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

  // Manual UPI State
  const [upiPaymentData, setUpiPaymentData] = useState<any>(null);
  const [utrInput, setUtrInput] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);

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

  // Helper to load Razorpay Checkout script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCreateOrderAndPay = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Call server-side order creation (amount looked up from DB, never client)
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
        throw new Error(data.error || "Order creation failed on server");
      }

      // MANUAL UPI PROVIDER PATH
      if (data.provider === "manual_upi") {
        setUpiPaymentData(data.paymentData);
        setStep(5);
        setIsSubmitting(false);
        return;
      }

      // RAZORPAY PROVIDER PATH (if enabled in future)
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Unable to load secure Razorpay payment gateway.");
      }

      const options = {
        key: data.paymentData.keyId,
        amount: data.paymentData.amount,
        currency: data.paymentData.currency,
        name: siteConfig.name,
        description: `${selectedService.name} - Consultation`,
        order_id: data.paymentData.razorpayOrderId,
        prefill: {
          name,
          email,
          contact: phone || undefined,
        },
        notes: {
          public_id: data.publicId,
          service_slug: selectedService.slug,
        },
        theme: {
          color: "#7A2E45",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        handler: async (paymentResponse: any) => {
          try {
            setIsSubmitting(true);
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                publicId: data.publicId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            router.push(`/book/success?order=${data.publicId}`);
          } catch (verifyErr: any) {
            setErrorMsg(verifyErr.message || "Payment verification failed.");
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while creating your order.");
      setIsSubmitting(false);
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiPaymentData) return;

    const trimmedUtr = utrInput.trim();
    if (!/^[A-Za-z0-9]{12}$/.test(trimmedUtr)) {
      setErrorMsg(
        "Please enter a valid 12-digit UPI Transaction ID (UTR) from your GPay, PhonePe, or Paytm receipt."
      );
      return;
    }

    setIsSubmittingUtr(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/orders/submit-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: upiPaymentData.publicId,
          utr: trimmedUtr,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit transaction reference.");
      }

      router.push(`/book/success?order=${upiPaymentData.publicId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Error submitting payment verification details.");
      setIsSubmittingUtr(false);
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
                    {currency === "USD" && isUSDPaymentsEnabled()
                      ? `${getServicePriceUSD(selectedService)} cents`
                      : `${selectedService.price_inr} paise`}
                  </span>
                </div>
              </div>

              {!isUSDPaymentsEnabled() && (
                <div className="p-3 rounded-lg bg-blush-100/40 border border-blush-300 text-xs text-ink-soft text-center">
                  ✨ International payments coming soon • All consultations are currently processed in INR via UPI, Cards, and NetBanking.
                </div>
              )}

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
                  {isSubmitting ? "Initiating..." : `Proceed to Payment (${formatPrice(selectedService)})`}
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 5: MANUAL UPI PAYMENT & UTR SUBMISSION */}
          {step === 5 && upiPaymentData && (
            <Card className="max-w-2xl mx-auto p-8 sm:p-12 space-y-8 relative overflow-hidden">
              <FloralCorner position="top-left" size={180} opacity={0.5} />

              <div className="text-center space-y-2">
                <span className="font-script text-3xl text-wine-600 block">step five</span>
                <Heading level={2} size="h2" className="text-center">
                  Scan & Pay via UPI
                </Heading>
                <p className="text-ink-soft text-sm">
                  Complete payment in your UPI app and submit your 12-digit transaction ID below.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>30-Minute Hold Active • Reference: {upiPaymentData.publicId}</span>
                </div>
              </div>

              {/* Order Quick Summary */}
              <div className="bg-blush-100/50 p-4 rounded-xl border border-blush-300 flex items-center justify-between text-sm">
                <div>
                  <span className="text-ink-soft text-xs block uppercase tracking-wider">Consultation</span>
                  <strong className="text-ink font-serif text-base">{upiPaymentData.serviceName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-ink-soft text-xs block uppercase tracking-wider">Amount to Transfer</span>
                  <strong className="text-wine-600 font-serif text-2xl font-bold">
                    ₹{upiPaymentData.amountRupees}
                  </strong>
                </div>
              </div>

              {/* QR Code and Payee Details Box */}
              <div className="bg-ivory p-6 rounded-2xl border border-blush-300 text-center space-y-4 shadow-sm">
                <div className="relative w-64 h-80 mx-auto rounded-xl p-2 bg-white border border-blush-300 shadow-md flex items-center justify-center overflow-hidden">
                  {/* Official Google Pay QR code image with dynamic fallback */}
                  <img
                    src="/images/upi-qr.jpg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = upiPaymentData.qrCodeDataUrl;
                    }}
                    alt={`Scan to pay via UPI - ${upiPaymentData.payeeName}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-ink-soft block uppercase tracking-wider">Verified Payee</span>
                  <p className="font-serif text-lg font-medium text-ink">{upiPaymentData.payeeName}</p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <code className="text-xs font-mono font-bold bg-blush-100 px-3 py-1 rounded-full text-wine-700 border border-blush-300">
                      {upiPaymentData.upiId}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(upiPaymentData.upiId);
                        setCopiedUpi(true);
                        setTimeout(() => setCopiedUpi(false), 2500);
                      }}
                      className="text-xs text-wine-600 hover:text-wine-700 font-semibold cursor-pointer underline"
                    >
                      {copiedUpi ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Mobile Intent App Links */}
                <div className="pt-2">
                  <span className="text-xs text-ink-soft block mb-2 font-medium">Or tap to launch UPI app directly:</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    <a
                      href={upiPaymentData.upiLink}
                      className="px-4 py-2 rounded-full bg-blush-100 border border-blush-300 text-xs font-semibold text-wine-700 hover:bg-blush-200 transition-colors shadow-xs"
                    >
                      Pay via GPay / PhonePe / Paytm / Any UPI
                    </a>
                  </div>
                </div>
              </div>

              {/* UTR Form */}
              <form onSubmit={handleSubmitUtr} className="space-y-5 bg-paper p-6 rounded-2xl border border-blush-300">
                <div className="space-y-1.5">
                  <label htmlFor="utr-input" className="block text-sm font-semibold text-ink">
                    12-Digit UPI Transaction ID / UTR <span className="text-wine-600">*</span>
                  </label>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    After completing the transfer, locate the 12-digit numeric Reference / UTR number in your banking app receipt and enter it below for verification.
                  </p>
                  <input
                    id="utr-input"
                    type="text"
                    required
                    maxLength={12}
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))}
                    placeholder="e.g. 428938194821"
                    className="w-full p-3 font-mono text-base tracking-wider rounded-xl border border-blush-300 bg-ivory focus:ring-2 focus:ring-wine-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-ink-soft block text-right">
                    {utrInput.length} / 12 digits
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link
                    href={`/order/${upiPaymentData.publicId}`}
                    className="text-xs text-ink-soft hover:text-wine-600 underline"
                  >
                    I&apos;ll pay later (Keep booking on hold)
                  </Link>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmittingUtr || utrInput.trim().length !== 12}
                  >
                    {isSubmittingUtr ? "Submitting for Verification..." : "Submit UTR for Verification"}
                  </Button>
                </div>
              </form>
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
