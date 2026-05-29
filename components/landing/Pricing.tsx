import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out PostGenius',
    features: [
      '5 posts per month',
      'Instagram, Twitter, LinkedIn',
      'English only',
      'Copy to clipboard',
    ],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'For creators and solopreneurs',
    features: [
      '100 posts per month',
      'All 5 platforms',
      '3 languages',
      'All tone options',
      'Post history',
      'Priority support',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Unlimited posts',
      'All 5 platforms',
      '3 languages',
      'All tone options',
      'Post history',
      'Content scheduler',
      'Priority support',
      'Team workspace',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'bg-violet-600 text-white shadow-2xl shadow-violet-500/30 scale-105'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-violet-200' : 'text-gray-500 dark:text-gray-400'}`}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm pb-1 ${plan.highlighted ? 'text-violet-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? 'text-violet-200' : 'text-violet-600'}`} />
                    <span className={plan.highlighted ? 'text-violet-100' : 'text-gray-600 dark:text-gray-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'secondary' : 'primary'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
