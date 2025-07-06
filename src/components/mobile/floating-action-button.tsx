'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CalorieEntryDialog } from '@/components/calories/calorie-entry-dialog'
import { FastingPresetDialog } from '@/components/fasting/fasting-preset-dialog'
import { cn } from '@/lib/utils'
import { Plus, X, Utensils, Clock, Zap } from 'lucide-react'
import { FastingPreset } from '@/lib/fasting-utils'
import { toast } from 'sonner'

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  action: () => void
}

export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeDialog, setActiveDialog] = useState<'calories' | 'fasting' | null>(null)

  const handleFastingPresetSelect = (preset: FastingPreset & { fast_start_time?: string; fast_end_time?: string }) => {
    toast.success(`${preset.name} preset selected - Fast times automatically set`)
    setIsExpanded(false)
    setActiveDialog(null)
  }

  const handleDialogClose = () => {
    setActiveDialog(null)
  }

  const quickActions: QuickAction[] = [
    {
      id: 'calories',
      label: 'Log Calories',
      icon: Utensils,
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      action: () => {
        setActiveDialog('calories')
        setIsExpanded(false)
      }
    },
    {
      id: 'fasting',
      label: 'Start Fast',
      icon: Clock,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      action: () => {
        setActiveDialog('fasting')
        setIsExpanded(false)
      }
    },
    {
      id: 'quick-log',
      label: 'Quick Log',
      icon: Zap,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      action: () => {
        // Quick log with default values
        setActiveDialog('calories')
        setIsExpanded(false)
      }
    }
  ]

  return (
    <>
      <div className="fixed bottom-24 right-2 z-40 md:hidden">
        {/* Quick action buttons */}
        <div className={cn(
          "flex flex-col space-y-3 mb-4 transition-all duration-300 transform",
          isExpanded ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}>
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className={cn(
                  "transition-all duration-300 transform",
                  isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                )}
                style={{ 
                  transitionDelay: isExpanded ? `${index * 50}ms` : `${(quickActions.length - index - 1) * 50}ms` 
                }}
              >
                <Button
                  onClick={action.action}
                  className={cn(
                    "h-12 px-4 rounded-full shadow-lg text-white border-0 transition-all duration-200 hover:scale-105",
                    action.color
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </div>
            )
          })}
        </div>

        {/* Main FAB */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground border-0 transition-all duration-300 hover:scale-110 hover:shadow-2xl",
            isExpanded ? "rotate-45" : "rotate-0"
          )}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </Button>

        {/* Backdrop */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10 transition-opacity duration-300"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>

      {/* Dialogs */}
      {activeDialog === 'calories' && (
        <CalorieEntryDialog
          date={new Date()}
          initialData={{
            calories_consumed: 0,
            target_calories: 2000,
          }}
        >
          <button className="hidden" onClick={handleDialogClose} />
        </CalorieEntryDialog>
      )}

      {activeDialog === 'fasting' && (
        <FastingPresetDialog onSelectPreset={handleFastingPresetSelect}>
          <button className="hidden" onClick={handleDialogClose} />
        </FastingPresetDialog>
      )}
    </>
  )
}
