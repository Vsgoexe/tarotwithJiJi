# Tarot Reading Website: Master Build Prompt for Cursor

> Save this file in the project root as `PROMPT.md`. Tell Cursor: "Read PROMPT.md fully. Work phase by phase. After each phase, stop, summarize what you built, list how to test it, and wait for my approval before starting the next phase."

---

## 0. Working rules for the agent

1. Work in the phases in Section 12. Do not skip ahead or build features from a later phase early.
2. Before writing code for a phase, state your plan in a few lines. If anything in this document is ambiguous, ask me **one** concise question instead of guessing.
3. Never invent API behavior. If unsure about a Razorpay, Supabase, Google, or Resend API detail, check the official docs and say which docs you used.
4. Never hardcode secrets. Use environment variables only (Section 11). Provide `.env.example` with placeholder values, never real keys.
5. **Never trust the client for money or booking state.** Prices are always looked up server-side from the database. Payment is only confirmed after server-side signature verification.
6. Keep code typed (TypeScript, `strict: true`), small, and readable. No dead code, no unused dependencies, no placeholder lorem ipsum in the final result (use clearly marked `TODO` copy that I will replace).
7. All brand-specific text (brand name, reader name, tagline, email, social links) lives in a single file: `src/config/site.ts`. Use `[BRAND NAME]` and `[READER NAME]` as placeholders until I provide them.

---

## 1. Project overview

A premium, single-reader tarot website. Visitors browse services, book and pay online, and receive their reading either live over video or as a written reading delivered by email.

- **One tarot reader only.** No marketplace, no reader profiles list, no reader sign-up.
- **Two service types:**
  - **Live reading:** a video session at a booked time slot.
  - **Written reading:** a reading prepared by the reader and delivered as a PDF by email, with a copy available on a private link.
- **Two currencies:** INR for customers in India, USD for international customers. Auto-detect with a manual toggle.
- **Customers do not need accounts.** Identify them by email and a private order link.
- **One admin** (the reader) manages everything from a password-protected `/admin`.

---

## 2. Tech stack (fixed, do not substitute without asking)

| Concern | Choice |
|---|---|
| Framework | Next.js (latest stable, App Router), TypeScript strict |
| Styling | Tailwind CSS, with design tokens in `tailwind.config` and CSS variables |
| Database, auth, storage | Supabase (Postgres, Auth for admin only, Storage for PDFs) |
| Payments | Razorpay (Orders API, Checkout, webhooks) |
| Email | Resend, with React Email templates |
| Video | Phase 1 of live readings: a fixed meeting link from env var. Upgrade path: Google Calendar API with auto-generated Meet link (Section 8.4). |
| Forms and validation | React Hook Form + Zod (shared schemas for client and server) |
| Dates and timezones | `date-fns` + `date-fns-tz` (store everything in UTC) |
| Animation | Framer Motion (subtle only) |
| Hosting | Vercel |
| Package manager | pnpm |

---

## 3. Design system (most important section)

### 3.1 Intent

The site must feel like a **luxury lifestyle brand** (think Apple's restraint, editorial magazine layouts, a boutique stationery brand). It must **not** look AI-generated or like a generic template. Calm, spacious, feminine, and quietly confident.

### 3.2 Reference imagery

I am supplying two kinds of reference:
1. A soft pink peony editorial layout: blush hero, polaroid-style tilted photos, script accents, card shadows.
2. A watercolor lily floral border on textured cream paper: flowers only in the corners, huge calm empty center.

Take these cues: **florals in corners and hero only**, textured paper background, tilted framed photos, script accents used sparingly, generous white space.

### 3.3 Color tokens

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAF6F2` | Page background (with subtle paper texture overlay) |
| `ivory` | `#FFFDFB` | Cards, surfaces |
| `blush-100` | `#FBEDEF` | Soft section backgrounds |
| `blush-300` | `#F4D9DF` | Borders, hovers, tags |
| `rose-400` | `#E8B4C0` | Secondary accents |
| `wine-600` | `#7A2E45` | Primary buttons, links, key accents |
| `wine-700` | `#62243A` | Button hover/pressed |
| `ink` | `#3A2A2E` | Body text |
| `ink-soft` | `#7C6A6F` | Secondary text |
| `gold-hair` | `#C9A27A` | Tiny details only (hairlines, small icons), used very sparingly |

Rules: no pure black, no pure white backgrounds, no neon, no purple-to-blue gradients. Gradients, if any, are blush-to-paper and barely visible.

### 3.4 Typography

- **Headings:** `Cormorant Garamond` (weights 400, 500, 600), large and airy, tight tracking on display sizes.
- **Body and UI:** `Inter` (400, 500), 16-18px body, line-height 1.7.
- **Script accent:** `Pinyon Script` or similar thin script, only for small flourishes (a single word or short phrase per section at most).
- Load via `next/font` with `display: swap`. Define a fluid type scale with `clamp()`.

### 3.5 Layout, surfaces, motion

- Max content width 1200px, generous vertical rhythm (sections have 96-160px vertical padding on desktop).
- Cards: `ivory` background, 1px `blush-300` hairline border, very soft shadow (`0 20px 50px -30px rgba(122,46,69,0.25)`), radius 20-28px.
- Buttons: pill shaped, `wine-600` fill with ivory text for primary, 1px wine outline for secondary. 48px min height. Calm hover transition (200-300ms), no bouncing.
- Imagery: large, soft, high quality. Slightly tilted polaroid-style frames in a few places (rotation between -3 and 3 degrees, white border, soft shadow).
- Florals: use as absolutely positioned decorative images in section corners, `pointer-events: none`, `aria-hidden`, lazy loaded. Never behind body text.
- Paper texture: a subtle noise/paper PNG overlay at low opacity on `body`.
- Motion: slow fade-up on scroll (opacity and 16px translate, 600-800ms ease-out), gentle parallax on hero florals only. Respect `prefers-reduced-motion`.

### 3.6 Anti-patterns (do NOT do any of these)

- No glassmorphism or frosted-glass cards.
- No gradient blobs or glowing orbs.
- No emoji used as icons. Use thin-line SVG icons (Lucide at stroke 1.25) or none.
- No generic "Welcome to our website" copy, no three identical icon cards in a row as the hero.
- No dark mode, no crystal-ball or purple "mystic" cliché styling. This brand is light, pink, and floral.
- No stock-looking placeholder photos. Use clearly labeled image slots that I will replace.

### 3.7 Image slots

Create a `public/images/` folder with the following documented slots. Until I add files, render soft blush placeholder blocks with the slot name in small text, and ship a `public/images/README.md` listing the expected filenames and ideal dimensions:

- `hero-florals.png` (transparent PNG, florals for hero right side)
- `corner-top-left.png`, `corner-bottom-right.png` (transparent watercolor florals)
- `reader-portrait.jpg` (4:5)
- `polaroid-1.jpg`, `polaroid-2.jpg` (square or 4:5)
- `service-live.jpg`, `service-written.jpg` (3:2)
- `texture-paper.png` (tileable)
- `og-image.jpg` (1200x630)

---

## 4. Information architecture and pages

### 4.1 Home `/`

1. **Header:** logo wordmark left (`[BRAND NAME]`), nav center (Readings, About, How it works, FAQ), "Book a reading" button right. Transparent over hero, becomes ivory with hairline on scroll. Mobile: slide-in menu.
2. **Hero:** blush paper background with floral image on the right. Small script line, then a large serif headline, one supporting sentence, primary CTA "Book a reading", secondary link "How it works". Soft scroll indicator.
3. **About preview:** tilted polaroid photos on the left, script heading plus short bio and a link to `/about`.
4. **Services:** two large cards (Live reading, Written reading) with image, short description, "from" price in the visitor's currency, and a "Choose" button.
5. **How it works:** 4 numbered steps (Choose, Share your question, Pay securely, Receive your reading), in a calm horizontal layout, stacking on mobile.
6. **Testimonials:** 3 soft quote cards with name and city. Use clearly marked `TODO` sample copy.
7. **FAQ:** accessible accordion (keyboard friendly), 6-8 questions (refunds, timing, privacy, what to ask, accuracy and entertainment disclaimer, rescheduling, payment safety).
8. **Final CTA band:** blush background, florals in the corners, one headline and button.
9. **Footer:** wordmark, links (Services, About, FAQ, Contact), legal links (Privacy, Terms, Refunds), social icons, small disclaimer.

### 4.2 Services `/services`

Detailed list of all services with long descriptions, what's included, duration or turnaround, price in current currency, and a "Book" button that deep links into the booking flow with the service preselected.

### 4.3 Booking flow `/book` (multi-step, single page with step state in URL query)

1. **Service:** choose a service (preselected if arriving with `?service=slug`).
2. **Details:** name, email, optional phone, question or focus (textarea, 500 char limit with counter), optional birth date, consent checkbox ("I understand readings are for guidance and entertainment").
3. **Time slot** (live services only): calendar plus available slots, shown in the visitor's detected timezone with a timezone selector.
4. **Review and pay:** order summary, currency toggle (INR/USD), Razorpay Checkout button.
5. **Success `/book/success?order=<publicId>`:** confirmation, what happens next, add-to-calendar (.ics) for live readings.

Persist form progress in `sessionStorage` so a refresh does not lose it. Each step has validation, a visible progress indicator, and a back button.

### 4.4 Order page `/order/[publicId]`

Private, unguessable link (use a random 22-char public ID, not the DB primary key). Shows order status, session time and link (live), or the written reading download (written, once delivered). Rate limit lookups.

### 4.5 Other pages

- `/about`: longer story, photo, philosophy, how the reader works.
- `/contact`: simple form (name, email, message) that emails the reader via Resend, with spam protection (honeypot field plus rate limit).
- `/privacy`, `/terms`, `/refunds`: legal pages with sensible draft copy marked "TODO: review with a legal professional before launch".
- `404` and error pages in the same visual style.

### 4.6 Admin `/admin` (protected)

- Login via Supabase Auth (email and password), restricted to a single allowed admin email from env var `ADMIN_EMAIL`. Enforce in middleware and in every admin API route.
- **Dashboard:** upcoming live sessions, orders needing a written reading, revenue summary (INR and USD separately).
- **Orders:** table with filters (status, type, date), order detail with customer's question, birth date, and payment info.
- **Written readings:** upload a PDF to the private bucket, add an optional personal note, press "Send to customer" (emails them and marks the order delivered).
- **Availability:** weekly recurring hours, one-off blocked dates, session buffer minutes, minimum notice hours, and max days ahead.
- **Services and prices:** create, edit, and deactivate services; set INR and USD prices.
- **Settings:** site-wide values that are safe to edit (contact email shown publicly, announcement banner on/off).

---

## 5. Data model (Supabase Postgres)

Create SQL migrations in `supabase/migrations/`. Use `uuid` primary keys, `timestamptz` everywhere, and enable Row Level Security on every table.

### `services`
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| slug | text unique | e.g. `live-30`, `written-3-card` |
| name | text | |
| type | text check in (`live`,`written`) | |
| description | text | |
| duration_minutes | int null | live only |
| turnaround_hours | int null | written only |
| price_inr | int | in **paise** |
| price_usd | int | in **cents** |
| is_active | bool | |
| sort_order | int | |

### `orders`
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| public_id | text unique | random, used in private links |
| service_id | uuid fk | |
| status | text | `pending`, `paid`, `scheduled`, `completed`, `delivered`, `cancelled`, `refunded` |
| customer_name | text | |
| customer_email | text | |
| customer_phone | text null | |
| question | text | |
| birth_date | date null | |
| currency | text check in (`INR`,`USD`) | |
| amount | int | smallest unit, **copied from the services table at order creation** |
| razorpay_order_id | text unique | |
| razorpay_payment_id | text null | |
| paid_at | timestamptz null | |
| consent_at | timestamptz | |
| created_at | timestamptz | |

### `bookings`
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| order_id | uuid fk unique | |
| starts_at | timestamptz | UTC |
| ends_at | timestamptz | UTC |
| meeting_url | text null | |
| status | text | `held`, `confirmed`, `cancelled` |
| hold_expires_at | timestamptz null | slot hold while paying |

Add an **exclusion constraint** (using `btree_gist` and `tstzrange(starts_at, ends_at)`) over non-cancelled bookings to make double booking impossible at the database level.

### `readings`
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| order_id | uuid fk unique | |
| file_path | text | private storage path |
| note | text null | |
| delivered_at | timestamptz null | |

### `availability_rules`
`id`, `weekday` (0-6), `start_time`, `end_time`, `timezone` (the reader's timezone), `is_active`.

### `blocked_dates`
`id`, `starts_at`, `ends_at`, `reason`.

### `payment_events`
`id`, `razorpay_event_id` (unique, for idempotency), `type`, `payload` jsonb, `processed_at`.

### `contact_messages`
`id`, `name`, `email`, `message`, `created_at`.

### RLS rules
- Public (anon) can `select` active `services` only.
- Everything else is accessed **only** through server routes using the Supabase service-role key (never exposed to the browser).
- Storage bucket `readings` is **private**. Customers get short-lived signed URLs generated server-side after verifying `public_id`.

Seed script: `supabase/seed.sql` with 4 sample services (Live 30 min, Live 60 min, Written 3-card, Written full spread) with placeholder prices that I will change.

---

## 6. API routes (Next.js route handlers, all validated with Zod)

| Route | Purpose |
|---|---|
| `GET /api/services` | Active services with price in requested currency |
| `GET /api/availability?serviceId&date&tz` | Open slots for a date, computed server-side |
| `POST /api/orders` | Validate input, look up price server-side, (live) create a 10-minute slot hold, create DB order, create Razorpay order, return `{ publicId, razorpayOrderId, amount, currency, keyId }` |
| `POST /api/payments/verify` | Verify Razorpay signature (`HMAC SHA256` of `order_id|payment_id` with key secret), mark paid, confirm booking, send emails. Idempotent. |
| `POST /api/webhooks/razorpay` | Verify webhook signature using the raw body and `RAZORPAY_WEBHOOK_SECRET`. Handle `payment.captured` and `payment.failed`. Use `payment_events.razorpay_event_id` for idempotency. This is the source of truth if the browser closes before verify runs. |
| `GET /api/orders/[publicId]` | Private order info (rate limited) |
| `GET /api/orders/[publicId]/reading` | Returns a short-lived signed URL for the PDF once delivered |
| `POST /api/contact` | Contact form, honeypot plus rate limit |
| `POST /api/admin/...` | Admin-only mutations (readings upload and send, availability, services). Each handler re-checks the admin session server-side. |

Cron (Vercel Cron): every 5 minutes release expired slot holds; daily at a set time send reminder emails for sessions in the next 24 hours.

---

## 7. Currency handling

- Detect country from request header `x-vercel-ip-country` (fall back to `Accept-Language`). India means INR, everyone else means USD.
- Store the choice in a cookie; provide a small, elegant currency toggle in the header.
- Display formatting with `Intl.NumberFormat` (`en-IN` for INR, `en-US` for USD).
- Razorpay: create orders with the `currency` field. Add a note in the README that **international payments must be enabled and approved on the Razorpay account** and USD availability should be verified in the Razorpay dashboard before launch.

---

## 8. Business logic details

### 8.1 Slot calculation
- Reader's weekly rules are in the reader's timezone. Convert to UTC for storage and comparison.
- A slot is available if it fits inside a rule window, is at least `MIN_NOTICE_HOURS` ahead, within `MAX_DAYS_AHEAD`, doesn't overlap a blocked date, and doesn't overlap any `confirmed` booking or unexpired `held` booking (including the configured buffer).
- Slots are generated in 30-minute steps for the service duration.

### 8.2 Slot holding
When a live order is created, create a `held` booking with `hold_expires_at = now + 10 minutes`. On payment success, flip to `confirmed`. On expiry (cron), cancel the hold and mark the pending order as `cancelled`. If payment arrives after expiry, re-check availability; if the slot is gone, mark the order for manual resolution in admin and email the customer and the reader.

### 8.3 Order status flow
`pending` leads to `paid`, then (live) `scheduled` leads to `completed`, or (written) `paid` leads to `delivered`. `cancelled` and `refunded` are admin-driven.

### 8.4 Meeting links
- **Phase 1:** use `MEETING_URL` env var (a standing Google Meet or Zoom room link) in confirmation emails.
- **Upgrade (only when I ask):** Google Calendar API with a service account or OAuth to create an event with `conferenceData` and send a unique Meet link per booking.

### 8.5 Emails (Resend + React Email, matching the brand design)
1. Order confirmation (live): date and time in the customer's timezone, meeting link, add-to-calendar `.ics` attachment, preparation tips, reschedule contact.
2. Order confirmation (written): expected turnaround, what happens next, private order link.
3. Reminder (live): 24 hours before.
4. Reading delivered (written): personal note, secure download link.
5. New order alert to the reader.
6. Contact form message to the reader.

Plain-text fallback for every email. Use the wordmark, blush and wine palette, and the same fonts with web-safe fallbacks.

---

## 9. Security checklist (must all be satisfied)

- Server-side price lookup. Reject any client-supplied amount.
- Razorpay payment signature verified server-side. Webhook signature verified against the **raw** request body.
- All inputs validated with Zod on the server. Escape any user text rendered in HTML or emails.
- Service-role key and Razorpay secrets are never sent to the client and never prefixed `NEXT_PUBLIC_`.
- Admin routes protected in middleware and re-verified per request.
- Rate limiting on order creation, order lookup, and contact endpoints (Upstash Ratelimit or an in-DB fallback).
- Private storage bucket; signed URLs expire in 15 minutes or less.
- Security headers via `next.config`: CSP (allow Razorpay checkout script and frames, Supabase, Resend not needed client-side), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` (except where Razorpay requires framing).
- Do not log personal data or payment secrets.

---

## 10. Quality bar

- **Performance:** Lighthouse 90+ on mobile for Home. Use `next/image`, lazy-load florals, preload hero font, avoid layout shift.
- **Accessibility:** semantic HTML, visible focus rings in `wine-600`, 4.5:1 text contrast, labeled form fields, accordion and menu keyboard support, alt text on meaningful images, `aria-hidden` on decorative florals.
- **SEO:** per-page metadata, Open Graph image, `sitemap.xml`, `robots.txt`, JSON-LD (`Service` and `FAQPage`).
- **Responsive:** design mobile first; test at 360, 768, 1024, 1440 widths.
- **Disclaimer:** visible, tasteful note that readings are for guidance and entertainment and not a substitute for medical, legal, or financial advice.
- **Tests:** unit tests (Vitest) for slot calculation, currency formatting, and signature verification. One Playwright smoke test for the booking flow with payment mocked.

---

## 11. Environment variables (`.env.example`)

```
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=
READER_TIMEZONE=Asia/Kolkata
MEETING_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
EMAIL_FROM="[BRAND NAME] <hello@yourdomain.com>"

# Scheduling
MIN_NOTICE_HOURS=12
MAX_DAYS_AHEAD=60
SLOT_BUFFER_MINUTES=15
CRON_SECRET=
```

---

## 12. Build phases (stop and wait for my approval after each)

### Phase 1: Foundation and design system
- Scaffold Next.js + TypeScript + Tailwind + pnpm. Configure fonts, tokens, paper texture, base components (Button, Card, Container, Section, Heading, FloralCorner, PolaroidFrame, Accordion, Input, Textarea, Select).
- Build the **Home page** fully with image-slot placeholders and `TODO` copy. Header and footer included.
- `src/config/site.ts`, `public/images/README.md`, `.env.example`, README with run instructions.
- **Acceptance:** Home looks premium on mobile and desktop, passes the anti-pattern list in 3.6, and Lighthouse accessibility 95+.

### Phase 2: Content pages
- `/services`, `/about`, `/contact` (UI only), `/privacy`, `/terms`, `/refunds`, 404.
- **Acceptance:** all pages share the same visual system, all nav links work, metadata present.

### Phase 3: Database and booking flow (no payment yet)
- Supabase migrations, seed, RLS, typed client helpers.
- `/api/services`, `/api/availability`, the multi-step `/book` UI with slot picking, slot holds, and a "mock payment success" button behind a `NODE_ENV !== 'production'` flag.
- **Acceptance:** two browsers cannot book the same slot, holds expire, timezones display correctly.

### Phase 4: Payments
- Razorpay order creation, Checkout, verify route, webhook route, idempotency, INR/USD handling, order success and private order pages.
- **Acceptance:** test-mode payments complete end to end in both currencies, tampered signatures are rejected, webhook replays do nothing twice, closing the browser before verify still confirms the order via webhook.

### Phase 5: Emails
- Resend integration, all templates in Section 8.5, `.ics` generation, reminder and hold-expiry cron routes.
- **Acceptance:** each email renders correctly in Gmail and Apple Mail and has a plain-text fallback.

### Phase 6: Admin
- Auth and middleware, dashboard, orders, written reading upload and send, availability, services and prices.
- **Acceptance:** non-admin users cannot reach any admin route or API; uploading and sending a reading emails the customer a working signed link.

### Phase 7: Polish and launch
- Motion polish, SEO, sitemap, JSON-LD, security headers, rate limiting, tests, error monitoring hook (Sentry optional).
- Deployment guide in README: Supabase project setup, Razorpay test to live switch, Resend domain verification (SPF/DKIM), Vercel env vars and cron, custom domain.
- **Acceptance:** launch checklist in README fully ticked, no console errors, all tests pass.

---

## 13. Definition of done

- A visitor can pick a service, fill the form, (live) choose a slot, pay in INR or USD, and receive the right email.
- The reader can see the order, run the live session, or upload and send a written reading.
- No secrets in the repo, no client-trusted prices, no double bookings, no unhandled payment states.
- The site looks like a premium pink-and-white floral brand and does not trip any item in Section 3.6.
