-- Migration: 20261012000003_manual_upi_and_approval_flow.sql
-- Adds manual UPI payment mode, unique UTR tracking, action tokens, and notification timestamps

-- 1. Update orders status check constraint to support manual UPI flow
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (
    status IN (
        'pending_payment',
        'awaiting_verification',
        'confirmed',
        'rejected',
        'pending',
        'paid',
        'scheduled',
        'completed',
        'delivered',
        'cancelled',
        'refunded'
    )
);

-- 2. Add columns to orders for manual UPI verification, UTR, screenshots, and notification sent tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider TEXT NOT NULL DEFAULT 'manual_upi';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS utr TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS screenshot_path TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS verified_by TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_verification_email_sent_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_confirmation_email_sent_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS owner_verification_email_sent_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS owner_confirmation_email_sent_at TIMESTAMPTZ;

-- 3. Create table for signed, single-use, expiring action tokens (Approve / Reject buttons in email)
CREATE TABLE IF NOT EXISTS order_action_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approve', 'reject')),
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable RLS on order_action_tokens
ALTER TABLE order_action_tokens ENABLE ROW LEVEL SECURITY;

-- 5. Create index on UTR and tokens for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_utr ON orders(utr);
CREATE INDEX IF NOT EXISTS idx_order_action_tokens_token ON order_action_tokens(token);
