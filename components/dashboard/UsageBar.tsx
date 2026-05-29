import { cn } from '@/lib/utils'

interface UsageBarProps {
  used: number
  limit: number
  plan: string
}

export function UsageBar({ used, limit, plan }: UsageBarProps) {
  const isUnlimited = limit >= 999999
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100)
  const isNearLimit = percentage >= 80

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Posts this month</span>
        <span className={cn('text-sm font-semibold', isNearLimit ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white')}>
          {used} / {isUnlimited ? '∞' : limit}
        </span>
      </div>

      {!isUnlimited && (
        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isNearLimit ? 'bg-amber-500' : 'bg-violet-600'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {isNearLimit && !isUnlimited && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">
          You&apos;re near your limit. Consider upgrading.
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 capitalize">
        {plan} plan · resets monthly
      </p>
    </div>
  )
}
