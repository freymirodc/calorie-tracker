import { DailyCalories, WeeklyGoal } from './supabase'
import { getWeekStart, getRemainingDaysInWeek, isToday, isFuture } from './date-utils'

export interface CalorieCalculation {
  totalConsumed: number
  totalTarget: number
  remaining: number
  remainingDays: number
  dailyRecommendation: number
  isOnTrack: boolean
  weekProgress: number
}

/**
 * Calculate calorie statistics for a week
 */
export function calculateWeeklyStats(
  dailyEntries: DailyCalories[],
  weeklyGoal: WeeklyGoal | null,
  currentDate: Date = new Date()
): CalorieCalculation {
  const weekStart = getWeekStart(currentDate)
  
  // Filter entries for current week
  const weekEntries = dailyEntries.filter(entry => {
    const entryDate = new Date(entry.date)
    const entryWeekStart = getWeekStart(entryDate)
    return entryWeekStart.getTime() === weekStart.getTime()
  })

  const totalConsumed = weekEntries.reduce((sum, entry) => sum + entry.calories_consumed, 0)
  const totalTarget = weeklyGoal?.total_target_calories || 0
  const remaining = Math.max(0, totalTarget - totalConsumed)
  const remainingDays = getRemainingDaysInWeek(currentDate)
  
  // Calculate daily recommendation for remaining days
  const dailyRecommendation = remainingDays > 0 ? Math.round(remaining / remainingDays) : 0
  
  // Check if on track (consumed <= target for completed days)
  const completedDays = weekEntries.filter(entry => !isFuture(new Date(entry.date))).length
  const expectedConsumed = completedDays > 0 ? (totalTarget / 7) * completedDays : 0
  const isOnTrack = totalConsumed <= expectedConsumed * 1.1 // 10% tolerance
  
  // Calculate week progress (0-100%)
  const weekProgress = totalTarget > 0 ? Math.min(100, (totalConsumed / totalTarget) * 100) : 0

  return {
    totalConsumed,
    totalTarget,
    remaining,
    remainingDays,
    dailyRecommendation,
    isOnTrack,
    weekProgress
  }
}

/**
 * Calculate daily calorie status
 */
export function calculateDailyStatus(
  entry: DailyCalories | null,
  targetCalories: number
): {
  consumed: number
  target: number
  remaining: number
  isOverTarget: boolean
  progress: number
} {
  const consumed = entry?.calories_consumed || 0
  const remaining = Math.max(0, targetCalories - consumed)
  const isOverTarget = consumed > targetCalories
  const progress = targetCalories > 0 ? Math.min(100, (consumed / targetCalories) * 100) : 0

  return {
    consumed,
    target: targetCalories,
    remaining,
    isOverTarget,
    progress
  }
}

/**
 * Get calorie status color based on progress
 */
export function getCalorieStatusColor(progress: number, isOverTarget: boolean): string {
  if (isOverTarget) return 'text-red-600'
  if (progress >= 90) return 'text-green-600'
  if (progress >= 70) return 'text-yellow-600'
  return 'text-gray-600'
}

/**
 * Get progress bar color based on status
 */
export function getProgressBarColor(progress: number, isOverTarget: boolean): string {
  if (isOverTarget) return 'bg-red-500'
  if (progress >= 90) return 'bg-green-500'
  if (progress >= 70) return 'bg-yellow-500'
  return 'bg-blue-500'
}

/**
 * Format calorie number for display
 */
export function formatCalories(calories: number): string {
  return calories.toLocaleString()
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: 'male' | 'female'
): number {
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: number): number {
  // Activity levels:
  // 1.2 = sedentary
  // 1.375 = lightly active
  // 1.55 = moderately active
  // 1.725 = very active
  // 1.9 = extremely active
  return Math.round(bmr * activityLevel)
}
