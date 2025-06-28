'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme, resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                <div className="w-5 h-5" />
            </button>
        )
    }

    // Simple toggle between light and dark (no system mode)
    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    // Show sun when in dark mode (to switch to light)
    // Show moon when in light mode (to switch to dark)
    const getIcon = () => {
        return resolvedTheme === 'dark' ?
            <Sun className="w-5 h-5" /> :
            <Moon className="w-5 h-5" />
    }

    const getTitle = () => {
        return `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title={getTitle()}
        >
            {getIcon()}
        </button>
    )
}