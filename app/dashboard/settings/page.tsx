'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, CreditCard } from 'lucide-react'
import type { Profile, Plan } from '@/types'
import toast from 'react-hot-toast'

const PLAN_NAMES: Record<Plan, string> = {
  free: 'Free',
  starter: 'Starter ($9/mo)',
  pro: 'Pro ($29/mo)',
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<Profile>()

      if (data) {
        setProfile(data)
        setName(data.full_name ?? '')
      }
    }
    fetchProfile()
  }, [])

  const handleSaveName = async () => {
    if (!name.trim()) return
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim() })
      .eq('id', user!.id)

    if (error) {
      toast.error('Failed to update name')
    } else {
      toast.success('Name updated!')
      setProfile((p) => p ? { ...p, full_name: name.trim() } : p)
    }
    setSaving(false)
  }

  const handleUpgrade = async (plan: 'starter' | 'pro') => {
    setCheckoutLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Failed to start checkout')
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will revert to the Free plan.')) return

    setCancelLoading(true)
    try {
      const res = await fetch('/api/stripe/cancel', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Failed to cancel subscription')
        return
      }

      toast.success('Subscription cancelled. You will revert to the Free plan at the end of the billing period.')
      setProfile((p) => p ? { ...p, plan: 'free' } : p)
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and subscription</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="Email address"
            value={profile?.email ?? ''}
            disabled
            className="opacity-60"
          />
          <Button onClick={handleSaveName} loading={saving} disabled={!name.trim()}>
            Save changes
          </Button>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-violet-600" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Current plan</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile ? PLAN_NAMES[profile.plan] : '—'}
              </p>
            </div>
            <Badge variant={(profile?.plan ?? 'free') as Plan} className="text-sm px-3 py-1">
              {profile?.plan ?? 'free'}
            </Badge>
          </div>

          {profile?.plan === 'free' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Starter</p>
                <p className="text-2xl font-bold text-violet-600 mb-1">$9<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">100 posts/month, all platforms</p>
                <Button
                  size="sm"
                  className="w-full"
                  loading={checkoutLoading === 'starter'}
                  onClick={() => handleUpgrade('starter')}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Upgrade
                </Button>
              </div>
              <div className="rounded-xl border-2 border-violet-600 p-4 relative">
                <div className="absolute -top-3 left-3 bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded">BEST VALUE</div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Pro</p>
                <p className="text-2xl font-bold text-violet-600 mb-1">$29<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Unlimited posts + scheduler</p>
                <Button
                  size="sm"
                  className="w-full"
                  loading={checkoutLoading === 'pro'}
                  onClick={() => handleUpgrade('pro')}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Upgrade
                </Button>
              </div>
            </div>
          )}

          {profile?.plan !== 'free' && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Cancelling will revert you to the Free plan at the end of your billing period.
              </p>
              <Button variant="danger" size="sm" onClick={handleCancelSubscription} loading={cancelLoading}>
                Cancel subscription
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
