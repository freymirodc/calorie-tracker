'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useDeleteAllUserData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) {
        throw new Error('User ID is required')
      }

      // Delete all user data in the correct order (respecting foreign key constraints)
      const deletions = [
        // Delete daily calories
        supabase
          .from('daily_calories')
          .delete()
          .eq('user_id', userId),
        
        // Delete weekly goals
        supabase
          .from('weekly_goals')
          .delete()
          .eq('user_id', userId),
        
        // Delete custom fasting presets
        supabase
          .from('user_fasting_presets')
          .delete()
          .eq('user_id', userId)
      ]

      // Execute all deletions
      const results = await Promise.all(deletions)
      
      // Check for errors
      results.forEach((result, index) => {
        if (result.error) {
          const tableNames = ['daily_calories', 'weekly_goals', 'user_fasting_presets']
          throw new Error(`Failed to delete ${tableNames[index]}: ${result.error.message}`)
        }
      })

      return results
    },
    onSuccess: () => {
      // Invalidate all queries to refresh the UI
      queryClient.invalidateQueries()
      toast.success('All data deleted successfully')
    },
    onError: (error: Error) => {
      console.error('Error deleting user data:', error)
      toast.error(`Failed to delete data: ${error.message}`)
    },
  })
}

export function useDeleteCalorieData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const { error } = await supabase
        .from('daily_calories')
        .delete()
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to delete calorie data: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-calories'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-overview'] })
      toast.success('Calorie data deleted successfully')
    },
    onError: (error: Error) => {
      console.error('Error deleting calorie data:', error)
      toast.error(`Failed to delete calorie data: ${error.message}`)
    },
  })
}

export function useDeleteFastingPresets() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const { error } = await supabase
        .from('user_fasting_presets')
        .delete()
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to delete fasting presets: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-fasting-presets'] })
      toast.success('Custom fasting presets deleted successfully')
    },
    onError: (error: Error) => {
      console.error('Error deleting fasting presets:', error)
      toast.error(`Failed to delete fasting presets: ${error.message}`)
    },
  })
}

export function useDeleteWeeklyGoals() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const { error } = await supabase
        .from('weekly_goals')
        .delete()
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to delete weekly goals: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-goals'] })
      toast.success('Weekly goals deleted successfully')
    },
    onError: (error: Error) => {
      console.error('Error deleting weekly goals:', error)
      toast.error(`Failed to delete weekly goals: ${error.message}`)
    },
  })
}
