'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PostCard } from '@/components/dashboard/PostCard'
import { Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Platform, Tone, Language, GenerateResult } from '@/types'
import { cn } from '@/lib/utils'

const platforms: { id: Platform; label: string; emoji: string }[] = [
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { id: 'facebook', label: 'Facebook', emoji: '👥' },
  { id: 'twitter', label: 'Twitter/X', emoji: '🐦' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
]

const tones: { id: Tone; label: string; emoji: string }[] = [
  { id: 'professional', label: 'Professional', emoji: '👔' },
  { id: 'casual', label: 'Casual', emoji: '😊' },
  { id: 'funny', label: 'Funny', emoji: '😄' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨' },
]

const languages: { id: Language; label: string }[] = [
  { id: 'english', label: 'English' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'portuguese', label: 'Portuguese' },
]

export default function GeneratePage() {
  const [inputText, setInputText] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram', 'linkedin'])
  const [tone, setTone] = useState<Tone>('professional')
  const [language, setLanguage] = useState<Language>('english')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GenerateResult[]>([])

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length

  const handleGenerate = async () => {
    if (wordCount < 10) {
      toast.error('Please describe your idea in at least 10 words')
      return
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Select at least one platform')
      return
    }

    setLoading(true)
    setResults([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: inputText, platforms: selectedPlatforms, tone, language }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Generation failed. Please try again.')
        return
      }

      setResults(data.posts)
      toast.success(`Generated ${data.posts.length} posts!`)
    } catch {
      toast.error('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Posts</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Describe your idea and get AI-generated posts for every platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Input text */}
          <Textarea
            id="input"
            label="Your idea, product or message"
            placeholder="Describe your product, service, or campaign idea. The more detail you give, the better the output will be. (minimum 10 words)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            hint={`${wordCount} words ${wordCount < 10 ? '(need at least 10)' : '✓'}`}
          />

          {/* Platform selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    selectedPlatforms.includes(p.id)
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <span>{p.emoji}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</p>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    tone === t.id
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  )}
                >
                  <span>{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</p>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={cn(
                    'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    language === l.id
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            loading={loading}
            className="w-full"
            size="lg"
            disabled={wordCount < 10 || selectedPlatforms.length === 0}
          >
            <Wand2 className="h-4 w-4" />
            {loading ? 'Generating...' : 'Generate Posts'}
          </Button>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-violet-200 dark:border-violet-900" />
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 animate-spin" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                AI is crafting your posts...
              </p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center gap-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <Wand2 className="h-10 w-10 text-gray-300 dark:text-gray-700" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Your generated posts will appear here
              </p>
            </div>
          )}

          {results.map((result) => (
            <PostCard key={result.platform} platform={result.platform} content={result.content} />
          ))}
        </div>
      </div>
    </div>
  )
}
