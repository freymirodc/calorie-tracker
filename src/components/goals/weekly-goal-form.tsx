'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUpsertWeeklyGoal } from '@/hooks/use-weekly-goals'
import { useAuth } from '@/hooks/use-auth'
import { formatDisplayDate, getWeekStart, getWeekEnd } from '@/lib/date-utils'
import { Loader2, Target } from 'lucide-react'

const weeklyGoalSchema = z.object({
  total_target_calories: z.number().min(1000, 'Weekly target must be at least 1,000 calories').max(50000, 'Weekly target must be less than 50,000 calories'),
})

type WeeklyGoalForm = z.infer<typeof weeklyGoalSchema>

interface WeeklyGoalFormProps {
  date: Date
  initialData?: {
    total_target_calories: number
  }
  onSuccess?: () => void
}

export function WeeklyGoalForm({ date, initialData, onSuccess }: WeeklyGoalFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const upsertMutation = useUpsertWeeklyGoal()

  const weekStart = getWeekStart(date)
  const weekEnd = getWeekEnd(date)

  const form = useForm<WeeklyGoalForm>({
    resolver: zodResolver(weeklyGoalSchema),
    defaultValues: {
      total_target_calories: initialData?.total_target_calories || 14000, // 2000 * 7 days
    },
  })

  const watchedValue = form.watch('total_target_calories')
  const dailyAverage = Math.round(watchedValue / 7)

  const onSubmit = async (data: WeeklyGoalForm) => {
    if (!user) {
      toast.error('You must be logged in to set goals')
      return
    }

    setIsLoading(true)
    
    try {
      await upsertMutation.mutateAsync({
        date,
        total_target_calories: data.total_target_calories,
        userId: user.id,
      })
      
      toast.success('Weekly goal saved successfully!')
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to save weekly goal')
      console.error('Error saving weekly goal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Set Weekly Goal</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatDisplayDate(weekStart)} - {formatDisplayDate(weekEnd)}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="total_target_calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekly Calorie Target</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter weekly calorie target"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  This equals approximately {dailyAverage.toLocaleString()} calories per day
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quick Presets */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Presets:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.setValue('total_target_calories', 12250)} // 1750/day
                className="text-xs"
              >
                Weight Loss
                <br />
                <span className="text-gray-500">12,250 cal</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.setValue('total_target_calories', 14000)} // 2000/day
                className="text-xs"
              >
                Maintenance
                <br />
                <span className="text-gray-500">14,000 cal</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.setValue('total_target_calories', 15750)} // 2250/day
                className="text-xs"
              >
                Muscle Gain
                <br />
                <span className="text-gray-500">15,750 cal</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.setValue('total_target_calories', 17500)} // 2500/day
                className="text-xs"
              >
                Bulk
                <br />
                <span className="text-gray-500">17,500 cal</span>
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Goal' : 'Set Goal'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
