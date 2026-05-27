'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, RefreshCw } from 'lucide-react'
import { formatDate, truncate } from '@/lib/utils'
import type { GeneratedPost } from '@/types'
import toast from 'react-hot-toast'

const platformEmoji: Record<string, string> = {
  instagram: '📸',
  linkedin: '💼',
  facebook: '👥',
  twitter: '🐦',
  tiktok: '🎵',
}

export default function HistoryPage() {
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('generated_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      toast.error('Failed to load history')
    } else {
      setPosts(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('generated_posts').delete().eq('id', id)

    if (error) {
      toast.error('Failed to delete post')
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Post deleted')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {posts.length} posts generated
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchPosts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">No posts yet</p>
              <p className="text-sm">Generate your first posts to see them here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400 pr-4">Platform</th>
                    <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400 pr-4">Content preview</th>
                    <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400 pr-4">Tone</th>
                    <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400 pr-4">Date</th>
                    <th className="text-right pb-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {posts.map((post) => (
                    <tr key={post.id} className="group">
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-1.5">
                          <span>{platformEmoji[post.platform] ?? '📱'}</span>
                          <span className="capitalize text-gray-700 dark:text-gray-300 hidden sm:inline">
                            {post.platform}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 pr-4 max-w-xs">
                        <p className="text-gray-600 dark:text-gray-400 truncate">
                          {truncate(post.generated_content, 80)}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="capitalize text-gray-500 dark:text-gray-400 text-xs">
                          {post.tone}
                        </span>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label="Delete post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
