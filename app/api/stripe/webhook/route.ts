import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Read the raw body as a buffer for Stripe signature verification
export const dynamic = 'force-dynamic'

async function updateUserPlan(userId: string, plan: 'free' | 'starter' | 'pro', subscriptionId?: string) {
  const admin = createAdminClient()
  await admin
    .from('profiles')
    .update({
      plan,
      posts_limit: PLANS[plan].posts_limit,
      stripe_subscription_id: subscriptionId ?? null,
    })
    .eq('id', userId)
}

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer()
  const body = Buffer.from(rawBody)
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook] Invalid signature:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const plan = session.metadata?.plan as 'starter' | 'pro'
        const subscriptionId = session.subscription as string

        if (userId && plan) {
          await updateUserPlan(userId, plan, subscriptionId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id
        const plan = subscription.metadata?.plan as 'starter' | 'pro'

        if (userId && plan && subscription.status === 'active') {
          await updateUserPlan(userId, plan, subscription.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Subscription cancelled — revert to free
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        if (userId) {
          await updateUserPlan(userId, 'free')
        }
        break
      }

      case 'invoice.payment_failed': {
        // Could send an email notification here
        const invoice = event.data.object as Stripe.Invoice
        console.warn('[webhook] Payment failed for customer:', (invoice as { customer?: string }).customer)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] Handler error:', err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }
}
