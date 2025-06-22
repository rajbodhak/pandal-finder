'use client';
import React from 'react';
import { Menu, Search } from 'lucide-react';

interface MobileHeaderProps {
    onToggleSidebar: () => void;
    onToggleSearch: () => void;
    showSearch: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
    onToggleSidebar,
    onToggleSearch,
    showSearch,
    searchQuery,
    onSearchChange
}) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold text-gray-900">Pandal Finder</h1>
                </div>

                <button
                    onClick={onToggleSearch}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {showSearch && (
                <div className="px-4 pb-3 border-t border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search pandals..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>
            )}
        </header>
    );
};