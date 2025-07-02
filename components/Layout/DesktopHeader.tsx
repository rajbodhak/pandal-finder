'use client';
import React from 'react';
import { MapPin, Grid, List, Route } from 'lucide-react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface DesktopHeaderProps {
    filteredCount: number;
    hasUserLocation: boolean;
    viewMode: 'map' | 'grid' | 'list';
    onViewModeChange: (mode: 'map' | 'grid' | 'list') => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
    filteredCount,
    hasUserLocation,
    viewMode,
    onViewModeChange
}) => {
    return (
        <header className="bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-b border-white/20 dark:border-gray-700/20 relative z-10 transition-all">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 text-white p-3 rounded-xl shadow-lg backdrop-blur-sm transition-all transform hover:scale-105">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                DuggaKhoj
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                <span className="text-orange-600 dark:text-orange-400 font-bold">{filteredCount}</span> pandals found
                                {hasUserLocation && (
                                    <span className="text-pink-600 dark:text-pink-400 ml-1">near you</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={"/roadmap"}
                            className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            <Route className="w-5 h-5" />
                        </Link>

                        <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl p-1 shadow-lg">
                            <button
                                onClick={() => onViewModeChange('map')}
                                className={`p-2 rounded-lg transition-all transform hover:scale-105 ${viewMode === 'map'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                    }`}
                            >
                                <MapPin className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onViewModeChange('grid')}
                                className={`p-2 rounded-lg transition-all transform hover:scale-105 ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onViewModeChange('list')}
                                className={`p-2 rounded-lg transition-all transform hover:scale-105 ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
};