const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Manager, Startup',
    avatar: 'SC',
    content: 'PostGenius cut my content creation time from 4 hours to 15 minutes. I generate a whole week of posts in one session now.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Freelance Consultant',
    avatar: 'MR',
    content: 'The LinkedIn posts it generates are indistinguishable from what I\'d write myself — but 50x faster. Absolutely love it.',
  },
  {
    name: 'Priya Patel',
    role: 'E-commerce Founder',
    avatar: 'PP',
    content: 'I manage 3 brands on social media. PostGenius is the only tool that actually understands different platform tones.',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by creators worldwide
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join thousands of marketers and founders saving hours every week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">&quot;{t.content}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
