import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Pinyon_Script } from "next/font/google";
import { siteConfig } from "@/config/site";
import { readerProfile } from "@/config/reader";
import { CurrencyProvider } from "@/context/CurrencyContext";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${siteConfig.name} | Tarot Reader & Astrologer`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "tarot reading",
    "tarot reader",
    "astrologer",
    "tarot with jiji",
    "intuitive guidance",
    "live tarot session",
    "written tarot reading",
  ],
  authors: [{ name: siteConfig.readerName }],
  openGraph: {
    title: `${siteConfig.name} | Tarot Reader & Astrologer`,
    description: siteConfig.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Tarot Reader & Astrologer`,
    description: siteConfig.description,
    site: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}#organization`,
        name: siteConfig.name,
        url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/images/og-image.svg`,
        email: siteConfig.email,
      },
      {
        "@type": "Person",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}#person`,
        name: siteConfig.readerName,
        jobTitle: "Tarot Reader & Astrologer",
        worksFor: {
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}#organization`,
        },
        description: readerProfile.paragraphs[0],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${pinyon.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-paper text-ink selection:bg-blush-300 selection:text-wine-600">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
