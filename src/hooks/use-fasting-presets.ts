import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, UserFastingPreset } from '@/lib/supabase'
import { createCustomPreset } from '@/lib/fasting-utils'

/**
 * Fetch user's custom fasting presets
 */
export function useUserFastingPresets(userId?: string) {
  return useQuery({
    queryKey: ['user-fasting-presets', userId],
    queryFn: async (): Promise<UserFastingPreset[]> => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('user_fasting_presets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

/**
 * Create a new custom fasting preset
 */
export function useCreateFastingPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name: string
      hours: number
      description?: string
      color?: string
      userId: string
    }) => {
      const preset = createCustomPreset(data.name, data.hours, data.description, data.color)
      
      const { data: result, error } = await supabase
        .from('user_fasting_presets')
        .insert({
          user_id: data.userId,
          name: preset.name,
          hours: preset.hours,
          description: preset.description,
          color: preset.color,
          bg_color: preset.bgColor,
          text_color: preset.textColor,
        })
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['user-fasting-presets', data.user_id] 
      })
    },
  })
}

/**
 * Update a custom fasting preset
 */
export function useUpdateFastingPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      id: string
      name?: string
      hours?: number
      description?: string
      color?: string
      userId: string
    }) => {
      const updateData: Partial<UserFastingPreset> = {}
      
      if (data.name !== undefined) updateData.name = data.name
      if (data.hours !== undefined) updateData.hours = data.hours
      if (data.description !== undefined) updateData.description = data.description
      if (data.color !== undefined) {
        updateData.color = data.color
        // Update color-related fields based on the color
        const colorMap: Record<string, { bg_color: string; text_color: string }> = {
          gray: { bg_color: 'bg-gray-500', text_color: 'text-white' },
          red: { bg_color: 'bg-red-500', text_color: 'text-white' },
          orange: { bg_color: 'bg-orange-500', text_color: 'text-white' },
          yellow: { bg_color: 'bg-yellow-500', text_color: 'text-white' },
          green: { bg_color: 'bg-green-500', text_color: 'text-white' },
          blue: { bg_color: 'bg-blue-500', text_color: 'text-white' },
          indigo: { bg_color: 'bg-indigo-500', text_color: 'text-white' },
          purple: { bg_color: 'bg-purple-500', text_color: 'text-white' },
          pink: { bg_color: 'bg-pink-500', text_color: 'text-white' },
        }
        const colorConfig = colorMap[data.color] || colorMap.gray
        updateData.bg_color = colorConfig.bg_color
        updateData.text_color = colorConfig.text_color
      }

      const { data: result, error } = await supabase
        .from('user_fasting_presets')
        .update(updateData)
        .eq('id', data.id)
        .eq('user_id', data.userId)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['user-fasting-presets', data.user_id] 
      })
    },
  })
}

/**
 * Delete a custom fasting preset
 */
export function useDeleteFastingPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string; userId: string }) => {
      const { error } = await supabase
        .from('user_fasting_presets')
        .delete()
        .eq('id', data.id)
        .eq('user_id', data.userId)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['user-fasting-presets', variables.userId] 
      })
    },
  })
}
