# PostGenius — AI Social Media Content Generator

PostGenius is a Micro-SaaS web app that generates platform-optimized social media posts using Claude AI. Built with Next.js 14, Supabase, Stripe, and Tailwind CSS.

## Features

- **AI content generation** — 7 posts across 5 platforms in seconds
- **Multi-platform support** — Instagram, LinkedIn, Twitter/X, Facebook, TikTok
- **Tone & language options** — Professional, Casual, Funny, Inspirational × English, Spanish, Portuguese
- **Auth system** — Email/password via Supabase Auth
- **Subscription billing** — Free, Starter ($9/mo), Pro ($29/mo) via Stripe
- **Post history** — Browse and delete previously generated posts
- **Usage limits** — Per-plan monthly post limits with real-time counter
- **Rate limiting** — 10 generations/minute per user (Upstash Redis or in-memory)
- **Dark mode** — Auto-detected via `prefers-color-scheme`
- **Fully responsive** — Mobile-first design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth + DB | Supabase |
| Payments | Stripe |
| AI | Anthropic Claude API |
| Hosting | Vercel |

---

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd postgenius
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste/run the contents of `supabase/schema.sql`
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. In **Products**, create two recurring subscription products:
   - **Starter** — $9/month → copy the **Price ID** → `STRIPE_STARTER_PRICE_ID`
   - **Pro** — $29/month → copy the **Price ID** → `STRIPE_PRO_PRICE_ID`
3. Go to **Developers → API Keys**:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Set up a webhook (Developers → Webhooks):
   - Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

### 4. Set up Anthropic

1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. Copy it → `ANTHROPIC_API_KEY`

### 5. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

For local Stripe webhook testing, install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Deploy to Vercel

1. Push your repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` to your production URL
5. Update the Stripe webhook endpoint to your production URL
6. Deploy!

---

## Database Schema

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | FK → `auth.users` |
| `email` | TEXT | |
| `full_name` | TEXT | |
| `plan` | TEXT | `free` / `starter` / `pro` |
| `posts_used_this_month` | INT | Resets monthly |
| `posts_limit` | INT | 5 / 100 / unlimited |
| `stripe_customer_id` | TEXT | |
| `stripe_subscription_id` | TEXT | |
| `created_at` | TIMESTAMPTZ | |

### `generated_posts`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `profiles` |
| `input_text` | TEXT | User's original prompt |
| `platform` | TEXT | instagram / linkedin / etc. |
| `generated_content` | TEXT | The AI-generated post |
| `tone` | TEXT | professional / casual / etc. |
| `language` | TEXT | english / spanish / portuguese |
| `created_at` | TIMESTAMPTZ | |

---

## Monthly Usage Reset

Add a cron job to reset `posts_used_this_month` on the 1st of each month. With Supabase Edge Functions:

```typescript
// supabase/functions/reset-usage/index.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async () => {
  await supabase.rpc('reset_monthly_usage')
  return new Response('OK')
})
```

Then schedule it in `supabase/config.toml`:

```toml
[functions.reset-usage]
schedule = "0 0 1 * *"
```

---

## Rate Limiting

By default, the app uses an in-memory rate limiter (10 requests/minute/user). For production with multiple Vercel instances, set up Upstash Redis:

1. Create a Redis database at [upstash.com](https://upstash.com)
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your environment variables

---

## Project Structure

```
postgenius/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/
│   │   ├── generate/route.ts        ← AI generation endpoint
│   │   └── stripe/
│   │       ├── checkout/route.ts    ← Stripe checkout session
│   │       ├── webhook/route.ts     ← Stripe webhook handler
│   │       └── cancel/route.ts      ← Cancel subscription
│   ├── dashboard/
│   │   ├── generate/page.tsx        ← Post generator UI
│   │   ├── history/page.tsx         ← Post history table
│   │   └── settings/page.tsx        ← Profile & billing
│   ├── layout.tsx
│   └── page.tsx                     ← Landing page
├── components/
│   ├── dashboard/                   ← Dashboard-specific components
│   │   ├── PostCard.tsx
│   │   ├── Sidebar.tsx
│   │   └── UsageBar.tsx
│   ├── landing/                     ← Landing page sections
│   │   ├── FAQ.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pricing.tsx
│   │   └── Testimonials.tsx
│   └── ui/                          ← Reusable UI primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                ← Browser Supabase client
│   │   ├── server.ts                ← Server Supabase client
│   │   └── admin.ts                 ← Service-role client
│   ├── stripe.ts                    ← Stripe instance & plan config
│   ├── rate-limit.ts                ← Rate limiting logic
│   └── utils.ts                     ← cn(), formatDate(), truncate()
├── supabase/
│   └── schema.sql                   ← DB schema, RLS, triggers
├── types/index.ts                   ← Shared TypeScript types
├── middleware.ts                    ← Route protection
├── .env.example
└── README.md
```

---

## License

MIT
