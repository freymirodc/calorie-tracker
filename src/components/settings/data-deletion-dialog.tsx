'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import { 
  useDeleteAllUserData, 
  useDeleteCalorieData, 
  useDeleteFastingPresets, 
  useDeleteWeeklyGoals 
} from '@/hooks/use-data-deletion'
import { 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  Target, 
  Clock, 
  Database 
} from 'lucide-react'
import { toast } from 'sonner'

interface DataDeletionDialogProps {
  children: React.ReactNode
}

export function DataDeletionDialog({ children }: DataDeletionDialogProps) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [selectedDeletionType, setSelectedDeletionType] = useState<string | null>(null)
  const { user } = useAuth()

  const deleteAllMutation = useDeleteAllUserData()
  const deleteCaloriesMutation = useDeleteCalorieData()
  const deleteFastingMutation = useDeleteFastingPresets()
  const deleteGoalsMutation = useDeleteWeeklyGoals()

  const isLoading = deleteAllMutation.isPending || 
                   deleteCaloriesMutation.isPending || 
                   deleteFastingMutation.isPending || 
                   deleteGoalsMutation.isPending

  const handleDelete = async () => {
    if (!user?.id) {
      toast.error('User not authenticated')
      return
    }

    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    try {
      switch (selectedDeletionType) {
        case 'all':
          await deleteAllMutation.mutateAsync(user.id)
          break
        case 'calories':
          await deleteCaloriesMutation.mutateAsync(user.id)
          break
        case 'fasting':
          await deleteFastingMutation.mutateAsync(user.id)
          break
        case 'goals':
          await deleteGoalsMutation.mutateAsync(user.id)
          break
        default:
          toast.error('Please select a deletion type')
          return
      }
      
      setOpen(false)
      setConfirmText('')
      setSelectedDeletionType(null)
    } catch (error) {
      console.error('Deletion failed:', error)
    }
  }

  const deletionOptions = [
    {
      id: 'calories',
      title: 'Delete Calorie Data',
      description: 'Remove all daily calorie entries and fasting records',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      id: 'fasting',
      title: 'Delete Custom Fasting Presets',
      description: 'Remove all your custom fasting presets',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    },
    {
      id: 'goals',
      title: 'Delete Weekly Goals',
      description: 'Remove all weekly calorie goals',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      id: 'all',
      title: 'Delete All Data',
      description: 'Remove everything - calories, fasting presets, and goals',
      icon: Database,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Delete Data</span>
          </DialogTitle>
          <DialogDescription>
            Choose what data you want to delete. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Deletion Options */}
          <div className="space-y-2">
            {deletionOptions.map((option) => {
              const Icon = option.icon
              return (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDeletionType === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedDeletionType(option.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${option.bgColor}`}>
                      <Icon className={`h-4 w-4 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{option.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {selectedDeletionType && (
            <>
              <Separator />
              
              {/* Confirmation */}
              <div className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Warning: This action is permanent
                    </span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    Deleted data cannot be recovered. Please make sure you want to proceed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-text" className="text-sm font-medium">
                    Type <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">DELETE</span> to confirm
                  </Label>
                  <Input
                    id="confirm-text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE here"
                    className="font-mono"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
              setConfirmText('')
              setSelectedDeletionType(null)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!selectedDeletionType || confirmText !== 'DELETE' || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
