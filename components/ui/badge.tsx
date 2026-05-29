import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'free' | 'starter' | 'pro' | 'success' | 'warning'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        {
          'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300': variant === 'default' || variant === 'free',
          'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300': variant === 'starter',
          'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300': variant === 'pro',
          'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300': variant === 'success',
          'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300': variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
