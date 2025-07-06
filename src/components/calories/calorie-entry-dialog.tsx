'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CalorieEntryForm } from './calorie-entry-form'
import { Plus } from 'lucide-react'

interface CalorieEntryDialogProps {
  date: Date
  initialData?: {
    calories_consumed: number
    target_calories: number
    fasting_hours?: number
    fast_start_time?: string
    fast_end_time?: string
    notes?: string
  }
  trigger?: React.ReactNode
  children?: React.ReactNode
}

export function CalorieEntryDialog({ 
  date, 
  initialData, 
  trigger,
  children 
}: CalorieEntryDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Calories
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || children || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Daily Calories</DialogTitle>
        </DialogHeader>
        <CalorieEntryForm
          date={date}
          initialData={initialData}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
