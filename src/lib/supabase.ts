import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface DailyCalories {
  id: string
  user_id: string
  date: string
  calories_consumed: number
  target_calories: number
  fasting_hours?: number
  fast_start_time?: string
  fast_end_time?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface WeeklyGoal {
  id: string
  user_id: string
  week_start: string
  total_target_calories: number
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface UserFastingPreset {
  id: string
  user_id: string
  name: string
  hours: number
  description?: string
  color: string
  bg_color: string
  text_color: string
  created_at: string
  updated_at: string
}
