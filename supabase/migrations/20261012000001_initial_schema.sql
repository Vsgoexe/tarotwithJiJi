-- Initial Schema for Tarot Website
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('live', 'written')),
    description TEXT,
    duration_minutes INT,
    turnaround_hours INT,
    price_inr INT NOT NULL, -- in paise
    price_usd INT,          -- in cents (nullable)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_id TEXT NOT NULL UNIQUE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'scheduled', 'completed', 'delivered', 'cancelled', 'refunded')),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    question TEXT NOT NULL,
    birth_date DATE,
    currency TEXT NOT NULL CHECK (currency IN ('INR', 'USD')),
    amount INT NOT NULL, -- in smallest currency unit (paise/cents) copied from services at creation
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT,
    paid_at TIMESTAMPTZ,
    consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings table (for live sessions)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    meeting_url TEXT,
    status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'confirmed', 'cancelled')),
    hold_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Double-booking exclusion constraint using btree_gist
ALTER TABLE bookings
    ADD CONSTRAINT exclude_overlapping_active_bookings
    EXCLUDE USING gist (
        tstzrange(starts_at, ends_at) WITH &&
    )
    WHERE (status IN ('held', 'confirmed'));

-- Readings table (for written readings)
CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    note TEXT,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Availability rules (weekly schedule in reader's timezone)
CREATE TABLE IF NOT EXISTS availability_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    weekday INT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Blocked dates
CREATE TABLE IF NOT EXISTS blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment events (idempotency for Razorpay webhooks)
CREATE TABLE IF NOT EXISTS payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    razorpay_event_id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can view active services only
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = TRUE);
