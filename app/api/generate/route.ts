import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'
import type { GenerateRequest, GenerateResult, Platform } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PLATFORM_GUIDELINES: Record<Platform, string> = {
  instagram: 'Instagram: visually descriptive, conversational, use 5-10 relevant hashtags, include a strong hook in the first line, max 2200 chars, end with a CTA',
  linkedin: 'LinkedIn: professional and insightful, story-driven, minimal hashtags (3-5), no fluff, focus on value and expertise, use line breaks for readability',
  facebook: 'Facebook: friendly and community-focused, can be longer-form, ask a question to drive engagement, 3-5 hashtags',
  twitter: 'Twitter/X: concise and punchy, MUST be under 280 characters (including hashtags), one clear idea, create intrigue',
  tiktok: 'TikTok: trendy and energetic, start with a hook, use Gen-Z friendly language, trending hashtags, encourage sharing',
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional: 'Use a professional, authoritative tone. Focus on value, expertise, and trust-building.',
  casual: 'Use a warm, friendly, conversational tone. Feel like a message from a friend.',
  funny: 'Use humor, wit, and light-heartedness. Be playful and entertaining.',
  inspirational: 'Use motivational, empowering language. Inspire action and positive emotion.',
}

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  english: 'Write in English.',
  spanish: 'Write in Spanish (español). Use natural, native-sounding Spanish.',
  portuguese: 'Write in Portuguese (português). Use natural, native-sounding Brazilian Portuguese.',
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user via Supabase session cookie
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting — 10 requests per minute per user
    const { success: rateLimitOk, remaining } = await checkRateLimit(user.id)
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before generating again.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
      )
    }

    const body: GenerateRequest = await req.json()
    const { input_text, platforms, tone, language } = body

    // Validate input
    if (!input_text || input_text.trim().split(/\s+/).length < 10) {
      return NextResponse.json({ error: 'Input must be at least 10 words' }, { status: 400 })
    }
    if (!platforms?.length) {
      return NextResponse.json({ error: 'Select at least one platform' }, { status: 400 })
    }

    // Fetch user profile to check usage limits
    const admin = createAdminClient()
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('plan, posts_used_this_month, posts_limit')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check monthly usage limit
    const postsNeeded = platforms.length
    const isUnlimited = profile.posts_limit >= 999999
    if (!isUnlimited && profile.posts_used_this_month + postsNeeded > profile.posts_limit) {
      const remaining = Math.max(0, profile.posts_limit - profile.posts_used_this_month)
      return NextResponse.json(
        {
          error: `Monthly limit reached. You have ${remaining} posts remaining this month. Upgrade your plan to generate more.`,
          upgrade_required: true,
        },
        { status: 403 }
      )
    }

    // Build platform-specific prompt sections
    const platformSections = platforms
      .map((p) => `### ${p.toUpperCase()}\n${PLATFORM_GUIDELINES[p]}`)
      .join('\n\n')

    const systemPrompt = `You are an expert social media copywriter with 10+ years of experience growing brands on social media. Generate engaging, platform-optimized posts that drive real engagement.

RULES:
- Each post must be tailored specifically to the platform's format and audience
- Always include relevant emojis (naturally integrated, not forced)
- Always include relevant hashtags appropriate to the platform
- Always include a clear call to action
- Make every word count
- ${TONE_INSTRUCTIONS[tone] ?? TONE_INSTRUCTIONS.professional}
- ${LANGUAGE_INSTRUCTIONS[language] ?? LANGUAGE_INSTRUCTIONS.english}

PLATFORM GUIDELINES:
${platformSections}`

    const userPrompt = `Create social media posts for the following idea/product/service:

"${input_text}"

Return a JSON object with this exact structure:
{
  "posts": [
    ${platforms.map((p) => `{"platform": "${p}", "content": "the post text here"}`).join(',\n    ')}
  ]
}

Return ONLY valid JSON, no markdown, no explanation.`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse the JSON response
    let parsed: { posts: { platform: Platform; content: string }[] }
    try {
      parsed = JSON.parse(rawText.trim())
    } catch {
      // Try to extract JSON if model added extra text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'AI returned an unexpected format. Please try again.' }, { status: 500 })
      }
      parsed = JSON.parse(jsonMatch[0])
    }

    const results: GenerateResult[] = parsed.posts.map((p) => ({
      platform: p.platform,
      content: p.content,
      character_count: p.content.length,
    }))

    // Save each post to the database
    const postsToInsert = results.map((r) => ({
      user_id: user.id,
      input_text: input_text.trim(),
      platform: r.platform,
      generated_content: r.content,
      tone,
      language,
    }))

    await admin.from('generated_posts').insert(postsToInsert)

    // Increment usage counter
    await admin
      .from('profiles')
      .update({ posts_used_this_month: profile.posts_used_this_month + results.length })
      .eq('id', user.id)

    return NextResponse.json({ posts: results })
  } catch (err) {
    console.error('[/api/generate]', err)
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 })
  }
}
