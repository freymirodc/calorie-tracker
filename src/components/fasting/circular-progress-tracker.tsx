'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { 
  Droplets, 
  Zap, 
  Flame, 
  Recycle, 
  Brain, 
  Heart,
  Shield,
  Sparkles
} from 'lucide-react'

interface FastingMilestone {
  hours: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

const FASTING_MILESTONES: FastingMilestone[] = [
  {
    hours: 4,
    title: 'Digestion Complete',
    description: 'Food fully digested',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    hours: 8,
    title: 'Glucose Depletion',
    description: 'Body starts using stored energy',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    hours: 12,
    title: 'Fat Burning',
    description: 'Ketosis begins',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    hours: 16,
    title: 'Autophagy Starts',
    description: 'Cellular cleanup begins',
    icon: Recycle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    hours: 18,
    title: 'Growth Hormone',
    description: 'HGH production increases',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    hours: 24,
    title: 'Peak Autophagy',
    description: 'Maximum cellular renewal',
    icon: Sparkles,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    hours: 36,
    title: 'Immune Reset',
    description: 'Immune system regeneration',
    icon: Shield,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    hours: 48,
    title: 'Stem Cell Activation',
    description: 'Enhanced regeneration',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
]

interface CircularProgressTrackerProps {
  currentHours: number
  totalHours: number
  progress: number // 0-100
  className?: string
}

export function CircularProgressTracker({ 
  currentHours, 
  totalHours, 
  progress, 
  className 
}: CircularProgressTrackerProps) {
  const size = 280
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Filter milestones that are relevant for this fast duration
  const relevantMilestones = useMemo(() => {
    return FASTING_MILESTONES.filter(milestone => milestone.hours <= totalHours)
  }, [totalHours])

  // Calculate milestone positions around the circle
  const milestonePositions = useMemo(() => {
    return relevantMilestones.map((milestone, index) => {
      const angle = (milestone.hours / totalHours) * 360 - 90 // Start from top
      const x = size / 2 + (radius - 20) * Math.cos((angle * Math.PI) / 180)
      const y = size / 2 + (radius - 20) * Math.sin((angle * Math.PI) / 180)
      const isCompleted = currentHours >= milestone.hours
      const isActive = currentHours >= milestone.hours - 1 && currentHours < milestone.hours + 1
      
      return {
        ...milestone,
        x,
        y,
        angle,
        isCompleted,
        isActive
      }
    })
  }, [relevantMilestones, currentHours, totalHours, size, radius])

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Circular Progress */}
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-500 ease-out"
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.floor(currentHours)}h
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.floor((currentHours % 1) * 60)}m
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            of {totalHours}h fast
          </div>
          <div className="text-lg font-semibold text-primary mt-2">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Milestone markers */}
        {milestonePositions.map((milestone, index) => {
          const Icon = milestone.icon
          return (
            <div
              key={milestone.hours}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: milestone.x,
                top: milestone.y,
              }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  milestone.isCompleted
                    ? `${milestone.bgColor} ${milestone.color} border-current scale-110`
                    : milestone.isActive
                    ? "bg-primary/20 text-primary border-primary scale-105 animate-pulse"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-gray-300 dark:text-gray-600">{milestone.hours}h</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Current milestone info */}
      {milestonePositions.find(m => m.isActive) && (
        <div className="mt-4 text-center max-w-xs">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {milestonePositions.find(m => m.isActive)?.title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {milestonePositions.find(m => m.isActive)?.description}
          </div>
        </div>
      )}
    </div>
  )
}
