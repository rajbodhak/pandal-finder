'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="px-3 py-2 lg:px-4 lg:py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400">
                <div className="w-5 h-5 lg:hidden" />
                <div className="hidden lg:flex items-center gap-2">
                    <div className="w-4 h-4" />
                    <span className="font-medium">Loading...</span>
                </div>
            </button>
        )
    }

    // Simple toggle between light and dark (no system mode)
    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    const getIcon = () => {
        return resolvedTheme === 'dark' ?
            <Sun className="w-5 h-5 lg:w-4 lg:h-4" /> :
            <Moon className="w-5 h-5 lg:w-4 lg:h-4" />
    }

    const getTitle = () => {
        return `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`
    }

    const getThemeText = () => {
        return resolvedTheme === 'dark' ? 'Light' : 'Dark'
    }

    return (
        <button
            onClick={toggleTheme}
            className="px-3 py-2 lg:px-4 lg:py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            title={getTitle()}
        >
            {/* Mobile and tablet - show only icon */}
            <span className="lg:hidden">
                {getIcon()}
            </span>

            {/* Desktop - show icon and text */}
            <span className="hidden lg:flex items-center gap-2">
                {getIcon()}
                <span className="font-medium">{getThemeText()}</span>
            </span>
        </button>
    )
}