import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, DailyCalories } from '@/lib/supabase'
import { formatDate } from '@/lib/date-utils'

/**
 * Fetch daily calories for a specific date
 */
export function useDailyCalories(date: Date, userId?: string) {
  return useQuery({
    queryKey: ['daily-calories', formatDate(date), userId],
    queryFn: async (): Promise<DailyCalories | null> => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from('daily_calories')
        .select('*')
        .eq('user_id', userId)
        .eq('date', formatDate(date))
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return data || null
    },
    enabled: !!userId,
  })
}

/**
 * Fetch daily calories for a date range
 */
export function useDailyCaloriesRange(startDate: Date, endDate: Date, userId?: string) {
  return useQuery({
    queryKey: ['daily-calories-range', formatDate(startDate), formatDate(endDate), userId],
    queryFn: async (): Promise<DailyCalories[]> => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('daily_calories')
        .select('*')
        .eq('user_id', userId)
        .gte('date', formatDate(startDate))
        .lte('date', formatDate(endDate))
        .order('date', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

/**
 * Create or update daily calories
 */
export function useUpsertDailyCalories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      date: Date
      calories_consumed: number
      target_calories: number
      fasting_hours?: number
      fast_start_time?: string
      fast_end_time?: string
      notes?: string
      userId: string
    }) => {
      const { data: result, error } = await supabase
        .from('daily_calories')
        .upsert({
          user_id: data.userId,
          date: formatDate(data.date),
          calories_consumed: data.calories_consumed,
          target_calories: data.target_calories,
          fasting_hours: data.fasting_hours,
          fast_start_time: data.fast_start_time,
          fast_end_time: data.fast_end_time,
          notes: data.notes,
        })
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['daily-calories', data.date, data.user_id] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['daily-calories-range'] 
      })
    },
  })
}

/**
 * Delete daily calories entry
 */
export function useDeleteDailyCalories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('daily_calories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      // Invalidate all daily calories queries
      queryClient.invalidateQueries({ queryKey: ['daily-calories'] })
    },
  })
}
