import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, WeeklyGoal } from '@/lib/supabase'
import { formatDate, getWeekStart } from '@/lib/date-utils'

/**
 * Fetch weekly goal for a specific week
 */
export function useWeeklyGoal(date: Date, userId?: string) {
  const weekStart = getWeekStart(date)
  
  return useQuery({
    queryKey: ['weekly-goal', formatDate(weekStart), userId],
    queryFn: async (): Promise<WeeklyGoal | null> => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start', formatDate(weekStart))
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
 * Fetch all weekly goals for a user
 */
export function useWeeklyGoals(userId?: string) {
  return useQuery({
    queryKey: ['weekly-goals', userId],
    queryFn: async (): Promise<WeeklyGoal[]> => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

/**
 * Create or update weekly goal
 */
export function useUpsertWeeklyGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      date: Date
      total_target_calories: number
      userId: string
    }) => {
      const weekStart = getWeekStart(data.date)
      
      const { data: result, error } = await supabase
        .from('weekly_goals')
        .upsert({
          user_id: data.userId,
          week_start: formatDate(weekStart),
          total_target_calories: data.total_target_calories,
        })
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['weekly-goal', data.week_start, data.user_id] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['weekly-goals', data.user_id] 
      })
    },
  })
}

/**
 * Delete weekly goal
 */
export function useDeleteWeeklyGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weekly_goals')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      // Invalidate all weekly goal queries
      queryClient.invalidateQueries({ queryKey: ['weekly-goal'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-goals'] })
    },
  })
}
