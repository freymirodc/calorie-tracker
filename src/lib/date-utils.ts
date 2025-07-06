import { format, startOfWeek, endOfWeek, addDays, isAfter, isBefore, isSameDay } from 'date-fns'

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }) // Monday = 1
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 })
}

/**
 * Get all dates in a week starting from the given date
 */
export function getWeekDates(date: Date): Date[] {
  const start = getWeekStart(date)
  const dates: Date[] = []
  
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(start, i))
  }
  
  return dates
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Format date for display (human readable)
 */
export function formatDisplayDate(date: Date): string {
  return format(date, 'MMM dd, yyyy')
}

/**
 * Format date for day display
 */
export function formatDayName(date: Date): string {
  return format(date, 'EEEE')
}

/**
 * Format date for short day display
 */
export function formatShortDay(date: Date): string {
  return format(date, 'EEE')
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  return isAfter(date, new Date())
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return isBefore(date, new Date())
}

/**
 * Get remaining days in the current week (including today)
 */
export function getRemainingDaysInWeek(date: Date = new Date()): number {
  const weekEnd = getWeekEnd(date)
  const today = new Date()
  
  if (isAfter(today, weekEnd)) {
    return 0
  }
  
  const weekDates = getWeekDates(date)
  return weekDates.filter(d => !isBefore(d, today)).length
}
