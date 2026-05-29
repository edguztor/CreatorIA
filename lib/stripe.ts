import Stripe from 'stripe'

// Lazy singleton — avoids "missing apiKey" errors during Next.js build-time static analysis
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

// Convenience re-export used by API routes
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    posts_limit: 5,
    priceId: null,
  },
  starter: {
    name: 'Starter',
    price: 9,
    posts_limit: 100,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  pro: {
    name: 'Pro',
    price: 29,
    posts_limit: 999999,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
} as const
