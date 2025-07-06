'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { useUserFastingPresets, useCreateFastingPreset } from '@/hooks/use-fasting-presets'
import { DEFAULT_FASTING_PRESETS, FastingPreset, formatFastingDuration, calculateFastEndTime } from '@/lib/fasting-utils'
import { Clock, Plus, Edit, X, Check, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FastingPresetDialogProps {
  onSelectPreset: (preset: FastingPreset & { fast_start_time?: string; fast_end_time?: string }) => void
  children?: React.ReactNode
  trigger?: React.ReactNode
}

export function FastingPresetDialog({ onSelectPreset, children, trigger }: FastingPresetDialogProps) {
  const [open, setOpen] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customPreset, setCustomPreset] = useState({
    name: '',
    hours: 0,
    description: '',
    color: 'gray'
  })
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  const { user } = useAuth()
  const { data: userPresets = [] } = useUserFastingPresets(user?.id)
  const createPresetMutation = useCreateFastingPreset()

  const handlePresetSelect = (preset: FastingPreset) => {
    setSelectedPresetId(preset.id)

    // Auto-calculate fasting times based on current time
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
    const endTime = calculateFastEndTime(currentTime, preset.hours)

    // Create enhanced preset with calculated times
    const enhancedPreset = {
      ...preset,
      fast_start_time: currentTime,
      fast_end_time: endTime
    }

    onSelectPreset(enhancedPreset)
    setOpen(false)
    toast.success(`${preset.name} preset selected - Fast starts now and ends at ${endTime}`)
  }

  const handleCreateCustomPreset = async () => {
    if (!user) {
      toast.error('You must be logged in to create custom presets')
      return
    }

    if (!customPreset.name.trim() || customPreset.hours <= 0) {
      toast.error('Please provide a name and valid hours')
      return
    }

    try {
      await createPresetMutation.mutateAsync({
        ...customPreset,
        userId: user.id
      })
      
      setCustomPreset({ name: '', hours: 0, description: '', color: 'gray' })
      setShowCustomForm(false)
      toast.success('Custom preset created successfully!')
    } catch (error) {
      toast.error('Failed to create custom preset')
      console.error('Error creating preset:', error)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Clock className="mr-2 h-4 w-4" />
      Fasting Presets
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || children || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Change fast goal</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Default Presets */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DEFAULT_FASTING_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden group relative",
                    selectedPresetId === preset.id ? "ring-4 ring-white ring-opacity-80 shadow-2xl scale-105" : ""
                  )}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className={cn("p-6 text-center relative h-full", preset.bgColor, "group-hover:brightness-110")}>
                    <div className="space-y-3 relative z-10">
                      <div className={cn("text-4xl font-bold", preset.textColor)}>
                        {preset.hours}
                      </div>
                      <div className={cn("text-sm font-semibold tracking-wide", preset.textColor)}>
                        hours
                      </div>
                      <div className={cn("text-sm font-medium", preset.textColor)}>
                        {preset.name}
                      </div>
                      {preset.description && (
                        <div className={cn("text-xs opacity-90 leading-relaxed", preset.textColor)}>
                          {preset.description}
                        </div>
                      )}
                      <div className="flex justify-center pt-2">
                        <Info className={cn("h-4 w-4 opacity-70 group-hover:opacity-90 transition-opacity", preset.textColor)} />
                      </div>
                    </div>
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    {/* Selection indicator */}
                    {selectedPresetId === preset.id && (
                      <div className="absolute top-2 right-2 z-20">
                        <div className="bg-white rounded-full p-1">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Preset Option */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden group border-2 border-dashed border-gray-300 dark:border-gray-600"
                onClick={() => setShowCustomForm(true)}
              >
                <div className="p-6 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 group-hover:from-gray-100 group-hover:to-gray-200 dark:group-hover:from-gray-700 dark:group-hover:to-gray-800 transition-all duration-300 h-full">
                  <div className="space-y-3">
                    <div className="text-4xl font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      1-168
                    </div>
                    <div className="text-sm font-semibold tracking-wide text-gray-600 dark:text-gray-400">
                      hours
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-500">
                      Custom Fast
                    </div>
                    <div className="flex justify-center pt-2">
                      <Plus className="h-4 w-4 text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User's Custom Presets */}
          {userPresets.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Presets</h3>
                <Badge variant="secondary" className="text-xs">
                  {userPresets.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {userPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden group relative",
                      selectedPresetId === preset.id ? "ring-4 ring-white ring-opacity-80 shadow-2xl scale-105" : ""
                    )}
                    onClick={() => handlePresetSelect({
                      id: preset.id,
                      name: preset.name,
                      hours: preset.hours,
                      description: preset.description || '',
                      color: preset.color,
                      bgColor: preset.bg_color,
                      textColor: preset.text_color,
                      isCustom: true
                    })}
                  >
                    <div className={cn("p-6 text-center relative h-full", preset.bg_color, "group-hover:brightness-110")}>
                      <div className="space-y-3 relative z-10">
                        <div className={cn("text-4xl font-bold", preset.text_color)}>
                          {preset.hours}
                        </div>
                        <div className={cn("text-sm font-semibold tracking-wide", preset.text_color)}>
                          hours
                        </div>
                        <div className={cn("text-sm font-medium", preset.text_color)}>
                          {preset.name}
                        </div>
                        {preset.description && (
                          <div className={cn("text-xs opacity-90 leading-relaxed", preset.text_color)}>
                            {preset.description}
                          </div>
                        )}
                        <div className="flex justify-center pt-2">
                          <Edit className={cn("h-4 w-4 opacity-70 group-hover:opacity-90 transition-opacity", preset.text_color)} />
                        </div>
                      </div>
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      {/* Custom badge */}
                      <div className="absolute top-2 left-2 z-20">
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                          Custom
                        </Badge>
                      </div>
                      {/* Selection indicator */}
                      {selectedPresetId === preset.id && (
                        <div className="absolute top-2 right-2 z-20">
                          <div className="bg-white rounded-full p-1">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Preset Form */}
          {showCustomForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create Custom Preset</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preset-name">Name</Label>
                  <Input
                    id="preset-name"
                    placeholder="e.g., My Custom Fast"
                    value={customPreset.name}
                    onChange={(e) => setCustomPreset(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preset-hours">Hours</Label>
                  <Input
                    id="preset-hours"
                    type="number"
                    min="1"
                    max="168"
                    placeholder="16"
                    value={customPreset.hours || ''}
                    onChange={(e) => setCustomPreset(prev => ({ ...prev, hours: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preset-description">Description (Optional)</Label>
                <Textarea
                  id="preset-description"
                  placeholder="Brief description of this fasting method"
                  value={customPreset.description}
                  onChange={(e) => setCustomPreset(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preset-color">Color</Label>
                <Select
                  value={customPreset.color}
                  onValueChange={(value) => setCustomPreset(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="indigo">Indigo</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCustomForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCustomPreset}
                  disabled={createPresetMutation.isPending}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Create Preset
                </Button>
              </div>
            </div>
          )}

          {/* Success notification */}
          {selectedPresetId && (
            <div className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span className="font-medium">
                  {DEFAULT_FASTING_PRESETS.find(p => p.id === selectedPresetId)?.name ||
                   userPresets.find(p => p.id === selectedPresetId)?.name} has been updated
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setSelectedPresetId(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
