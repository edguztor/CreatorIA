import { PenLine, LayoutGrid, Zap } from 'lucide-react'

const steps = [
  {
    icon: PenLine,
    step: '01',
    title: 'Write your idea',
    description: 'Describe your product, service, or campaign in a few sentences. The more detail, the better the output.',
  },
  {
    icon: LayoutGrid,
    step: '02',
    title: 'Choose platforms',
    description: 'Select Instagram, LinkedIn, Twitter/X, Facebook, or TikTok. Pick your tone and language.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Get your posts',
    description: 'Receive platform-optimized posts with emojis, hashtags, and CTAs in seconds. Copy and post.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            From idea to post in 3 steps
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
            No templates, no guesswork. Just your idea transformed into scroll-stopping content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-violet-300 to-violet-100 dark:from-violet-800 dark:to-violet-900" />
              )}

              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/30 mb-6">
                <step.icon className="h-8 w-8" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-900 text-xs font-bold text-violet-600 border border-violet-200 dark:border-violet-800">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
