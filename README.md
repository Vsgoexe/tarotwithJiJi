# Tarot with Jiji — Luxury Single-Reader Tarot Sanctuary

An intimate, single-reader tarot consultation website built with Next.js (App Router), TypeScript (`strict: true`), Tailwind CSS, and `pnpm`.

The aesthetic is inspired by luxury lifestyle and boutique stationery editorial design—featuring soft blush and warm paper tones, Cormorant Garamond serif typography, subtle Pinyon Script accents, and watercolor florals.

---

## Tech Stack

- **Framework**: Next.js (App Router, React 19, TypeScript strict)
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Icons**: Lucide React (stroke width 1.25)
- **Package Manager**: `pnpm`
- **Integrations**:
  - Supabase (PostgreSQL, Storage, RLS)
  - Razorpay (Orders, Webhooks, Signature verification in paise)
  - Resend (Transactional emails with React Email)
  - Google Calendar / Meeting links

---

## Authoritative Services Catalog

| Sort | Slug | Name | Type | Duration | Price (INR) | Price (Paise) | USD Price |
|---|---|---|---|---|---|---|---|
| 1 | `tarot-1hr` | Tarot reading 1hr (chat/call) | Live | 60 min | ₹999 | 99900 | Null (Unset) |
| 2 | `tarot-10min` | Tarot reading 10 min (in depth) | Live | 10 min | ₹200 | 20000 | Null (Unset) |
| 3 | `pick-a-card` | Pick a card reading | Written | 48 hr | ₹300 | 30000 | Null (Unset) |
| 4 | `future-predictions` | Future predictions | Written | 48 hr | ₹300 | 30000 | Null (Unset) |
| 5 | `birth-chart` | Birth chart reading | Written | 48 hr | ₹150 | 15000 | Null (Unset) |
| 6 | `career` | Career reading | Written | 48 hr | ₹150 | 15000 | Null (Unset) |
| 7 | `love` | Love reading | Written | 48 hr | ₹200 | 20000 | Null (Unset) |

- **Tarot 1hr**: Customer selects either "Chat" or "Call" at booking (`orders.contact_mode`).
- **USD Prices**: `price_usd` is nullable. When null, prices are displayed in INR for everyone, USD option is hidden for that service, and a visible "USD price not set" warning appears on `/admin/services`.
- **Server Rule**: Amounts charged are always verified server-side in paise directly from the database.

---

## Design System Tokens

| Token | Hex | Role |
|---|---|---|
| `paper` | `#FAF6F2` | Page background with subtle paper texture overlay |
| `ivory` | `#FFFDFB` | Card surfaces & popovers |
| `blush-100` | `#FBEDEF` | Soft section backgrounds |
| `blush-300` | `#F4D9DF` | Borders, subtle tags, hair lines |
| `rose-400` | `#E8B4C0` | Secondary accents |
| `wine-600` | `#7A2E45` | Primary buttons, links, brand accent |
| `wine-700` | `#62243A` | Button hover/pressed state |
| `ink` | `#3A2A2E` | Body text |
| `ink-soft` | `#7C6A6F` | Secondary copy and subtitles |
| `gold-hair` | `#C9A27A` | Tiny decorative hairlines and stems |

---

## Getting Started

### 1. Prerequisites

- Node.js `v20+` or `v24+`
- `pnpm` (install with `npm install -g pnpm` if not present)

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
pnpm build
pnpm start
```

---

## Centralized Brand Configuration

All brand-specific text (brand name, reader name, tagline, email, and social links) lives in a single configuration file:
- `src/config/site.ts` (configured as `Tarot with Jiji` / `Jiji`)

---

## Image Asset Slots

Documented in `public/images/README.md`.
Custom watercolor and photography slots can be placed directly in `public/images/`.

---

## Phase 1 Acceptance Checklist

- [x] Next.js + TypeScript (`strict: true`) + Tailwind + pnpm configured.
- [x] Typography: Cormorant Garamond, Inter, and Pinyon Script loaded via `next/font`.
- [x] Design tokens: `#FAF6F2` (paper), `#FFFDFB` (ivory), `#7A2E45` (wine-600), blush accents, paper texture overlay.
- [x] Base components: `Button`, `Card`, `Container`, `Section`, `Heading`, `FloralCorner`, `PolaroidFrame`, `Accordion`, `Input`, `Textarea`, `Select`.
- [x] Home page with all 9 sections: Header (scroll reactive + mobile drawer + currency toggle), Hero, About Preview with tilted polaroids, Services, How It Works (4 steps), Testimonials, FAQ Accordion, Final CTA, and Footer with disclaimer.
- [x] Anti-pattern adherence: No dark mode, no glassmorphism, no gradient blobs, no emoji icons, no generic templates.
- [x] `src/config/site.ts`, `public/images/README.md`, `.env.example`, `README.md`.
