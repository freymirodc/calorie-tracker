'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BottomTabBar, BottomTabBarSpacer } from '@/components/mobile/bottom-tab-bar'
import { FloatingActionButton } from '@/components/mobile/floating-action-button'
import { FastingPresetDialog } from '@/components/fasting/fasting-preset-dialog'
import { WorkflowTest } from '@/components/test/workflow-test'
import { Button } from '@/components/ui/button'
import { Smartphone, Tablet, Monitor, Clock } from 'lucide-react'
import { FastingPreset } from '@/lib/fasting-utils'
import { toast } from 'sonner'

export default function MobileDemoPage() {
  const handlePresetSelect = (preset: FastingPreset) => {
    toast.success(`Selected: ${preset.name}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mobile UI Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test the mobile bottom tab bar, floating action button, and improved fasting preset cards
            </p>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                ✅ All mobile improvements implemented!
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Theme-aware colors, hidden desktop elements, improved FAB positioning
              </p>
            </div>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                🚀 CI/CD Pipeline Ready!
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                GitHub Actions workflow configured for automatic releases and Netlify deployment
              </p>
            </div>
          </div>

          {/* Device Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Mobile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bottom tab bar and floating action button visible on mobile devices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tablet className="h-5 w-5" />
                  <span>Tablet</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Responsive design adapts to tablet screen sizes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Desktop</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Traditional navigation on desktop with hidden mobile elements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Fasting Preset Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Improved Fasting Preset Cards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The fasting preset cards now have full color coverage without white borders, 
                matching the reference design exactly.
              </p>
              <FastingPresetDialog onSelectPreset={handlePresetSelect}>
                <Button>
                  <Clock className="mr-2 h-4 w-4" />
                  View Fasting Presets
                </Button>
              </FastingPresetDialog>
            </CardContent>
          </Card>

          {/* GitHub Actions Test */}
          <WorkflowTest />

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">✨ New Mobile Improvements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>Theme-aware tab colors:</strong> Selected tabs now follow your chosen theme</li>
                  <li><strong>Clean mobile header:</strong> Theme toggle and profile moved to Profile tab</li>
                  <li><strong>Improved FAB:</strong> Positioned more to the right with gradient colors</li>
                  <li><strong>Better accessibility:</strong> All mobile elements use semantic theme colors</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Mobile Features (visible on mobile only):</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Bottom tab bar with Dashboard, Calendar, Stats, and Profile tabs</li>
                  <li>Floating action button (FAB) in bottom right corner</li>
                  <li>FAB expands to show quick actions: Log Calories, Start Fast, Quick Log</li>
                  <li>Tap outside expanded FAB to close it</li>
                  <li>Change themes in Profile tab to see colors update instantly</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Fasting Preset Cards:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Full color coverage without white borders</li>
                  <li>Smooth hover animations and scaling effects</li>
                  <li>Selection indicators with checkmarks</li>
                  <li>Custom preset creation with color selection</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Navigation:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Visit /dashboard, /calendar, /stats, or /profile to test navigation</li>
                  <li>Each page includes the mobile layout wrapper</li>
                  <li>Bottom tab bar highlights the active page</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spacer for mobile bottom tab bar */}
        <BottomTabBarSpacer />
      </div>

      {/* Mobile components */}
      <BottomTabBar />
      <FloatingActionButton />
    </div>
  )
}
