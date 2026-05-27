'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'How does PostGenius generate posts?',
    a: 'PostGenius uses Claude AI by Anthropic — one of the most capable AI models available. You provide context about your product or idea, and the AI creates platform-specific content optimized for each social network\'s format, tone, and audience.',
  },
  {
    q: 'What social media platforms are supported?',
    a: 'PostGenius supports Instagram, LinkedIn, Twitter/X, Facebook, and TikTok. Each platform gets uniquely tailored content — LinkedIn posts are professional, Twitter posts are concise, Instagram posts have strong visual hooks, etc.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, absolutely. You can cancel your subscription at any time from the Settings page in your dashboard. Your plan stays active until the end of the billing period.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 7-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 7 days of your purchase and we\'ll issue a full refund.',
  },
  {
    q: 'Is the content unique and not plagiarized?',
    a: 'Every post is generated fresh from your specific input. The AI creates original content tailored to your product, industry, and tone — it\'s never copied from existing posts.',
  },
  {
    q: 'What languages are supported?',
    a: 'Currently English, Spanish, and Portuguese are supported. We plan to add more languages based on user demand.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-medium text-gray-900 dark:text-white">{q}</span>
        <ChevronDown className={cn('h-5 w-5 flex-shrink-0 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</div>
      )}
    </div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently asked questions
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 divide-y divide-gray-200 dark:divide-gray-800">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
