'use client';
import React from 'react';
import { MapPin, Grid, List, Route, Info, User, Heart } from 'lucide-react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { usePathname } from 'next/navigation';

interface DesktopHeaderProps {
    // For main page
    filteredCount?: number;
    hasUserLocation?: boolean;
    viewMode?: 'map' | 'grid' | 'list';
    onViewModeChange?: (mode: 'map' | 'grid' | 'list') => void;
    // For other pages
    pageTitle?: string;
    showViewControls?: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
    filteredCount,
    hasUserLocation,
    viewMode,
    onViewModeChange,
    pageTitle,
    showViewControls = true
}) => {
    const pathname = usePathname();
    const isMainPage = pathname === '/';
    const isAboutPage = pathname === '/about';
    const isRoutemapPage = pathname === '/routemap';

    return (
        <header className="bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-b border-white/20 dark:border-gray-700/20 relative z-10 transition-all duration-300">
            <div className="container mx-auto px-6 py-2">
                <div className="flex items-center justify-between">
                    {/* Left side - Logo and info */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 text-white p-3 rounded-xl shadow-xl backdrop-blur-sm transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                                <Heart className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                    DuggaKhoj
                                </h1>
                                {isMainPage && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        <span className="text-orange-600 dark:text-orange-400 font-bold">{filteredCount || 0}</span> pandals found
                                        {hasUserLocation && (
                                            <span className="text-pink-600 dark:text-pink-400 ml-1">near you</span>
                                        )}
                                    </p>
                                )}
                                {pageTitle && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        {pageTitle}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Center - Navigation Links (Desktop and Tablet) */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* About Link */}
                        <Link
                            href="/about"
                            className={`px-4 py-2 lg:px-6 lg:py-3 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 ${isAboutPage
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl'
                                : 'bg-white/80 dark:bg-gray-800/80 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-xl'
                                }`}
                        >
                            <Info className="w-4 h-4" />
                            <span className="hidden lg:inline font-medium">About</span>
                        </Link>

                        {/* Routemap Link */}
                        <Link
                            href="/routemap"
                            className={`px-4 py-2 lg:px-6 lg:py-3 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 ${isRoutemapPage
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl'
                                : 'bg-white/80 dark:bg-gray-800/80 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-xl'
                                }`}
                        >
                            <Route className="w-4 h-4" />
                            <span className="hidden lg:inline font-medium">Route Map</span>
                        </Link>

                        {/* Home Link (only show when not on main page) */}
                        {!isMainPage && (
                            <Link
                                href="/"
                                className="px-4 py-2 lg:px-6 lg:py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <MapPin className="w-4 h-4" />
                                <span className="hidden lg:inline font-medium">Home</span>
                            </Link>
                        )}
                    </div>

                    {/* Right side - View controls and theme switcher */}
                    <div className="flex items-center gap-4">
                        {/* View Mode Controls (only on main page) */}
                        {isMainPage && showViewControls && viewMode && onViewModeChange && (
                            <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl p-1 shadow-lg">
                                <button
                                    onClick={() => onViewModeChange('map')}
                                    className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${viewMode === 'map'
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                        }`}
                                >
                                    <MapPin className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onViewModeChange('grid')}
                                    className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onViewModeChange('list')}
                                    className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${viewMode === 'list'
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Theme Switcher */}
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
};