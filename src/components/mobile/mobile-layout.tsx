'use client'

import { BottomTabBar, BottomTabBarSpacer } from './bottom-tab-bar'
import { FloatingActionButton } from './floating-action-button'

interface MobileLayoutProps {
  children: React.ReactNode
  showFAB?: boolean
  showBottomTabs?: boolean
}

export function MobileLayout({ 
  children, 
  showFAB = true, 
  showBottomTabs = true 
}: MobileLayoutProps) {
  return (
    <>
      {/* Main content */}
      <div className="min-h-screen">
        {children}
        {/* Spacer for bottom tab bar on mobile */}
        {showBottomTabs && <BottomTabBarSpacer />}
      </div>

      {/* Mobile-only components */}
      {showBottomTabs && <BottomTabBar />}
      {showFAB && <FloatingActionButton />}
    </>
  )
}
