import { Service } from "@/types/service";

/**
 * Authoritative default services data.
 * Exact names, slugs, sort orders, and prices in paise (rupees x 100).
 * Delivery types:
 * - tarot-1hr: live (60 min)
 * - tarot-10min: live (10 min)
 * - pick-a-card, future-predictions, birth-chart, career, love: written
 * USD prices are null until decided.
 */
export const AUTHORITATIVE_SERVICES: Service[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "tarot-1hr",
    name: "Tarot reading 1hr (chat/call)",
    type: "live",
    description:
      "/* TODO: Comprehensive 1-hour live reading via Chat or Call */ An expansive sixty-minute live consultation exploring your multi-layered questions, transitions, and energetic paths. Available via live chat or voice/video call.",
    duration_minutes: 60,
    turnaround_hours: null,
    price_inr: 99900, // ₹999 in paise
    price_usd: 3900, // $39 in cents
    image: "/images/services/tarot-1hr.jpg",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "tarot-10min",
    name: "Tarot reading 10 min (in depth)",
    type: "live",
    description:
      "/* TODO: In-depth 10-minute live reading */ A concentrated, deep-dive session focused with precision on your most pressing immediate question.",
    duration_minutes: 10,
    turnaround_hours: null,
    price_inr: 20000, // ₹200 in paise
    price_usd: 1200, // $12 in cents
    image: "/images/services/tarot-10min.jpg",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "pick-a-card",
    name: "Pick a card reading",
    type: "written",
    description:
      "/* TODO: Pick a card intuitive reading */ An intuitive card selection spread accompanied by channeled reflections and personal messages delivered to your inbox.",
    duration_minutes: null,
    turnaround_hours: 48,
    price_inr: 30000, // ₹300 in paise
    price_usd: 1500, // $15 in cents
    image: "/images/services/pick-a-card.jpg",
    is_active: true,
    sort_order: 3,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    slug: "future-predictions",
    name: "Future predictions",
    type: "written",
    description:
      "/* TODO: Future predictions tarot spread */ A forward-looking spread mapping upcoming energetic horizons, opportunities, and subconscious currents.",
    duration_minutes: null,
    turnaround_hours: 48,
    price_inr: 30000, // ₹300 in paise
    price_usd: 1500, // $15 in cents
    image: "/images/services/future-predictions.jpg",
    is_active: true,
    sort_order: 4,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    slug: "birth-chart",
    name: "Birth chart reading",
    type: "written",
    description:
      "/* TODO: Birth chart astrological & tarot reading */ Synthesizing astrological placements with archetypal tarot symbolism for deeper soul alignment.",
    duration_minutes: null,
    turnaround_hours: 48,
    price_inr: 15000, // ₹150 in paise
    price_usd: 900, // $9 in cents
    image: "/images/services/birth-chart.jpg",
    is_active: true,
    sort_order: 5,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    slug: "career",
    name: "Career reading",
    type: "written",
    description:
      "/* TODO: Career and professional path reading */ Luminous clarity for professional crossroads, creative purpose, vocation, and leadership.",
    duration_minutes: null,
    turnaround_hours: 48,
    price_inr: 15000, // ₹150 in paise
    price_usd: 900, // $9 in cents
    image: "/images/services/career.jpg",
    is_active: true,
    sort_order: 6,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    slug: "love",
    name: "Love reading",
    type: "written",
    description:
      "/* TODO: Love and relationship dynamics reading */ Deep intuitive insight into partnership dynamics, emotional blockages, and heart opening.",
    duration_minutes: null,
    turnaround_hours: 48,
    price_inr: 20000, // ₹200 in paise
    price_usd: 1200, // $12 in cents
    image: "/images/services/love.jpg",
    is_active: true,
    sort_order: 7,
  },
];

/**
 * Feature flag for international/USD payments.
 * When false, INR is enforced everywhere and USD toggle is hidden.
 */
export function isUSDPaymentsEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_ENABLE_USD_PAYMENTS === "true" ||
    process.env.ENABLE_USD_PAYMENTS === "true"
  );
}

/**
 * Get dedicated aesthetic photograph for a service
 */
export function getServiceImage(slug: string, fallbackType: "live" | "written" = "live"): string {
  const map: Record<string, string> = {
    "tarot-1hr": "/images/services/tarot-1hr.jpg",
    "tarot-10min": "/images/services/tarot-10min.jpg",
    "pick-a-card": "/images/services/pick-a-card.jpg",
    "future-predictions": "/images/services/future-predictions.jpg",
    "birth-chart": "/images/services/birth-chart.jpg",
    "career": "/images/services/career.jpg",
    "love": "/images/services/love.jpg",
  };
  return map[slug] || (fallbackType === "live" ? "/images/services/tarot-1hr.jpg" : "/images/services/pick-a-card.jpg");
}

/**
 * Get USD price in cents strictly from service definition.
 * Dynamic exchange rate calculation is strictly removed.
 */
export function getServicePriceUSD(service: Service): number {
  if (service.price_usd !== null && service.price_usd !== undefined) {
    return service.price_usd;
  }
  return 0;
}

/**
 * Format price in INR with Intl.NumberFormat (en-IN, INR, no decimals, e.g. ₹999)
 */
export function formatPriceINR(paise: number): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Format price in USD with Intl.NumberFormat (en-US, USD, no decimals, e.g. $12)
 */
export function formatPriceUSD(cents: number | null): string | null {
  if (cents === null || cents === undefined) {
    return null;
  }
  const dollars = Math.round(cents / 100);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars);
}

/**
 * Unified price formatter based on selected currency
 */
export function formatServicePrice(service: Service, currency: "INR" | "USD"): string {
  if (currency === "USD" && isUSDPaymentsEnabled()) {
    const cents = getServicePriceUSD(service);
    return formatPriceUSD(cents) || "$0";
  }
  return formatPriceINR(service.price_inr);
}

/**
 * Get all active services sorted by sort_order
 */
export async function getActiveServices(): Promise<Service[]> {
  // If Supabase is connected in production/runtime, fetch from DB
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/services?is_active=eq.true&order=sort_order.asc`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data as Service[];
        }
      }
    } catch {
      // Fallback to authoritative data
    }
  }

  return [...AUTHORITATIVE_SERVICES].sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Look up service by slug or ID strictly on server
 */
export async function findService(identifier: string): Promise<Service | null> {
  const services = await getActiveServices();
  return (
    services.find(
      (s) => s.slug === identifier || s.id === identifier
    ) || null
  );
}
