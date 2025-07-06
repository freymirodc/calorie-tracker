export interface FastingPreset {
  id: string
  name: string
  hours: number
  description: string
  color: string
  bgColor: string
  textColor: string
  isCustom?: boolean
}

export interface UserFastingPreset extends FastingPreset {
  user_id: string
  created_at: string
}

// Predefined fasting presets with colors similar to the reference image
export const DEFAULT_FASTING_PRESETS: FastingPreset[] = [
  {
    id: 'circadian-rhythm',
    name: 'Circadian Rhythm TRF',
    hours: 13,
    description: 'Natural eating window',
    color: 'purple',
    bgColor: 'bg-purple-500',
    textColor: 'text-white',
  },
  {
    id: 'lean-gains',
    name: '16:8',
    hours: 16,
    description: 'Most popular method',
    color: 'pink',
    bgColor: 'bg-pink-500',
    textColor: 'text-white',
  },
  {
    id: 'warrior',
    name: '18:6',
    hours: 18,
    description: 'Extended fasting',
    color: 'green',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
  },
  {
    id: 'omad-prep',
    name: '20:4',
    hours: 20,
    description: 'OMAD preparation',
    color: 'orange',
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
  },
  {
    id: 'extended',
    name: '24 Hour Fast',
    hours: 24,
    description: 'Full day fast',
    color: 'blue',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
  },
  {
    id: 'monk-fast',
    name: '36 Hour Fast',
    hours: 36,
    description: 'Extended benefits',
    color: 'indigo',
    bgColor: 'bg-indigo-500',
    textColor: 'text-white',
  },
]

/**
 * Calculate fast end time based on start time and duration
 */
export function calculateFastEndTime(startTime: string, hours: number): string {
  if (!startTime) return ''
  
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const startDate = new Date()
  startDate.setHours(startHour, startMinute, 0, 0)
  
  const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000)
  
  // Format as HH:MM
  return endDate.toTimeString().slice(0, 5)
}

/**
 * Calculate fast start time based on end time and duration
 */
export function calculateFastStartTime(endTime: string, hours: number): string {
  if (!endTime) return ''
  
  const [endHour, endMinute] = endTime.split(':').map(Number)
  const endDate = new Date()
  endDate.setHours(endHour, endMinute, 0, 0)
  
  const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000)
  
  // Format as HH:MM
  return startDate.toTimeString().slice(0, 5)
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string, customPresets: UserFastingPreset[] = []): FastingPreset | undefined {
  const defaultPreset = DEFAULT_FASTING_PRESETS.find(preset => preset.id === id)
  if (defaultPreset) return defaultPreset
  
  return customPresets.find(preset => preset.id === id)
}

/**
 * Validate fasting hours
 */
export function validateFastingHours(hours: number): boolean {
  return hours >= 0 && hours <= 168 // Max 1 week
}

/**
 * Format fasting duration for display
 */
export function formatFastingDuration(hours: number): string {
  if (hours < 24) {
    return `${hours}h`
  } else if (hours % 24 === 0) {
    const days = hours / 24
    return `${days}d`
  } else {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  }
}

/**
 * Get fasting status based on current time and fast times
 */
export function getFastingStatus(
  fastStartTime: string,
  fastEndTime: string,
  currentTime: Date = new Date()
): {
  isFasting: boolean
  timeRemaining: number // in minutes
  progress: number // 0-100%
} {
  if (!fastStartTime || !fastEndTime) {
    return { isFasting: false, timeRemaining: 0, progress: 0 }
  }

  const now = currentTime
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  const [startHour, startMinute] = fastStartTime.split(':').map(Number)
  const [endHour, endMinute] = fastEndTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  
  let isFasting = false
  let timeRemaining = 0
  let progress = 0
  
  // Handle same-day fast
  if (startMinutes < endMinutes) {
    isFasting = currentMinutes >= startMinutes && currentMinutes < endMinutes
    if (isFasting) {
      timeRemaining = endMinutes - currentMinutes
      progress = ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100
    }
  } else {
    // Handle overnight fast
    isFasting = currentMinutes >= startMinutes || currentMinutes < endMinutes
    if (isFasting) {
      if (currentMinutes >= startMinutes) {
        timeRemaining = (24 * 60) - currentMinutes + endMinutes
        progress = ((currentMinutes - startMinutes) / ((24 * 60) - startMinutes + endMinutes)) * 100
      } else {
        timeRemaining = endMinutes - currentMinutes
        const totalFastMinutes = (24 * 60) - startMinutes + endMinutes
        const elapsedMinutes = (24 * 60) - startMinutes + currentMinutes
        progress = (elapsedMinutes / totalFastMinutes) * 100
      }
    }
  }
  
  return {
    isFasting,
    timeRemaining: Math.max(0, timeRemaining),
    progress: Math.min(100, Math.max(0, progress))
  }
}

/**
 * Create a custom preset
 */
export function createCustomPreset(
  name: string,
  hours: number,
  description: string = '',
  color: string = 'gray'
): Omit<FastingPreset, 'id'> {
  const colorMap: Record<string, { bgColor: string; textColor: string }> = {
    gray: { bgColor: 'bg-gray-500', textColor: 'text-white' },
    red: { bgColor: 'bg-red-500', textColor: 'text-white' },
    orange: { bgColor: 'bg-orange-500', textColor: 'text-white' },
    yellow: { bgColor: 'bg-yellow-500', textColor: 'text-white' },
    green: { bgColor: 'bg-green-500', textColor: 'text-white' },
    blue: { bgColor: 'bg-blue-500', textColor: 'text-white' },
    indigo: { bgColor: 'bg-indigo-500', textColor: 'text-white' },
    purple: { bgColor: 'bg-purple-500', textColor: 'text-white' },
    pink: { bgColor: 'bg-pink-500', textColor: 'text-white' },
  }
  
  const colorConfig = colorMap[color] || colorMap.gray
  
  return {
    name,
    hours,
    description,
    color,
    ...colorConfig,
    isCustom: true,
  }
}
