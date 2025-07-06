'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { DataDeletionDialog } from '@/components/settings/data-deletion-dialog'
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Palette, Trash2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <p className="text-gray-900 dark:text-white">
              {user?.email || 'Not logged in'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Member since
            </label>
            <p className="text-gray-900 dark:text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-gray-500">Choose your preferred theme</p>
                  </div>
                </div>
                <ThemeSelector />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">General Settings</p>
                    <p className="text-sm text-gray-500">App preferences and defaults</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-gray-500">Manage your notification preferences</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Privacy & Security</p>
                    <p className="text-sm text-gray-500">Data and privacy settings</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Review
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Help & Support</p>
                    <p className="text-sm text-gray-500">Get help and contact support</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Get Help
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <Trash2 className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400">Delete Data</p>
                    <p className="text-sm text-red-600 dark:text-red-500">Remove your data permanently</p>
                  </div>
                </div>
                <DataDeletionDialog>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                    Manage
                  </Button>
                </DataDeletionDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sign Out */}
      <Card>
        <CardContent className="p-4">
          <Button 
            onClick={handleSignOut}
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
