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

export type OrderStatus =
  | "pending_payment"
  | "awaiting_verification"
  | "confirmed"
  | "rejected"
  | "pending"
  | "paid"
  | "scheduled"
  | "completed"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  public_id: string;
  service_id: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  question: string;
  birth_date?: string | null;
  currency: "INR" | "USD";
  amount: number; // in paise or cents
  contact_mode?: ContactMode | null; // For tarot-1hr: "chat" | "call"
  payment_provider: "manual_upi" | "razorpay";
  utr?: string | null;
  screenshot_path?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  rejection_reason?: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  paid_at?: string | null;
  customer_verification_email_sent_at?: string | null;
  customer_confirmation_email_sent_at?: string | null;
  owner_verification_email_sent_at?: string | null;
  owner_confirmation_email_sent_at?: string | null;
  consent_at: string;
  created_at: string;
}
