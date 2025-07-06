'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useDailyCaloriesRange } from '@/hooks/use-daily-calories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCalories } from '@/lib/calorie-utils'
import { formatDisplayDate, getWeekStart } from '@/lib/date-utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Calendar, Target, Award } from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')
  
  // Get data for the last 30 days
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - (timeRange === 'week' ? 7 : 30))
  
  const { data: dailyEntries = [], isLoading } = useDailyCaloriesRange(
    startDate,
    endDate,
    user?.id
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const chartData = dailyEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    consumed: entry.calories_consumed,
    target: entry.target_calories,
    difference: entry.calories_consumed - entry.target_calories,
  }))

  // Calculate statistics
  const totalConsumed = dailyEntries.reduce((sum, entry) => sum + entry.calories_consumed, 0)
  const totalTarget = dailyEntries.reduce((sum, entry) => sum + entry.target_calories, 0)
  const averageDaily = dailyEntries.length > 0 ? Math.round(totalConsumed / dailyEntries.length) : 0
  const daysOnTarget = dailyEntries.filter(entry => 
    Math.abs(entry.calories_consumed - entry.target_calories) <= entry.target_calories * 0.1
  ).length
  const accuracy = dailyEntries.length > 0 ? Math.round((daysOnTarget / dailyEntries.length) * 100) : 0

  // Pie chart data for goal achievement
  const pieData = [
    { name: 'On Target', value: daysOnTarget, color: '#10b981' },
    { name: 'Off Target', value: dailyEntries.length - daysOnTarget, color: '#ef4444' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your progress and discover patterns in your calorie intake.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Last 7 Days
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consumed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCalories(totalConsumed)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCalories(averageDaily)} per day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              {daysOnTarget} of {dailyEntries.length} days on target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logged Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysOnTarget > 0 ? daysOnTarget : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Days within target range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Intake Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Calorie Intake</CardTitle>
            <CardDescription>
              Your daily consumption vs targets over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [formatCalories(Number(value)), name === 'consumed' ? 'Consumed' : 'Target']}
                />
                <Bar dataKey="target" fill="#e5e7eb" name="target" />
                <Bar dataKey="consumed" fill="#3b82f6" name="consumed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goal Achievement */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Achievement</CardTitle>
            <CardDescription>
              How often you hit your calorie targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} days`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">On Target</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Off Target</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {dailyEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Consistency Score
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You've been {accuracy >= 70 ? 'very consistent' : accuracy >= 50 ? 'moderately consistent' : 'inconsistent'} with your calorie goals. 
                  {accuracy < 70 && ' Try to stay within 10% of your daily target for better results.'}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Average Performance
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your daily average is {formatCalories(averageDaily)} calories. 
                  {averageDaily > 0 && totalTarget > 0 && 
                    (averageDaily > totalTarget / dailyEntries.length 
                      ? ' Consider reducing portion sizes or choosing lower-calorie options.'
                      : ' Great job staying within your targets!')
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
