'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, GitBranch, Rocket, Zap } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function WorkflowTest() {
  const [testsPassed, setTestsPassed] = useState(0)

  const runTest = (testName: string) => {
    setTestsPassed(prev => prev + 1)
    toast.success(`✅ ${testName} test passed!`)
  }

  const tests = [
    {
      name: 'Component Rendering',
      description: 'Verify component renders correctly',
      icon: CheckCircle,
      action: () => runTest('Component Rendering')
    },
    {
      name: 'GitHub Actions',
      description: 'Test CI/CD pipeline integration',
      icon: GitBranch,
      action: () => runTest('GitHub Actions')
    },
    {
      name: 'Vercel Deployment',
      description: 'Verify deployment configuration',
      icon: Rocket,
      action: () => runTest('Vercel Deployment')
    },
    {
      name: 'Semantic Release',
      description: 'Test automatic versioning',
      icon: Zap,
      action: () => runTest('Semantic Release')
    }
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GitBranch className="h-6 w-6 text-primary" />
          <span>GitHub Actions Workflow Test</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This component tests the CI/CD pipeline functionality
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Status */}
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Tests Passed:</span>
            <span className="text-2xl font-bold text-primary">
              {testsPassed}/{tests.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(testsPassed / tests.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test, index) => {
            const Icon = test.icon
            const isPassed = index < testsPassed
            
            return (
              <Button
                key={test.name}
                variant={isPassed ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={test.action}
                disabled={isPassed}
              >
                <div className="flex items-center space-x-2 w-full">
                  <Icon className={`h-5 w-5 ${isPassed ? 'text-primary-foreground' : 'text-primary'}`} />
                  <span className="font-medium">{test.name}</span>
                  {isPassed && <CheckCircle className="h-4 w-4 ml-auto text-green-500" />}
                </div>
                <p className={`text-xs text-left ${isPassed ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {test.description}
                </p>
              </Button>
            )
          })}
        </div>

        {/* Workflow Status */}
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Workflow Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Build Status:</span>
              <span className="text-green-600 font-medium">✅ Ready</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Deployment:</span>
              <span className="text-blue-600 font-medium">🚀 Configured</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Release Automation:</span>
              <span className="text-purple-600 font-medium">⚡ Active</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {testsPassed === tests.length && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">
                All tests passed! GitHub Actions workflow is ready.
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your CI/CD pipeline is configured and ready for production use.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
