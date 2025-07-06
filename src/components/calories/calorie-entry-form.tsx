'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FastingPresetDialog } from '@/components/fasting/fasting-preset-dialog'
import { useUpsertDailyCalories } from '@/hooks/use-daily-calories'
import { useAuth } from '@/hooks/use-auth'
import { FastingPreset, calculateFastEndTime, calculateFastStartTime } from '@/lib/fasting-utils'
import { Loader2, Clock } from 'lucide-react'

const calorieEntrySchema = z.object({
  calories_consumed: z.number().min(0, 'Calories must be 0 or greater').max(10000, 'Calories must be less than 10,000'),
  target_calories: z.number().min(0, 'Target calories must be 0 or greater').max(10000, 'Target calories must be less than 10,000'),
  fasting_hours: z.number().min(0, 'Fasting hours must be 0 or greater').max(48, 'Fasting hours must be less than 48').optional(),
  fast_start_time: z.string().optional(),
  fast_end_time: z.string().optional(),
  notes: z.string().optional(),
})

type CalorieEntryForm = z.infer<typeof calorieEntrySchema>

interface CalorieEntryFormProps {
  date: Date
  initialData?: {
    calories_consumed: number
    target_calories: number
    fasting_hours?: number
    fast_start_time?: string
    fast_end_time?: string
    notes?: string
  }
  onSuccess?: () => void
}

export function CalorieEntryForm({ date, initialData, onSuccess }: CalorieEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const upsertMutation = useUpsertDailyCalories()

  const form = useForm<CalorieEntryForm>({
    resolver: zodResolver(calorieEntrySchema),
    defaultValues: {
      calories_consumed: initialData?.calories_consumed || 0,
      target_calories: initialData?.target_calories || 2000,
      fasting_hours: initialData?.fasting_hours || 0,
      fast_start_time: initialData?.fast_start_time || '',
      fast_end_time: initialData?.fast_end_time || '',
      notes: initialData?.notes || '',
    },
  })

  const handleFastingPresetSelect = (preset: FastingPreset) => {
    form.setValue('fasting_hours', preset.hours)

    // If we have a start time, calculate end time
    const currentStartTime = form.getValues('fast_start_time')
    if (currentStartTime) {
      const endTime = calculateFastEndTime(currentStartTime, preset.hours)
      form.setValue('fast_end_time', endTime)
    }

    toast.success(`${preset.name} preset applied`)
  }

  const onSubmit = async (data: CalorieEntryForm) => {
    if (!user) {
      toast.error('You must be logged in to save calories')
      return
    }

    setIsLoading(true)

    try {
      await upsertMutation.mutateAsync({
        date,
        calories_consumed: data.calories_consumed,
        target_calories: data.target_calories,
        fasting_hours: data.fasting_hours,
        fast_start_time: data.fast_start_time,
        fast_end_time: data.fast_end_time,
        notes: data.notes,
        userId: user.id,
      })

      toast.success('Calories saved successfully!')
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to save calories')
      console.error('Error saving calories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Log Calories</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format(date, 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="calories_consumed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories Consumed</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter calories consumed"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Target</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter daily calorie target"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fasting Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Fasting Information (Optional)
              </h3>
              <FastingPresetDialog onSelectPreset={handleFastingPresetSelect}>
                <Button type="button" variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Presets
                </Button>
              </FastingPresetDialog>
            </div>

            <FormField
              control={form.control}
              name="fasting_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fasting Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="Enter fasting hours"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fast_start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fast Start (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fast_end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fast End (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any notes about your meals or day..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Calories
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
