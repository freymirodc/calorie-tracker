'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useWeeklyGoals } from '@/hooks/use-weekly-goals'
import { WeeklyGoalDialog } from '@/components/goals/weekly-goal-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDisplayDate, getWeekStart, getWeekEnd } from '@/lib/date-utils'
import { formatCalories } from '@/lib/calorie-utils'
import { Target, Plus, Calendar, TrendingUp, Edit } from 'lucide-react'

export default function GoalsPage() {
  const { user } = useAuth()
  const { data: weeklyGoals = [], isLoading } = useWeeklyGoals(user?.id)
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date())

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentWeekGoal = weeklyGoals.find(goal => {
    const goalWeekStart = new Date(goal.week_start)
    const currentWeekStart = getWeekStart(selectedWeek)
    return goalWeekStart.getTime() === currentWeekStart.getTime()
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Goals & Targets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your weekly calorie goals and track your progress over time.
          </p>
        </div>
        
        <WeeklyGoalDialog date={selectedWeek}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </WeeklyGoalDialog>
      </div>

      {/* Current Week Goal */}
      <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle>Current Week Goal</CardTitle>
              <Badge variant="secondary">Active</Badge>
            </div>
            {currentWeekGoal && (
              <WeeklyGoalDialog
                date={selectedWeek}
                initialData={{
                  total_target_calories: currentWeekGoal.total_target_calories
                }}
              >
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
              </WeeklyGoalDialog>
            )}
          </div>
          <CardDescription>
            {formatDisplayDate(getWeekStart(selectedWeek))} - {formatDisplayDate(getWeekEnd(selectedWeek))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentWeekGoal ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCalories(currentWeekGoal.total_target_calories)}
                  </div>
                  <p className="text-sm text-gray-600">Weekly Target</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCalories(Math.round(currentWeekGoal.total_target_calories / 7))}
                  </div>
                  <p className="text-sm text-gray-600">Daily Average</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(currentWeekGoal.total_target_calories / 7 / 3)}
                  </div>
                  <p className="text-sm text-gray-600">Calories per Meal</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Goal Set for This Week
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Set a weekly calorie goal to start tracking your progress and get personalized recommendations.
              </p>
              <WeeklyGoalDialog date={selectedWeek}>
                <Button>
                  <Target className="mr-2 h-4 w-4" />
                  Set Weekly Goal
                </Button>
              </WeeklyGoalDialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Goal History</h2>
        {weeklyGoals.length > 0 ? (
          <div className="grid gap-4">
            {weeklyGoals.map((goal) => {
              const weekStart = new Date(goal.week_start)
              const weekEnd = getWeekEnd(weekStart)
              const isCurrentWeek = getWeekStart(new Date()).getTime() === weekStart.getTime()
              
              return (
                <Card key={goal.id} className={isCurrentWeek ? 'ring-1 ring-blue-500' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <CardTitle className="text-base">
                          {formatDisplayDate(weekStart)} - {formatDisplayDate(weekEnd)}
                        </CardTitle>
                        {isCurrentWeek && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <WeeklyGoalDialog
                        date={weekStart}
                        initialData={{
                          total_target_calories: goal.total_target_calories
                        }}
                      >
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </WeeklyGoalDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {formatCalories(goal.total_target_calories)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCalories(Math.round(goal.total_target_calories / 7))} per day
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Created {new Date(goal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Goals Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by setting your first weekly calorie goal to begin tracking your nutrition journey.
              </p>
              <WeeklyGoalDialog date={new Date()}>
                <Button>
                  <Target className="mr-2 h-4 w-4" />
                  Create Your First Goal
                </Button>
              </WeeklyGoalDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
