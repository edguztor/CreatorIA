'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Platform } from '@/types'
import toast from 'react-hot-toast'

const platformConfig: Record<Platform, { label: string; emoji: string; color: string; maxChars: number }> = {
  instagram: { label: 'Instagram', emoji: '📸', color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800', maxChars: 2200 },
  linkedin: { label: 'LinkedIn', emoji: '💼', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800', maxChars: 3000 },
  facebook: { label: 'Facebook', emoji: '👥', color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800', maxChars: 63206 },
  twitter: { label: 'Twitter/X', emoji: '🐦', color: 'bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800', maxChars: 280 },
  tiktok: { label: 'TikTok', emoji: '🎵', color: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800', maxChars: 2200 },
}

interface PostCardProps {
  platform: Platform
  content: string
}

export function PostCard({ platform, content }: PostCardProps) {
  const [copied, setCopied] = useState(false)
  const config = platformConfig[platform]
  const charCount = content.length
  const overLimit = charCount > config.maxChars

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('rounded-xl border p-5 flex flex-col gap-3', config.color)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{config.label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-500" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{content}</p>

      {/* Character count */}
      <div className="flex justify-end">
        <span className={cn('text-xs', overLimit ? 'text-red-500 font-semibold' : 'text-gray-400')}>
          {charCount} / {config.maxChars} chars
          {overLimit && ' (over limit)'}
        </span>
      </div>
    </div>
  )
}
