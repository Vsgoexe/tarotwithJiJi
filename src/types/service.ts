export type ServiceType = "live" | "written";
export type ContactMode = "chat" | "call";

export interface Service {
  id: string;
  slug: string;
  name: string;
  type: ServiceType;
  description: string;
  duration_minutes: number | null;
  turnaround_hours: number | null;
  price_inr: number; // in paise
  price_usd: number | null; // in cents, nullable
  image?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Order {
  id: string;
  public_id: string;
  service_id: string;
  status:
    | "pending"
    | "paid"
    | "scheduled"
    | "completed"
    | "delivered"
    | "cancelled"
    | "refunded";
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  question: string;
  birth_date?: string | null;
  currency: "INR" | "USD";
  amount: number; // in paise or cents
  contact_mode?: ContactMode | null; // For tarot-1hr: "chat" | "call"
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  paid_at?: string | null;
  consent_at: string;
  created_at: string;
}
