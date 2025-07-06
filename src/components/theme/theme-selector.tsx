'use client'

import { useTheme, themes, Theme } from '@/lib/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Palette, Check } from 'lucide-react'

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Palette className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(themes).map(([key, themeConfig]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as Theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div 
                className={`w-4 h-4 rounded-full ${themeConfig.primary}`}
                style={{
                  background: key === 'dark' 
                    ? '#374151' 
                    : key === 'ocean' 
                      ? '#0891b2' 
                      : key === 'forest' 
                        ? '#059669' 
                        : key === 'sunset' 
                          ? '#ea580c' 
                          : key === 'purple' 
                            ? '#9333ea' 
                            : '#2563eb'
                }}
              />
              <div>
                <div className="font-medium">{themeConfig.name}</div>
                <div className="text-xs text-gray-500">{themeConfig.description}</div>
              </div>
            </div>
            {theme === key && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
