import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UsageBar } from '@/components/dashboard/UsageBar'
import { Badge } from '@/components/ui/badge'
import { Wand2, Clock, TrendingUp } from 'lucide-react'
import type { Profile, Plan } from '@/types'

export default async function DashboardHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  // Get recent posts count
  const { count: totalPosts } = await supabase
    .from('generated_posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hey, {firstName}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Ready to create some great content?
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button size="lg">
            <Wand2 className="h-4 w-4" />
            Generate posts
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPosts ?? 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total posts generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.posts_used_this_month ?? 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posts this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{profile?.plan ?? 'free'}</p>
                  <Badge variant={(profile?.plan ?? 'free') as Plan}>{profile?.plan ?? 'free'}</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current plan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage bar */}
      {profile && (
        <UsageBar
          used={profile.posts_used_this_month}
          limit={profile.posts_limit}
          plan={profile.plan}
        />
      )}

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick start</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/dashboard/generate">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors cursor-pointer">
              <Wand2 className="h-5 w-5 text-violet-600" />
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">Generate posts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create new social media content</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/history">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors cursor-pointer">
              <Clock className="h-5 w-5 text-violet-600" />
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">View history</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Browse previously generated posts</p>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
