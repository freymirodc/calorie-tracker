'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Home, Calendar, BarChart3, User } from 'lucide-react'

interface TabItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  activeIcon?: React.ComponentType<{ className?: string }>
}

const tabs: TabItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Stats',
    href: '/stats',
    icon: BarChart3,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t border-border" />
      
      {/* Tab content */}
      <div className="relative px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href))
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon 
                  className={cn(
                    "h-5 w-5 mb-1 transition-all duration-200",
                    isActive ? "scale-110" : ""
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isActive ? "font-semibold" : ""
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background/80 backdrop-blur-lg" />
    </div>
  )
}

export function BottomTabBarSpacer() {
  return <div className="h-20 md:hidden" />
}
