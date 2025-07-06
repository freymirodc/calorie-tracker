'use client'

import { useAuth } from '@/hooks/use-auth'
import { WeeklyOverview } from '@/components/calories/weekly-overview'
import { CalorieEntryDialog } from '@/components/calories/calorie-entry-dialog'
import { QuickStats } from '@/components/calories/quick-stats'
import { QuickFastingWidget } from '@/components/fasting/quick-fasting-widget'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here&apos;s your calorie tracking overview for this week.
          </p>
        </div>

        {/* Quick Add Button */}
        <CalorieEntryDialog date={new Date()}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Today&apos;s Calories
          </Button>
        </CalorieEntryDialog>
      </div>

      {/* Quick Stats and Fasting Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickStats />
        </div>
        <div>
          <QuickFastingWidget />
        </div>
      </div>

      {/* Weekly Overview */}
      <WeeklyOverview />
    </div>
  )
}
