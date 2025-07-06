'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'default' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'dark'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'default',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'default',
  storageKey = 'calorie-tracker-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== 'undefined' && localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove('theme-default', 'theme-ocean', 'theme-forest', 'theme-sunset', 'theme-purple', 'theme-dark')

    // Add current theme class
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
      root.classList.add(`theme-${theme}`)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

// Theme configurations
export const themes = {
  default: {
    name: 'Default',
    primary: 'bg-blue-600',
    secondary: 'bg-gray-100',
    accent: 'bg-blue-50',
    description: 'Clean blue theme'
  },
  ocean: {
    name: 'Ocean',
    primary: 'bg-cyan-600',
    secondary: 'bg-cyan-50',
    accent: 'bg-cyan-100',
    description: 'Refreshing ocean blues'
  },
  forest: {
    name: 'Forest',
    primary: 'bg-green-600',
    secondary: 'bg-green-50',
    accent: 'bg-green-100',
    description: 'Natural green tones'
  },
  sunset: {
    name: 'Sunset',
    primary: 'bg-orange-600',
    secondary: 'bg-orange-50',
    accent: 'bg-orange-100',
    description: 'Warm sunset colors'
  },
  purple: {
    name: 'Purple',
    primary: 'bg-purple-600',
    secondary: 'bg-purple-50',
    accent: 'bg-purple-100',
    description: 'Royal purple theme'
  },
  dark: {
    name: 'Dark',
    primary: 'bg-gray-800',
    secondary: 'bg-gray-900',
    accent: 'bg-gray-700',
    description: 'Dark mode theme'
  }
}
