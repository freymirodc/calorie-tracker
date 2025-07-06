'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Target, Calendar } from 'lucide-react'

export default function StatsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Analyze your calorie tracking patterns
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Weekly Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Coming soon!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Goal Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Coming soon!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Monthly Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Detailed Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-gray-500">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Advanced Statistics Coming Soon</h3>
            <p className="text-sm max-w-md mx-auto">
              This section will include detailed charts and analytics about your calorie intake, 
              fasting patterns, and goal achievement over time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
