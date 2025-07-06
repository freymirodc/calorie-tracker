'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FastingPresetDialog } from './fasting-preset-dialog'
import { CalorieEntryDialog } from '@/components/calories/calorie-entry-dialog'
import { CircularProgressTracker } from './circular-progress-tracker'
import { useAuth } from '@/hooks/use-auth'
import { useDailyCalories } from '@/hooks/use-daily-calories'
import { FastingPreset, getFastingStatus, formatFastingDuration } from '@/lib/fasting-utils'
import { Clock, Play, Pause, Timer } from 'lucide-react'
import { toast } from 'sonner'

export function QuickFastingWidget() {
  const [selectedPreset, setSelectedPreset] = useState<FastingPreset | null>(null)
  const { user } = useAuth()
  const today = new Date()
  const { data: todayEntry } = useDailyCalories(today, user?.id)

  const handlePresetSelect = (preset: FastingPreset & { fast_start_time?: string; fast_end_time?: string }) => {
    setSelectedPreset(preset)
    toast.success(`${preset.name} selected - Fast times automatically calculated`)
  }

  const fastingStatus = todayEntry?.fast_start_time && todayEntry?.fast_end_time
    ? getFastingStatus(todayEntry.fast_start_time, todayEntry.fast_end_time)
    : null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Clock className="h-5 w-5 text-purple-600" />
          <span>Quick Fasting</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Fast Status with Circular Progress */}
        {fastingStatus && fastingStatus.isFasting && todayEntry?.fasting_hours && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Currently Fasting
              </span>
              <Timer className="h-4 w-4 text-purple-600" />
            </div>

            {/* Circular Progress Tracker */}
            <div className="flex justify-center">
              <CircularProgressTracker
                currentHours={todayEntry.fasting_hours - (fastingStatus.timeRemaining / 60)}
                totalHours={todayEntry.fasting_hours}
                progress={fastingStatus.progress}
                className="scale-75"
              />
            </div>

            <div className="text-center">
              <div className="text-xs text-purple-600 dark:text-purple-400">
                {Math.floor(fastingStatus.timeRemaining / 60)}h {fastingStatus.timeRemaining % 60}m remaining
              </div>
            </div>
          </div>
        )}

        {/* Today's Fasting Info */}
        {todayEntry?.fasting_hours && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>Today's fast:</span>
              <span className="font-medium">
                {formatFastingDuration(todayEntry.fasting_hours)}
              </span>
            </div>
            {todayEntry.fast_start_time && todayEntry.fast_end_time && (
              <div className="flex items-center justify-between text-xs mt-1">
                <span>Window:</span>
                <span>{todayEntry.fast_start_time} - {todayEntry.fast_end_time}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <FastingPresetDialog onSelectPreset={handlePresetSelect}>
            <Button variant="outline" className="w-full" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Choose Fasting Goal
            </Button>
          </FastingPresetDialog>

          <CalorieEntryDialog 
            date={today}
            initialData={selectedPreset ? {
              calories_consumed: todayEntry?.calories_consumed || 0,
              target_calories: todayEntry?.target_calories || 2000,
              fasting_hours: selectedPreset.hours,
              fast_start_time: selectedPreset.fast_start_time || todayEntry?.fast_start_time || '',
              fast_end_time: selectedPreset.fast_end_time || todayEntry?.fast_end_time || '',
              notes: todayEntry?.notes || '',
            } : {
              calories_consumed: todayEntry?.calories_consumed || 0,
              target_calories: todayEntry?.target_calories || 2000,
              fasting_hours: todayEntry?.fasting_hours || 0,
              fast_start_time: todayEntry?.fast_start_time || '',
              fast_end_time: todayEntry?.fast_end_time || '',
              notes: todayEntry?.notes || '',
            }}
          >
            <Button className="w-full" size="sm">
              <Play className="mr-2 h-4 w-4" />
              {todayEntry ? 'Update' : 'Start'} Today's Fast
            </Button>
          </CalorieEntryDialog>
        </div>

        {/* Selected Preset Preview */}
        {selectedPreset && (
          <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selected: {selectedPreset.name}
            </div>
            <div className="text-xs text-gray-500">
              {formatFastingDuration(selectedPreset.hours)} • {selectedPreset.description}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
