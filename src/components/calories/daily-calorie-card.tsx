'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CalorieEntryDialog } from './calorie-entry-dialog'
import { useDailyCalories } from '@/hooks/use-daily-calories'
import { useAuth } from '@/hooks/use-auth'
import { calculateDailyStatus, getCalorieStatusColor, formatCalories } from '@/lib/calorie-utils'
import { formatDisplayDate, formatDayName, isToday, isPast } from '@/lib/date-utils'
import { Edit, Plus, Calendar } from 'lucide-react'

interface DailyCalorieCardProps {
  date: Date
  defaultTarget?: number
  variant?: 'mobile' | 'desktop' | 'accordion'
}

export function DailyCalorieCard({ date, defaultTarget = 2000, variant = 'desktop' }: DailyCalorieCardProps) {
  const { user } = useAuth()
  const { data: dailyEntry, isLoading } = useDailyCalories(date, user?.id)

  const status = calculateDailyStatus(dailyEntry || null, dailyEntry?.target_calories || defaultTarget)
  const statusColor = getCalorieStatusColor(status.progress, status.isOverTarget)
  const dayName = formatDayName(date)
  const displayDate = formatDisplayDate(date)
  const isTodayDate = isToday(date)
  const isPastDate = isPast(date)

  if (isLoading) {
    if (variant === 'accordion') {
      return (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      )
    }

    return (
      <Card className={variant === 'mobile' ? 'p-4' : ''}>
        <div className={variant === 'mobile' ? 'flex items-center space-x-4' : ''}>
          <div className={variant === 'mobile' ? 'flex-1' : ''}>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              {variant === 'desktop' && <div className="h-8 bg-gray-200 rounded"></div>}
            </div>
          </div>
          {variant === 'mobile' && (
            <div className="animate-pulse">
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Accordion Layout (inside accordion content)
  if (variant === 'accordion') {
    return (
      <div className="space-y-4">
        {dailyEntry ? (
          <>
            {/* Calorie Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className={`text-sm font-semibold ${statusColor}`}>
                  {formatCalories(status.consumed)} / {formatCalories(status.target)}
                </span>
              </div>
              <Progress value={Math.min(status.progress, 100)} className="h-2" />

              <div className="flex justify-between text-xs text-gray-600">
                <span>
                  {status.isOverTarget
                    ? `${formatCalories(status.consumed - status.target)} over target`
                    : `${formatCalories(status.remaining)} remaining`
                  }
                </span>
                <span>{status.progress.toFixed(1)}%</span>
              </div>
            </div>

            {/* Fasting Info */}
            {(dailyEntry.fasting_hours || dailyEntry.fast_start_time || dailyEntry.fast_end_time) && (
              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Fasting Info
                  </span>
                </div>
                <div className="space-y-1 text-sm text-purple-600 dark:text-purple-400">
                  {dailyEntry.fasting_hours && (
                    <p>Duration: {dailyEntry.fasting_hours} hours</p>
                  )}
                  {dailyEntry.fast_start_time && dailyEntry.fast_end_time && (
                    <p>
                      {dailyEntry.fast_start_time} - {dailyEntry.fast_end_time}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {dailyEntry.notes && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{dailyEntry.notes}</p>
              </div>
            )}

            {/* Action Button */}
            <CalorieEntryDialog
              date={date}
              initialData={{
                calories_consumed: dailyEntry.calories_consumed,
                target_calories: dailyEntry.target_calories,
                fasting_hours: dailyEntry.fasting_hours,
                fast_start_time: dailyEntry.fast_start_time,
                fast_end_time: dailyEntry.fast_end_time,
                notes: dailyEntry.notes || undefined,
              }}
            >
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Entry
              </Button>
            </CalorieEntryDialog>
          </>
        ) : (
          <>
            {/* No Entry State */}
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                {isPastDate ? 'No entry recorded for this day' : 'Ready to log calories'}
              </p>

              <CalorieEntryDialog
                date={date}
                initialData={{
                  calories_consumed: 0,
                  target_calories: defaultTarget,
                }}
              >
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </CalorieEntryDialog>
            </div>
          </>
        )}
      </div>
    )
  }

  // Mobile Layout
  if (variant === 'mobile') {
    return (
      <Card className={`p-4 ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center justify-between">
          {/* Left: Date Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {dayName}
              </h3>
              {isTodayDate && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Today
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{displayDate}</p>

            {dailyEntry ? (
              <div className="mt-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`${statusColor} font-medium truncate`}>
                    {formatCalories(status.consumed)}
                  </span>
                  <span className="text-gray-400 flex-shrink-0">/</span>
                  <span className="text-gray-600 truncate">
                    {formatCalories(status.target)}
                  </span>
                </div>
                <Progress value={Math.min(status.progress, 100)} className="h-1.5 mt-1" />
                {status.isOverTarget && (
                  <p className="text-xs text-red-600 mt-1 truncate">
                    {formatCalories(status.consumed - status.target)} over
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                {isPastDate ? 'No entry' : 'Not logged'}
              </p>
            )}
          </div>

          {/* Right: Action Button */}
          <div className="ml-4">
            <CalorieEntryDialog
              date={date}
              initialData={dailyEntry ? {
                calories_consumed: dailyEntry.calories_consumed,
                target_calories: dailyEntry.target_calories,
                notes: dailyEntry.notes || undefined,
              } : {
                calories_consumed: 0,
                target_calories: defaultTarget,
              }}
            >
              <Button size="sm" variant={dailyEntry ? "outline" : "default"}>
                {dailyEntry ? <Edit className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              </Button>
            </CalorieEntryDialog>
          </div>
        </div>
      </Card>
    )
  }

  // Desktop Layout
  return (
    <Card className={`${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{dayName}</span>
          {isTodayDate && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Today
            </span>
          )}
        </CardTitle>
        <p className="text-xs text-gray-500">{displayDate}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {dailyEntry ? (
          <>
            {/* Calorie Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consumed</span>
                <span className={statusColor}>
                  {formatCalories(status.consumed)} / {formatCalories(status.target)}
                </span>
              </div>
              <Progress 
                value={Math.min(status.progress, 100)} 
                className="h-2"
              />
              {status.isOverTarget && (
                <p className="text-xs text-red-600">
                  {formatCalories(status.consumed - status.target)} over target
                </p>
              )}
              {!status.isOverTarget && status.remaining > 0 && (
                <p className="text-xs text-gray-600">
                  {formatCalories(status.remaining)} remaining
                </p>
              )}
            </div>

            {/* Notes */}
            {dailyEntry.notes && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                {dailyEntry.notes}
              </div>
            )}

            {/* Edit Button */}
            <CalorieEntryDialog
              date={date}
              initialData={{
                calories_consumed: dailyEntry.calories_consumed,
                target_calories: dailyEntry.target_calories,
                notes: dailyEntry.notes || undefined,
              }}
            >
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="mr-2 h-3 w-3" />
                Edit Entry
              </Button>
            </CalorieEntryDialog>
          </>
        ) : (
          <>
            {/* No Entry State */}
            <div className="text-center py-4">
              <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-3">
                {isPastDate ? 'No entry recorded' : 'Ready to log calories'}
              </p>
              
              <CalorieEntryDialog
                date={date}
                initialData={{
                  calories_consumed: 0,
                  target_calories: defaultTarget,
                }}
              >
                <Button size="sm" className="w-full">
                  <Plus className="mr-2 h-3 w-3" />
                  Add Entry
                </Button>
              </CalorieEntryDialog>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
