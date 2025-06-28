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
            <button className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400">
                <div className="w-5 h-5" />
            </button>
        )
    }

    // Simple toggle between light and dark (no system mode)
    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

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
            className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:scale-105 shadow-lg"
            title={getTitle()}
        >
            {getIcon()}
        </button>
    )
}