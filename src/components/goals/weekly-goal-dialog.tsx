'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { WeeklyGoalForm } from './weekly-goal-form'
import { Target } from 'lucide-react'

interface WeeklyGoalDialogProps {
  date: Date
  initialData?: {
    total_target_calories: number
  }
  trigger?: React.ReactNode
  children?: React.ReactNode
}

export function WeeklyGoalDialog({ 
  date, 
  initialData, 
  trigger,
  children 
}: WeeklyGoalDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  const defaultTrigger = (
    <Button variant="outline">
      <Target className="mr-2 h-4 w-4" />
      {initialData ? 'Edit Goal' : 'Set Weekly Goal'}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || children || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Weekly Calorie Goal</DialogTitle>
        </DialogHeader>
        <WeeklyGoalForm
          date={date}
          initialData={initialData}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
