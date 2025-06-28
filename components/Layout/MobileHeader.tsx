'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Route, MapPin } from 'lucide-react';
import Link from 'next/link';
import { PandalWithDistance } from '@/lib/types';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface MobileHeaderProps {
    onToggleSidebar: () => void;
    onToggleSearch: () => void;
    showSearch: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredPandals: PandalWithDistance[];
    onSearchSelect: (pandal: PandalWithDistance) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
    onToggleSidebar,
    onToggleSearch,
    showSearch,
    searchQuery,
    onSearchChange,
    filteredPandals,
    onSearchSelect
}) => {
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Get search suggestions (top 5 matches)
    const searchSuggestions = React.useMemo(() => {
        if (!searchQuery.trim()) return [];

        return filteredPandals
            .filter(pandal =>
                pandal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pandal.area?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5);
    }, [searchQuery, filteredPandals]);

    // Handle search input change
    const handleSearchChange = (query: string) => {
        onSearchChange(query);
        setShowSearchDropdown(query.trim().length > 0);
    };

    // Handle search selection
    const handleSelectPandal = (pandal: PandalWithDistance) => {
        onSearchSelect(pandal);
        setShowSearchDropdown(false);
        onSearchChange(''); // Clear search
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown when search is hidden
    useEffect(() => {
        if (!showSearch) {
            setShowSearchDropdown(false);
        }
    }, [showSearch]);

    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-b border-white/20 dark:border-gray-700/20 z-40 transition-all">
            <div className="flex items-center px-4 py-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 dark:from-orange-600 dark:to-pink-600 dark:hover:from-orange-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex-1 ml-4">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        🎭 Pandal Finder
                    </h1>
                </div>

                <ThemeSwitcher />

                <Link
                    href={"/roadmap"}
                    className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:scale-105 shadow-lg mx-2"
                >
                    <Route className="w-5 h-5" />
                </Link>

                <button
                    onClick={onToggleSearch}
                    className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:scale-105 shadow-lg"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {showSearch && (
                <div className="px-4 pb-3 border-t border-white/20 dark:border-gray-700/20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm transition-all" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 dark:text-orange-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search pandals..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-white/20 dark:border-gray-700/20 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 dark:focus:border-orange-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-orange-400/70 dark:placeholder-orange-300/70 transition-all shadow-lg"
                            autoComplete="off"
                        />

                        {/* Search Dropdown */}
                        {showSearchDropdown && searchSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 transition-all">
                                {searchSuggestions.map((pandal) => (
                                    <button
                                        key={pandal.$id}
                                        onClick={() => handleSelectPandal(pandal)}
                                        className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 border-b border-white/20 dark:border-gray-700/20 last:border-b-0 transition-all transform hover:scale-[1.02]"
                                    >
                                        <div className="flex items-start">
                                            <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/70 dark:to-pink-950/70 rounded-lg p-1 mr-3 mt-1">
                                                <MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {pandal.name}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                                    {pandal.area && `${pandal.area} • `}
                                                    {pandal.distance ? (
                                                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                                                            {pandal.distance.toFixed(1)}km away
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 dark:text-gray-400">Distance unknown</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                                                        {(pandal.rating ?? 0).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* No results message */}
                        {showSearchDropdown && searchQuery.trim() && searchSuggestions.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-xl shadow-2xl z-50 transition-all">
                                <div className="px-4 py-6 text-center">
                                    <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                        <Search className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">No pandals found</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        matching "<span className="text-orange-600 dark:text-orange-400 font-medium">{searchQuery}</span>"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};