'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DailyCalorieCard } from './daily-calorie-card'
import { WeeklyGoalDialog } from '@/components/goals/weekly-goal-dialog'
import { useDailyCaloriesRange } from '@/hooks/use-daily-calories'
import { useWeeklyGoal } from '@/hooks/use-weekly-goals'
import { useAuth } from '@/hooks/use-auth'
import { calculateWeeklyStats, formatCalories } from '@/lib/calorie-utils'
import { getWeekDates, getWeekStart, formatDisplayDate, isToday } from '@/lib/date-utils'
import { Progress } from '@/components/ui/progress'
import { Target, TrendingUp, Calendar, Settings, ChevronDown } from 'lucide-react'

interface WeeklyOverviewProps {
  currentDate?: Date
}

export function WeeklyOverview({ currentDate = new Date() }: WeeklyOverviewProps) {
  const { user } = useAuth()
  const weekStart = getWeekStart(currentDate)
  const weekDates = getWeekDates(currentDate)
  const weekEnd = weekDates[weekDates.length - 1]

  const { data: dailyEntries = [], isLoading: dailyLoading } = useDailyCaloriesRange(
    weekStart,
    weekEnd,
    user?.id
  )
  
  const { data: weeklyGoal, isLoading: goalLoading } = useWeeklyGoal(currentDate, user?.id)

  const weeklyStats = calculateWeeklyStats(dailyEntries, weeklyGoal || null, currentDate)

  if (dailyLoading || goalLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Week of {formatDisplayDate(weekStart)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {formatDisplayDate(weekStart)} - {formatDisplayDate(weekEnd)}
          </p>
        </div>

        <WeeklyGoalDialog
          date={currentDate}
          initialData={weeklyGoal ? {
            total_target_calories: weeklyGoal.total_target_calories
          } : undefined}
        >
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            {weeklyGoal ? 'Edit Goal' : 'Set Goal'}
          </Button>
        </WeeklyGoalDialog>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCalories(weeklyStats.totalConsumed)} / {formatCalories(weeklyStats.totalTarget)}
            </div>
            <Progress value={weeklyStats.weekProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {weeklyStats.weekProgress.toFixed(1)}% of weekly goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Calories</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCalories(weeklyStats.remaining)}
            </div>
            <p className="text-xs text-muted-foreground">
              {weeklyStats.remainingDays} days remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Recommendation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCalories(weeklyStats.dailyRecommendation)}
            </div>
            <p className="text-xs text-muted-foreground">
              {weeklyStats.isOnTrack ? 'On track' : 'Behind target'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Daily Breakdown</h3>

        {/* Mobile: Accordion */}
        <div className="block lg:hidden">
          <Accordion type="single" collapsible defaultValue={isToday(new Date()) ? `day-${new Date().toISOString().split('T')[0]}` : undefined}>
            {weekDates.map((date) => {
              const dateKey = date.toISOString().split('T')[0]
              const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
              const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              const isTodayDate = isToday(date)

              // Find the daily entry for this date
              const dailyEntry = dailyEntries.find(entry => entry.date === dateKey)
              const defaultTarget = weeklyGoal ? Math.round(weeklyGoal.total_target_calories / 7) : 2000

              // Calculate status for visual indicator
              const status = dailyEntry ? {
                consumed: dailyEntry.calories_consumed,
                target: dailyEntry.target_calories,
                isOverTarget: dailyEntry.calories_consumed > dailyEntry.target_calories,
                progress: (dailyEntry.calories_consumed / dailyEntry.target_calories) * 100
              } : null

              return (
                <AccordionItem
                  key={dateKey}
                  value={`day-${dateKey}`}
                  className={`border rounded-lg mb-2 ${isTodayDate ? 'border-blue-300 bg-blue-50/30 dark:bg-blue-950/20' : ''}`}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center space-x-3">
                        {/* Status Indicator Dot */}
                        <div className={`w-3 h-3 rounded-full ${
                          !dailyEntry
                            ? 'bg-gray-300'
                            : status?.isOverTarget
                              ? 'bg-red-500'
                              : status?.progress && status.progress >= 90
                                ? 'bg-green-500'
                                : 'bg-yellow-500'
                        }`} />

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-left">{dayName}</span>
                            {isTodayDate && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Today
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 text-left">{dayDate}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {dailyEntry ? (
                          <div className="text-sm">
                            <div className={`font-medium truncate ${
                              status?.isOverTarget ? 'text-red-600' : 'text-gray-900 dark:text-white'
                            }`}>
                              {formatCalories(dailyEntry.calories_consumed)}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              of {formatCalories(dailyEntry.target_calories)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Not logged
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <DailyCalorieCard
                      date={date}
                      defaultTarget={defaultTarget}
                      variant="accordion"
                    />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-4">
          {weekDates.map((date) => (
            <DailyCalorieCard
              key={date.toISOString()}
              date={date}
              defaultTarget={weeklyGoal ? Math.round(weeklyGoal.total_target_calories / 7) : 2000}
              variant="desktop"
            />
          ))}
        </div>
      </div>

      {/* Weekly Goal Status */}
      {!weeklyGoal && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-center">Set Your Weekly Goal</CardTitle>
            <CardDescription className="text-center">
              Define your weekly calorie target to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              A typical weekly goal is around 14,000 calories (2,000 per day)
            </p>
            <WeeklyGoalDialog date={currentDate}>
              <Button>
                <Target className="mr-2 h-4 w-4" />
                Set Weekly Goal
              </Button>
            </WeeklyGoalDialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
