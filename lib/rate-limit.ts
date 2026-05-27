// In-memory rate limiter — replaced by Upstash Redis in production for multi-instance safety
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 1000  // 1 minute
const MAX_REQUESTS = 10       // 10 generations per minute per user

export async function checkRateLimit(userId: string): Promise<{ success: boolean; remaining: number }> {
  // Prefer Upstash Redis when credentials are provided
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '1 m'),
        analytics: true,
      })

      const { success, remaining } = await ratelimit.limit(`generate:${userId}`)
      return { success, remaining }
    } catch {
      // Fall through to in-memory fallback
    }
  }

  // In-memory fallback
  const now = Date.now()
  const record = inMemoryStore.get(userId)

  if (!record || record.resetAt < now) {
    inMemoryStore.set(userId, { count: 1, resetAt: now + WINDOW_MS })
    return { success: true, remaining: MAX_REQUESTS - 1 }
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 }
  }

  record.count++
  return { success: true, remaining: MAX_REQUESTS - record.count }
}
