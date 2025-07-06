'use client'

import { useState } from 'react'
import { FastingPresetDialog } from '@/components/fasting/fasting-preset-dialog'
import { QuickFastingWidget } from '@/components/fasting/quick-fasting-widget'
import { Button } from '@/components/ui/button'
import { FastingPreset } from '@/lib/fasting-utils'

export default function TestFastingPage() {
  const [selectedPreset, setSelectedPreset] = useState<FastingPreset | null>(null)

  const handlePresetSelect = (preset: FastingPreset) => {
    setSelectedPreset(preset)
    console.log('Selected preset:', preset)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Fasting Preset Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fasting Preset Dialog</h2>
        <FastingPresetDialog onSelectPreset={handlePresetSelect}>
          <Button>Open Fasting Presets</Button>
        </FastingPresetDialog>
        
        {selectedPreset && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium">Selected Preset:</h3>
            <p>{selectedPreset.name} - {selectedPreset.hours} hours</p>
            <p className="text-sm text-gray-600">{selectedPreset.description}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Fasting Widget</h2>
        <div className="max-w-md">
          <QuickFastingWidget />
        </div>
      </div>
    </div>
  )
}
