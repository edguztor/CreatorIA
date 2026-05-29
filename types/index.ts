export type Plan = 'free' | 'starter' | 'pro'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  plan: Plan
  posts_used_this_month: number
  posts_limit: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface GeneratedPost {
  id: string
  user_id: string
  input_text: string
  platform: string
  generated_content: string
  tone: string
  language: string
  created_at: string
}

export type Platform = 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok'
export type Tone = 'professional' | 'casual' | 'funny' | 'inspirational'
export type Language = 'english' | 'spanish' | 'portuguese'

export interface GenerateRequest {
  input_text: string
  platforms: Platform[]
  tone: Tone
  language: Language
}

export interface GenerateResult {
  platform: Platform
  content: string
  character_count: number
}
