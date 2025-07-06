'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDailyCalories } from '@/hooks/use-daily-calories'
import { useWeeklyGoal } from '@/hooks/use-weekly-goals'
import { useAuth } from '@/hooks/use-auth'
import { calculateDailyStatus, formatCalories } from '@/lib/calorie-utils'
import { CalendarDays, Target, TrendingUp } from 'lucide-react'

export function QuickStats() {
  const { user } = useAuth()
  const today = new Date()
  
  const { data: todayEntry } = useDailyCalories(today, user?.id)
  const { data: weeklyGoal } = useWeeklyGoal(today, user?.id)
  
  const dailyTarget = todayEntry?.target_calories || (weeklyGoal ? Math.round(weeklyGoal.total_target_calories / 7) : 2000)
  const status = calculateDailyStatus(todayEntry, dailyTarget)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Calories</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCalories(status.consumed)} / {formatCalories(status.target)}
          </div>
          <p className="text-xs text-muted-foreground">
            {status.remaining > 0 
              ? `${formatCalories(status.remaining)} remaining`
              : `${formatCalories(status.consumed - status.target)} over target`
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {weeklyGoal ? formatCalories(weeklyGoal.total_target_calories) : 'Not set'}
          </div>
          <p className="text-xs text-muted-foreground">
            {weeklyGoal ? 'Weekly target' : 'Set your weekly goal to get started'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {status.progress.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {status.isOverTarget ? 'Over target' : 'Of daily goal'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
