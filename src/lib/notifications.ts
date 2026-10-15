import crypto from "crypto";
import { Resend } from "resend";
import { getServiceSupabaseClient } from "@/lib/supabase";
import { formatPriceINR } from "@/lib/services";
import { siteConfig } from "@/config/site";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const emailFrom = process.env.EMAIL_FROM || "Tarot with Jiji <hello@tarotwithjiji.com>";
const ownerEmail = process.env.OWNER_EMAIL || process.env.ADMIN_EMAIL || "Jeevanivedavendra@gmail.com";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Creates cryptographically secure single-use expiring action tokens for owner emails.
 * Valid for 72 hours.
 */
export async function createOrderActionTokens(orderId: string): Promise<{
  approveUrl: string;
  rejectUrl: string;
} | null> {
  const supabase = getServiceSupabaseClient();
  if (!supabase) return null;

  const approveToken = crypto.randomBytes(24).toString("hex");
  const rejectToken = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(); // 72 hours

  try {
    await supabase.from("order_action_tokens").insert([
      {
        order_id: orderId,
        action: "approve",
        token: approveToken,
        expires_at: expiresAt,
      },
      {
        order_id: orderId,
        action: "reject",
        token: rejectToken,
        expires_at: expiresAt,
      },
    ]);

    return {
      approveUrl: `${siteUrl}/admin/actions?token=${approveToken}`,
      rejectUrl: `${siteUrl}/admin/actions?token=${rejectToken}`,
    };
  } catch (err) {
    console.error("Failed to create action tokens:", err);
    return null;
  }
}

/**
 * 1. Customer Notification: Payment Received, Awaiting Verification
 * Sent exactly once when UTR is submitted.
 */
export async function notifyCustomerAwaitingVerification(order: any): Promise<void> {
  if (order.customer_verification_email_sent_at) return;

  const supabase = getServiceSupabaseClient();
  const privateOrderLink = `${siteUrl}/order/${order.public_id}`;

  try {
    if (resend) {
      await resend.emails.send({
        from: emailFrom,
        to: order.customer_email,
        subject: `Payment Acknowledged — ${order.service_name} (${order.public_id})`,
        text: `Dear ${order.customer_name},\n\nWe have received your payment details (UTR: ${order.utr}) for your reading: ${order.service_name}.\n\nOur sanctuary is currently verifying the transaction. You will receive an official confirmation email as soon as verification is complete.\n\nYou may view your reading status anytime at: ${privateOrderLink}\n\nWarm blessings,\n${siteConfig.readerName}\n${siteConfig.name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #FAF6F2; color: #3A2A2E; border-radius: 16px; border: 1px solid #F4D9DF;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-family: 'Brush Script MT', cursive; font-size: 28px; color: #7A2E45;">sacred sanctuary</span>
              <h1 style="font-size: 26px; margin: 8px 0; color: #3A2A2E;">Payment Received — Awaiting Verification</h1>
              <p style="color: #7C6A6F; font-size: 14px;">Reference: <strong style="font-family: monospace;">${order.public_id}</strong></p>
            </div>
            <div style="background-color: #FFFDFB; padding: 20px; border-radius: 12px; border: 1px solid #F4D9DF; margin-bottom: 20px;">
              <p>Dear <strong>${order.customer_name}</strong>,</p>
              <p>Thank you for submitting your payment transaction details. We have logged your UTR reference: <strong style="font-family: monospace; color: #7A2E45;">${order.utr}</strong>.</p>
              <p>We are currently confirming the receipt with our bank account. As soon as it is validated, you will receive your full booking confirmation with all session and delivery details.</p>
              <div style="margin: 20px 0; padding: 12px; background: #FBEDEF; border-radius: 8px;">
                <p style="margin: 4px 0; font-size: 14px;"><strong>Service:</strong> ${order.service_name}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Expected Amount:</strong> ${formatPriceINR(order.amount)}</p>
              </div>
              <p style="text-align: center; margin-top: 24px;">
                <a href="${privateOrderLink}" style="background-color: #7A2E45; color: #FFFDFB; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">View Private Order Status</a>
              </p>
            </div>
            <p style="font-size: 12px; color: #7C6A6F; text-align: center;">Tarot with Jiji • Single-Reader Intuitive Sanctuary</p>
          </div>
        `,
      });
    }

    if (supabase) {
      await supabase
        .from("orders")
        .update({ customer_verification_email_sent_at: new Date().toISOString() })
        .eq("id", order.id);
    }
  } catch (err) {
    console.error("Non-blocking error sending customer verification email:", err);
  }
}

/**
 * 2. Owner Notification: New Payment Submitted (with signed Approve / Reject action buttons)
 * Sent exactly once when UTR is submitted.
 */
export async function notifyOwnerNewPayment(
  order: any,
  actionUrls: { approveUrl: string; rejectUrl: string } | null
): Promise<void> {
  if (order.owner_verification_email_sent_at) return;

  const supabase = getServiceSupabaseClient();
  const approveUrl = actionUrls?.approveUrl || `${siteUrl}/admin`;
  const rejectUrl = actionUrls?.rejectUrl || `${siteUrl}/admin`;

  try {
    if (resend) {
      await resend.emails.send({
        from: emailFrom,
        to: ownerEmail,
        subject: `[Action Required] New Payment Verification: ${order.customer_name} (UTR: ${order.utr})`,
        text: `New payment submitted for verification!\n\nSeeker: ${order.customer_name}\nEmail: ${order.customer_email}\nPhone: ${order.customer_phone || "N/A"}\nService: ${order.service_name}\nAmount: ${formatPriceINR(order.amount)}\nUTR: ${order.utr}\nQuestion: "${order.question}"\n\nApprove Payment:\n${approveUrl}\n\nReject Payment:\n${rejectUrl}\n\nAdmin Portal: ${siteUrl}/admin`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #FAF6F2; color: #3A2A2E; border-radius: 12px; border: 1px solid #F4D9DF;">
            <h2 style="color: #7A2E45; margin-top: 0;">New UPI Payment Awaiting Your Approval</h2>
            <div style="background-color: #FFFDFB; padding: 18px; border-radius: 8px; border: 1px solid #F4D9DF; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 6px 0; color: #7C6A6F;">Seeker:</td><td><strong>${order.customer_name}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #7C6A6F;">Email:</td><td>${order.customer_email}</td></tr>
                <tr><td style="padding: 6px 0; color: #7C6A6F;">Phone:</td><td>${order.customer_phone || "Not provided"}</td></tr>
                <tr><td style="padding: 6px 0; color: #7C6A6F;">Service:</td><td><strong>${order.service_name}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #7C6A6F;">Amount:</td><td><strong style="color: #7A2E45;">${formatPriceINR(order.amount)}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #7C6A6F;">Submitted UTR:</td><td><span style="font-family: monospace; background: #FBEDEF; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #7A2E45;">${order.utr}</span></td></tr>
              </table>
              <div style="margin-top: 14px; padding: 10px; background: #FBEDEF; border-radius: 6px; font-size: 13px;">
                <strong>Seeker Query:</strong> "${order.question}"
              </div>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <p style="font-size: 13px; color: #7C6A6F; margin-bottom: 12px;">Clicking either button opens a single-click confirmation page (safe against email link scanners):</p>
              <a href="${approveUrl}" style="background-color: #2E7A4A; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; margin-right: 12px; display: inline-block;">Approve Payment</a>
              <a href="${rejectUrl}" style="background-color: #C0392B; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">Reject Payment</a>
            </div>

            <p style="font-size: 12px; color: #7C6A6F; text-align: center;">
              You can also manage this booking anytime directly from <a href="${siteUrl}/admin" style="color: #7A2E45;">Admin Sanctuary</a>.
            </p>
          </div>
        `,
      });
    }

    if (supabase) {
      await supabase
        .from("orders")
        .update({ owner_verification_email_sent_at: new Date().toISOString() })
        .eq("id", order.id);
    }
  } catch (err) {
    console.error("Non-blocking error sending owner verification email:", err);
  }
}

/**
 * 3. Customer Notification: Booking Confirmed!
 * Sent only after owner approves payment.
 */
export async function notifyCustomerBookingConfirmed(order: any): Promise<void> {
  if (order.customer_confirmation_email_sent_at) return;

  const supabase = getServiceSupabaseClient();
  const privateOrderLink = `${siteUrl}/order/${order.public_id}`;

  try {
    if (resend) {
      await resend.emails.send({
        from: emailFrom,
        to: order.customer_email,
        subject: `Booking Confirmed: ${order.service_name} — Tarot with Jiji`,
        text: `Dear ${order.customer_name},\n\nYour payment has been verified and your booking is confirmed!\n\nService: ${order.service_name}\nReference: ${order.public_id}\nAmount: ${formatPriceINR(order.amount)}\n\nWhat happens next:\n${
          order.contact_mode
            ? `Your live reading will be conducted via ${order.contact_mode.toUpperCase()}.`
            : "Your written illustrated PDF reading will arrive in your inbox within 48 to 72 hours."
        }\n\nAccess your private order sanctuary at: ${privateOrderLink}\n\nWarm blessings,\n${siteConfig.readerName}\n${siteConfig.name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #FAF6F2; color: #3A2A2E; border-radius: 16px; border: 1px solid #F4D9DF;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-family: 'Brush Script MT', cursive; font-size: 28px; color: #7A2E45;">blessed presence</span>
              <h1 style="font-size: 28px; margin: 8px 0; color: #3A2A2E;">Your Reading is Confirmed</h1>
              <p style="color: #7C6A6F; font-size: 14px;">Order Reference: <strong style="font-family: monospace;">${order.public_id}</strong></p>
            </div>
            <div style="background-color: #FFFDFB; padding: 22px; border-radius: 12px; border: 1px solid #F4D9DF; margin-bottom: 20px;">
              <p>Dear <strong>${order.customer_name}</strong>,</p>
              <p>We are delighted to confirm that your payment has been verified. Your sacred reading reservation is officially confirmed.</p>
              <div style="margin: 20px 0; padding: 14px; background: #FBEDEF; border-radius: 8px;">
                <p style="margin: 4px 0;"><strong>Service:</strong> ${order.service_name}</p>
                <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ${formatPriceINR(order.amount)}</p>
                ${order.contact_mode ? `<p style="margin: 4px 0;"><strong>Selected Mode:</strong> ${order.contact_mode.toUpperCase()}</p>` : ""}
              </div>
              <p style="font-size: 14px; line-height: 1.6;">
                ${
                  order.contact_mode
                    ? `${siteConfig.readerName} will connect with you via ${order.contact_mode.toUpperCase()} at your scheduled session time.`
                    : `Your bespoke written reading and channeled reflections will arrive within 48 to 72 hours.`
                }
              </p>
              <p style="text-align: center; margin-top: 24px;">
                <a href="${privateOrderLink}" style="background-color: #7A2E45; color: #FFFDFB; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">View Private Order Sanctuary</a>
              </p>
            </div>
            <p style="font-size: 12px; color: #7C6A6F; text-align: center;">Tarot with Jiji • Single-Reader Intuitive Sanctuary</p>
          </div>
        `,
      });
    }

    if (supabase) {
      await supabase
        .from("orders")
        .update({ customer_confirmation_email_sent_at: new Date().toISOString() })
        .eq("id", order.id);
    }
  } catch (err) {
    console.error("Non-blocking error sending customer confirmation email:", err);
  }
}

/**
 * 4. Customer Notification: Booking Rejected
 * Sent if owner rejects payment.
 */
export async function notifyCustomerBookingRejected(
  order: any,
  reason?: string
): Promise<void> {
  const privateOrderLink = `${siteUrl}/order/${order.public_id}`;

  try {
    if (resend) {
      await resend.emails.send({
        from: emailFrom,
        to: order.customer_email,
        subject: `Update regarding your booking: ${order.service_name}`,
        text: `Dear ${order.customer_name},\n\nWe were unable to verify the UPI payment (UTR: ${order.utr || "N/A"}) for your reading request.\n\nReason: ${reason || "UTR could not be matched with our bank credit."}\n\nYou may retry your payment with the correct transaction reference at:\n${privateOrderLink}\n\nWarm blessings,\n${siteConfig.name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #FAF6F2; color: #3A2A2E; border-radius: 16px; border: 1px solid #F4D9DF;">
            <h2 style="color: #7A2E45;">Payment Verification Update</h2>
            <p>Dear <strong>${order.customer_name}</strong>,</p>
            <p>We were unable to verify the payment reference (UTR: <code>${order.utr || "N/A"}</code>) submitted for your consultation (<strong>${order.service_name}</strong>).</p>
            <p style="background: #FFFDFB; padding: 14px; border-radius: 8px; border: 1px solid #F4D9DF;">
              <strong>Note:</strong> ${reason || "The transaction reference did not match a completed deposit. Please verify your banking app."}
            </p>
            <p>You are welcome to re-submit your valid transaction ID or choose an alternate time:</p>
            <p style="text-align: center; margin: 24px 0;">
              <a href="${privateOrderLink}" style="background-color: #7A2E45; color: #FFFDFB; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">Review Order & Retry</a>
            </p>
          </div>
        `,
      });
    }
  } catch (err) {
    console.error("Non-blocking error sending customer rejection email:", err);
  }
}
