'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, MapPin, List, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PandalWithDistance } from '@/lib/types';
import { HighlightedText } from './HighlightedText';
import Link from 'next/link';

interface MobileHeaderProps {
    onToggleSidebar: () => void;
    onCloseSidebar: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredPandals: PandalWithDistance[];
    onSearchSelect: (pandal: PandalWithDistance) => void;
    isSidebarOpen?: boolean;
    viewMode: 'map' | 'list';
    onViewModeChange: (mode: 'map' | 'list') => void;
    title?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
    onToggleSidebar,
    onCloseSidebar,
    searchQuery,
    onSearchChange,
    filteredPandals,
    onSearchSelect,
    isSidebarOpen = false,
    viewMode,
    onViewModeChange,
}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Get current pathname to detect route
    const pathname = usePathname();
    const isHomePage = pathname === '/' || pathname === '/home';

    // Determine title - use custom title if provided, otherwise default based on page

    // Handle header click when sidebar is open
    const handleHeaderClick = (e: React.MouseEvent) => {
        if (isSidebarOpen && onCloseSidebar) {
            e.preventDefault();
            onCloseSidebar();
        }
    };

    // Handle interactive element clicks
    const handleInteractiveClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        if (!isSidebarOpen) {
            action();
        }
    };

    // Handle search button click
    const handleSearchClick = () => {
        setIsSearchOpen(true);
    };

    // Handle search close
    const handleSearchClose = () => {
        setIsSearchOpen(false);
        onSearchChange('');
    };

    // Handle search select
    const handleSearchSelectInternal = (pandal: PandalWithDistance) => {
        onSearchSelect(pandal);
        setIsSearchOpen(false);
    };

    // Auto-focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Filter pandals for search suggestions
    const searchSuggestions = searchQuery.length > 0
        ? filteredPandals.filter(pandal =>
            pandal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pandal.area.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : [];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-b border-white/20 dark:border-gray-700/20 z-40 transition-all duration-300 ${isSidebarOpen ? 'blur-sm brightness-75 cursor-pointer' : ''
                    }`}
                onClick={handleHeaderClick}
            >
                {/* Main header row with menu, title, search, and view toggle */}
                <div className="flex items-center px-4 py-3">
                    <button
                        onClick={(e) => handleInteractiveClick(e, onToggleSidebar)}
                        className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 dark:from-orange-600 dark:to-pink-600 dark:hover:from-orange-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div
                        className="flex-1 ml-4"
                    >
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent font-baloo2">
                            <Link
                                href={'/'}
                            >
                                DuggaKhoj
                            </Link>
                        </h1>
                    </div>

                    {/* Only show search and view toggle on home page */}
                    {isHomePage && (
                        <>
                            {/* Search Button */}
                            <button
                                onClick={(e) => handleInteractiveClick(e, handleSearchClick)}
                                className={`p-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 dark:from-orange-600 dark:to-pink-600 dark:hover:from-orange-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm mr-3 ${isSidebarOpen ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* View Mode Toggle */}
                            <div className={`flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl p-1 shadow-lg ${isSidebarOpen ? 'pointer-events-none opacity-50' : ''}`}>
                                <button
                                    onClick={(e) => handleInteractiveClick(e, () => onViewModeChange('map'))}
                                    className={`flex items-center justify-center p-2 rounded-lg transition-all transform hover:scale-105 ${viewMode === 'map'
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                        }`}
                                >
                                    <MapPin className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => handleInteractiveClick(e, () => onViewModeChange('list'))}
                                    className={`flex items-center justify-center p-2 rounded-lg transition-all transform hover:scale-105 ${viewMode === 'list'
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:text-orange-600 dark:hover:text-orange-400'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Search Overlay - Only show on home page */}
            {isHomePage && isSearchOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/20 mx-4 w-full max-w-md">
                        {/* Search Header */}
                        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-orange-300/80 w-4 h-4 z-10" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search pandals..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-white/20 dark:border-gray-700/20 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 dark:focus:border-orange-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-orange-400/70 dark:placeholder-orange-300/70 transition-all"
                                    autoComplete="off"
                                />
                            </div>
                            <button
                                onClick={handleSearchClose}
                                className="ml-3 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="max-h-96 overflow-y-auto">
                            {searchQuery.length > 0 ? (
                                searchSuggestions.length > 0 ? (
                                    <div className="p-2">
                                        {searchSuggestions.map((pandal, index) => (
                                            <button
                                                key={`${pandal.$id}-${index}`}
                                                onClick={() => handleSearchSelectInternal(pandal)}
                                                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    <HighlightedText
                                                        text={pandal.name}
                                                        highlight={searchQuery}
                                                        highlightClassName="text-orange-600 dark:text-orange-400 font-bold"
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <HighlightedText
                                                        text={pandal.area}
                                                        highlight={searchQuery}
                                                        highlightClassName="text-orange-600 dark:text-orange-400 font-semibold"
                                                    />
                                                </div>
                                                {pandal.distance && (
                                                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                                        {pandal.distance.toFixed(1)} km away
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                        No pandals found matching "{searchQuery}"
                                    </div>
                                )
                            ) : (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    Start typing to search for pandals...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};