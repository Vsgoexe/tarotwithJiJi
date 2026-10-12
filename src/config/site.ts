export interface SiteConfig {
  name: string;
  brandName: string;
  readerName: string;
  tagline: string;
  description: string;
  email: string;
  social: {
    instagram: string;
    instagramHandle: string;
    youtube?: string;
    pinterest?: string;
  };
  navigation: {
    label: string;
    href: string;
  }[];
  legal: {
    label: string;
    href: string;
  }[];
  disclaimer: string;
}

export const siteConfig: SiteConfig = {
  name: "Tarot with Jiji",
  brandName: "Tarot with Jiji",
  readerName: "Jiji",
  tagline: "Tarot Reader & Astrologer",
  description:
    "With 7 years of experience studying astrology and tarot, I have spent years exploring the connection between intuition, energy, and the deeper patterns that shape our lives.",
  email: "Jeevanivedavendra@gmail.com",
  social: {
    instagram: "https://instagram.com/tarotwith.jiji",
    instagramHandle: "Tarotwith.jiji",
    youtube: "https://youtube.com",
    pinterest: "https://pinterest.com",
  },
  navigation: [
    { label: "Readings", href: "/services" },
    { label: "About", href: "/about" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
  ],
  disclaimer:
    "Tarot readings are offered for intuitive guidance and entertainment purposes only. They are not intended as a substitute for professional medical, legal, or financial advice.",
};
