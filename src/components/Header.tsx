'use client'

import { Menu, Sun, Moon, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface HeaderProps {
  onMenuClick: () => void
  className?: string
  children?: React.ReactNode
}

export default function Header({ onMenuClick, className = '', children }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className={`bg-white/60 glass-effect border-b border-black/5 ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/80 shadow-sm rounded-xl flex items-center justify-center lg:hidden">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 lg:hidden">
              Copilot
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {children || (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-xl hover:bg-black/5 transition-all duration-200 hover:scale-105 transform"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
