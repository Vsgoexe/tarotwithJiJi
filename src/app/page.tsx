import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles, Video, FileText, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { FloralCorner } from "@/components/ui/FloralCorner";
import { PolaroidFrame } from "@/components/ui/PolaroidFrame";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { AUTHORITATIVE_SERVICES } from "@/lib/services";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { readerProfile } from "@/config/reader";

export default function HomePage() {
  const faqItems: AccordionItem[] = [
    {
      id: "faq-what-to-ask",
      question: "What kind of questions can I bring to a reading?",
      answer:
        "Open-ended questions yield the deepest insight. Themes around life transitions, career paths, relationship dynamics, personal growth, and creative purpose are ideal. While tarot provides luminous perspective, we avoid yes/no medical, legal, or financial diagnostics.",
    },
    {
      id: "faq-difference-live-written",
      question: "What is the difference between a Live and a Written reading?",
      answer:
        `A Live reading is an intimate 1-on-1 video session where we pull cards together in real time and converse. A Written reading is conducted privately by ${siteConfig.readerName} and delivered to your inbox as an archival illustrated PDF report that you can keep and revisit.`,
    },
    {
      id: "faq-timing-turnaround",
      question: "How long does a written reading take to arrive?",
      answer:
        "Written readings are prepared with unhurried care and typically delivered within 48 to 72 hours from booking. You will receive an email containing a secure personal link to download your reading.",
    },
    {
      id: "faq-privacy",
      question: "Is my personal question kept completely confidential?",
      answer:
        "Yes, unconditionally. Every detail you share—your query, birth details, and session conversation—is treated with sacred confidentiality and is never shared, recorded publicly, or disclosed to third parties.",
    },
    {
      id: "faq-rescheduling",
      question: "Can I reschedule my live session if something comes up?",
      answer:
        `Yes. You may reschedule your live appointment up to 24 hours prior to your scheduled slot using the link provided in your confirmation email, or by contacting ${siteConfig.email}.`,
    },
    {
      id: "faq-refunds",
      question: "What is your refund policy?",
      answer:
        "Because slots and written preparation are reserved specifically for you, readings are non-refundable once initiated or confirmed within 24 hours of session time. Please review our full Refund Policy for emergency guidelines.",
    },
    {
      id: "faq-accuracy-disclaimer",
      question: "Are readings meant as definitive future prediction?",
      answer:
        "Tarot serves as a mirror to your current energies and subconscious wisdom, empowering you with conscious agency rather than rigid fatalism. By booking, you acknowledge that all readings are for guidance and entertainment purposes.",
    },
    {
      id: "faq-payment-security",
      question: "Are online payments secure?",
      answer:
        "All transactions are processed through Razorpay with 256-bit SSL encryption. We accept UPI, NetBanking, and major domestic/international credit and debit cards in INR and USD.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* ========================================================
            1. HERO SECTION
            Blush paper background with floral imagery, script accent,
            large serif headline, dual CTAs, scroll indicator
           ======================================================== */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36 bg-paper overflow-hidden">
          {/* Subtle Corner florals */}
          <FloralCorner position="top-left" size={320} opacity={0.7} />

          {/* Hero right florals artwork */}
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/6 pointer-events-none select-none hidden lg:block mix-blend-multiply opacity-85 z-0"
            aria-hidden="true"
          >
            <Image
              src="/images/hero-florals.svg"
              alt=""
              width={750}
              height={750}
              priority
              className="w-auto h-auto max-w-[650px] xl:max-w-[760px]"
            />
          </div>

          <Container className="relative z-10">
            <div className="max-w-2xl lg:max-w-xl space-y-8">
              {/* Script Eyebrow Flourish */}
              <div className="space-y-3">
                <span className="font-script text-3xl sm:text-4xl text-wine-600 block">
                  a sanctuary for gentle clarity
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-ink font-normal text-balance">
                  Illuminating your path with intuitive grace.
                </h1>
              </div>

              {/* Supporting sentence */}
              <p className="text-ink-soft text-lg sm:text-xl leading-relaxed max-w-lg">
                Intimate tarot readings crafted for mindful seekers. Uncover the
                unspoken wisdom of your present moment in an atmosphere of warmth
                and quiet beauty.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button href="#services" size="lg" variant="primary">
                  Book a reading
                </Button>
                <Button href="#how-it-works" size="lg" variant="outline">
                  How it works
                </Button>
              </div>

              {/* Reader trust note */}
              <div className="pt-4 flex items-center gap-3 text-xs tracking-wider uppercase text-ink-soft/90">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Readings guided personally by {siteConfig.readerName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Worldwide via video & PDF</span>
              </div>
            </div>

            {/* Soft scroll indicator */}
            <div className="mt-16 lg:mt-24 flex items-center gap-2 text-ink-soft text-xs tracking-widest uppercase">
              <a
                href="#about"
                className="inline-flex items-center gap-2 hover:text-wine-600 transition-colors"
                aria-label="Scroll to about section"
              >
                <span>Discover the experience</span>
                <ArrowDown strokeWidth={1.25} className="w-3.5 h-3.5 animate-bounce" />
              </a>
            </div>
          </Container>
        </section>

        {/* ========================================================
            2. ABOUT PREVIEW SECTION
            Tilted polaroid frames on left, script heading, bio, link
           ======================================================== */}
        <Section id="about" variant="blush" className="relative">
          <FloralCorner position="bottom-right" size={300} opacity={0.65} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Tilted Polaroids Left */}
            <div className="lg:col-span-5 relative flex justify-center py-6 sm:py-8">
              <div className="relative">
                {/* Polaroid 1 */}
                <PolaroidFrame
                  src="/images/reader-portrait.jpg"
                  alt={`Portrait of ${siteConfig.readerName}`}
                  caption={`${siteConfig.readerName} • Tarot Reader`}
                  rotation={-3}
                  className="relative z-10"
                />

                {/* Polaroid 2 overlapping */}
                <div className="absolute -bottom-8 -right-6 sm:-right-10 z-20 hidden sm:block">
                  <PolaroidFrame
                    src="/images/polaroid-2.jpg"
                    alt="Sacred tarot cards spread with candlelight and crystals"
                    caption="Gentle reflection"
                    rotation={3.5}
                    width={260}
                    height={260}
                  />
                </div>
              </div>
            </div>

            {/* Bio & Philosophy Right */}
            <div className="lg:col-span-7 space-y-6 lg:pl-6">
              <Heading
                level={2}
                eyebrow="meet your reader"
                eyebrowScript={true}
                size="h2"
              >
                {readerProfile.headline}
              </Heading>

              <div className="space-y-4 text-ink-soft text-base sm:text-lg leading-relaxed max-w-[65ch]">
                <p>{readerProfile.paragraphs[0]}</p>
                <p>{readerProfile.paragraphs[1]}</p>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-wine-600 font-medium hover:text-wine-700 transition-colors group"
                >
                  <span>Read more</span>
                  <ArrowRight
                    strokeWidth={1.25}
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Section>

        {/* ========================================================
            3. SERVICES SECTION
            Two large cards: Live Reading & Written Reading
           ======================================================== */}
        <Section id="services" variant="paper">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Heading
              level={2}
              eyebrow="curated offerings"
              eyebrowScript={true}
              size="h2"
              className="text-center"
            >
              Choose your reading format
            </Heading>
            <p className="text-ink-soft text-base sm:text-lg">
              Whether you cherish the spontaneous dialogue of a live session or the
              lasting stillness of a written keepsake, each reading is tailored
              solely to your inquiry.
            </p>
          </div>

          <div className="space-y-12">
            {/* Live Readings Category */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-wine-600" />
                <h3 className="font-serif text-2xl text-ink font-medium">
                  Live Consultations
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {AUTHORITATIVE_SERVICES.filter((s) => s.type === "live").map((service) => (
                  <Card key={service.id} hoverable className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-blush-100 border border-blush-300">
                        <Image
                          src={service.image || "/images/services/tarot-1hr.jpg"}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory/95 border border-blush-300 text-xs font-medium text-wine-600">
                          <Video strokeWidth={1.25} className="w-3.5 h-3.5" />
                          <span>{service.duration_minutes ? `${service.duration_minutes} min live` : "Live session"}</span>
                        </div>
                        {service.slug === "tarot-1hr" && (
                          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-wine-600 text-ivory text-xs font-medium shadow-xs">
                            <span>Chat or Call</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-serif text-2xl text-ink font-medium">
                          {service.name}
                        </h4>
                        <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
                          {service.description}
                        </p>
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
                      <Button href={`/book?service=${service.slug}`} variant="primary" size="sm">
                        Book reading
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Written Readings Category */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <h3 className="font-serif text-2xl text-ink font-medium">
                  Bespoke Written Readings
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {AUTHORITATIVE_SERVICES.filter((s) => s.type === "written").map((service) => (
                  <Card key={service.id} hoverable className="flex flex-col justify-between space-y-5 p-6">
                    <div className="space-y-3">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-blush-100 border border-blush-300">
                        <Image
                          src={service.image || "/images/services/pick-a-card.jpg"}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-ivory/95 border border-blush-300 text-xs font-medium text-wine-600">
                          <FileText strokeWidth={1.25} className="w-3 h-3" />
                          <span>Written reading</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-serif text-xl text-ink font-medium">
                          {service.name}
                        </h4>
                        <p className="text-ink-soft text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
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
                      <Button href={`/book?service=${service.slug}`} variant="primary" size="sm">
                        Order
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ========================================================
            4. HOW IT WORKS SECTION
            4 numbered steps: Choose, Share question, Pay, Receive
           ======================================================== */}
        <Section id="how-it-works" variant="blush">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Heading
              level={2}
              eyebrow="the ritual"
              eyebrowScript={true}
              size="h2"
              className="text-center"
            >
              How it works
            </Heading>
            <p className="text-ink-soft text-base sm:text-lg">
              A gentle, seamless journey designed with your peace of mind in every step.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Choose your format",
                desc: "Select a live interactive session or a written keepsake tailored to your inquiry.",
              },
              {
                step: "02",
                title: "Share your focus",
                desc: "Describe what is on your heart—your questions, life transition, or intuitive intent.",
              },
              {
                step: "03",
                title: "Reserve & pay securely",
                desc: "Select your timezone slot (for live) and pay safely in INR or USD via encrypted checkout.",
              },
              {
                step: "04",
                title: "Receive your reading",
                desc: "Join your private video room or receive your archival PDF reading directly by email.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-ivory border border-blush-300 rounded-[20px] p-8 space-y-4 shadow-[0_12px_30px_-20px_rgba(122,46,69,0.18)]"
              >
                <div className="font-serif text-3xl sm:text-4xl text-wine-600 font-light">
                  {item.step}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-ink font-medium">
                  {item.title}
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ========================================================
            5. TESTIMONIALS SECTION
            3 soft quote cards with name and city (TODO sample copy)
           ======================================================== */}
        <Section variant="paper">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Heading
              level={2}
              eyebrow="kind reflections"
              eyebrowScript={true}
              size="h2"
              className="text-center"
            >
              Words from gentle seekers
            </Heading>
            <p className="text-ink-soft text-base sm:text-lg">
              Honest impressions from those who have visited this sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "/* TODO: Testimonial copy 1 */ The reading brought an instant sense of relief to a season of heavy indecision. Her tone was gentle, articulate, and astoundingly perceptive without being intimidating.",
                name: "Aanya S.",
                city: "Mumbai, India",
                type: "Live Reading",
              },
              {
                quote:
                  "/* TODO: Testimonial copy 2 */ I still re-read my written PDF spread months later whenever I feel lost. The layout was exquisite and the reflections gave me tangible courage for my career shift.",
                name: "Elena R.",
                city: "London, UK",
                type: "Written Reading",
              },
              {
                quote:
                  "/* TODO: Testimonial copy 3 */ An entirely different caliber of tarot reader. No theatrical dramatics—just deep intuitive clarity and genuine human kindness.",
                name: "Pooja M.",
                city: "Bengaluru, India",
                type: "Live Reading",
              },
            ].map((t, idx) => (
              <Card key={idx} className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="font-serif text-3xl text-wine-600/60 leading-none">
                    “
                  </div>
                  <p className="text-ink text-base leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>
                <div className="pt-4 border-t border-blush-300">
                  <div className="font-serif text-lg text-ink font-medium">
                    {t.name}
                  </div>
                  <div className="text-xs text-ink-soft flex items-center justify-between mt-0.5">
                    <span>{t.city}</span>
                    <span className="text-wine-600 font-medium">{t.type}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* ========================================================
            6. FAQ SECTION
            Accessible keyboard-friendly accordion
           ======================================================== */}
        <Section id="faq" variant="blush">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Heading
                level={2}
                eyebrow="clarity & care"
                eyebrowScript={true}
                size="h2"
                className="text-center"
              >
                Frequently asked questions
              </Heading>
              <p className="text-ink-soft text-base sm:text-lg">
                Everything you might wish to know before reserving your session.
              </p>
            </div>

            <Accordion items={faqItems} />
          </div>
        </Section>

        {/* ========================================================
            7. FINAL CTA BAND
            Blush background, florals in the corners, headline & button
           ======================================================== */}
        <Section variant="paper" className="relative py-24 sm:py-32">
          <FloralCorner position="top-left" size={260} opacity={0.6} />
          <FloralCorner position="bottom-right" size={260} opacity={0.6} />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <span className="font-script text-3xl sm:text-4xl text-wine-600 block">
              step into presence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight text-balance">
              Your next chapter is ready to be gently heard.
            </h2>
            <p className="text-ink-soft text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Reserve your quiet hour today, or request a written consultation delivered
              directly to your inbox.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="#services" size="lg" variant="primary">
                Book your reading
              </Button>
              <Button href="/contact" size="lg" variant="outline">
                Ask a question first
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
