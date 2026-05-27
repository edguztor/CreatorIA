import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-28 pb-20 px-4 overflow-hidden">
      {/* Gradient background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-400/20 dark:bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/30 px-4 py-1.5 text-sm text-violet-700 dark:text-violet-300 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Claude AI
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
          Generate{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
            7 social media posts
          </span>
          <br />
          in 10 seconds with AI
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Stop spending hours writing social media content. PostGenius creates platform-optimized posts with emojis, hashtags, and CTAs for Instagram, LinkedIn, Twitter, and more — instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              See how it works
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">No credit card required · 5 free posts/month</p>

        {/* Preview card */}
        <div className="mt-16 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl shadow-violet-500/10 p-6 text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-gray-400">PostGenius Generator</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-3 border border-violet-100 dark:border-violet-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">📸 Instagram</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                🚀 Tired of juggling 5 different tools for your marketing? We just launched the all-in-one solution you&apos;ve been dreaming of! ✨ Our platform cuts your workflow time by 70% so you can focus on what truly matters. 💡 Ready to transform your business? Link in bio! #ProductivityHack #Marketing #Entrepreneur #SmallBusiness
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">💼 LinkedIn</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                After 2 years of development, we&apos;re proud to introduce a platform that consolidates your entire marketing stack into one seamless workflow. The result? Teams report saving 15+ hours per week. Here&apos;s what makes it different... #Innovation #B2B #MarTech
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
