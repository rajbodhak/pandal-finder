'use client';
import React from 'react';
import { MapPin, Grid, List, Route, Info, User, Heart } from 'lucide-react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
        <>
            <header className="fixed top-0 left-0 right-0 bg-rose-200/70 dark:bg-rose-950/90 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/20 z-30 transition-all duration-300">
                <div className="container mx-auto px-6 py-2">
                    <div className="flex items-center justify-between">
                        {/* Left side - Logo and info */}
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-4 group">
                                <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 text-white p-1.5 rounded-xl shadow-xl backdrop-blur-sm transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                                    <Image
                                        src="/logo.svg"
                                        alt="DuggaKhoj Logo"
                                        width={30}
                                        height={30}
                                        className="rounded-md"
                                    />
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

                        {/* Right side - Navigation Links, View controls and theme switcher */}
                        <div className="flex items-center gap-6">
                            {/* Navigation Links (Desktop and Tablet) */}
                            <div className="hidden md:flex items-center gap-6">
                                {/* Home Link (show on all pages except main page) */}
                                {!isMainPage && (
                                    <Link
                                        href="/"
                                        className="group relative px-2 py-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        <span className="hidden lg:inline font-medium">Home</span>
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                    </Link>
                                )}

                                {/* Routemap Link (show on all pages except routemap page) */}
                                {!isRoutemapPage && (
                                    <Link
                                        href="/routemap"
                                        className="group relative px-2 py-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <Route className="w-4 h-4" />
                                        <span className="hidden lg:inline font-medium">Route Map</span>
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                    </Link>
                                )}

                                {/* About Link (show on all pages except about page) */}
                                {!isAboutPage && (
                                    <Link
                                        href="/about"
                                        className="group relative px-2 py-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <Info className="w-4 h-4" />
                                        <span className="hidden lg:inline font-medium">About</span>
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                    </Link>
                                )}
                            </div>

                            {/* View Mode Controls (only on main page) */}
                            {isMainPage && showViewControls && viewMode && onViewModeChange && (
                                <div className="flex items-center bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 backdrop-blur-sm rounded-xl p-1 border border-orange-200/50 dark:border-orange-700/30">
                                    <button
                                        onClick={() => onViewModeChange('map')}
                                        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${viewMode === 'map'
                                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                            : 'text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 dark:hover:from-orange-900/50 dark:hover:to-pink-900/50 hover:text-orange-700 dark:hover:text-orange-300'
                                            }`}
                                    >
                                        <MapPin className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onViewModeChange('grid')}
                                        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${viewMode === 'grid'
                                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                            : 'text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 dark:hover:from-orange-900/50 dark:hover:to-pink-900/50 hover:text-orange-700 dark:hover:text-orange-300'
                                            }`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onViewModeChange('list')}
                                        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${viewMode === 'list'
                                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                            : 'text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 dark:hover:from-orange-900/50 dark:hover:to-pink-900/50 hover:text-orange-700 dark:hover:text-orange-300'
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
            {/* Spacer div to push content below the fixed header */}
            <div className="h-15"></div>
        </>
    );
};