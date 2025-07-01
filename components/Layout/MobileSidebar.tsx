'use client';
import React from 'react';
import { X, MapPin } from 'lucide-react';
import { FilterBar } from '@/components/FilterBar';
import { FilterOptions, PandalWithDistance } from '@/lib/types';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredPandals: PandalWithDistance[];
    visiblePandals: PandalWithDistance[];
    visibleCount: number;
    totalCount: number;
    onPandalClick: (pandal: PandalWithDistance) => void;
    onLoadMore: () => void;
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    searchQuery,
    onSearchChange,
    filteredPandals,
    visiblePandals,
    visibleCount,
    totalCount,
    onPandalClick,
    onLoadMore,
    loadMoreRef
}) => {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                    fixed top-0 left-0 h-full bg-gradient-to-b from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950
                    z-40 shadow-2xl transform transition-transform duration-300 ease-in-out
                    w-80 flex flex-col backdrop-blur-lg border-r border-white/20 dark:border-gray-700/20
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 dark:border-gray-700/20 flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        🎭 Pandals Near You
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 flex flex-col min-h-0 overflow-visible">
                    {/* Filters */}
                    <div className="p-4 border-b border-white/20 dark:border-gray-700/20 flex-shrink-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm overflow-visible z-1">
                        <FilterBar
                            filters={filters}
                            onFiltersChange={onFiltersChange}
                            onSearch={onSearchChange}
                            searchQuery={searchQuery}
                        />
                    </div>

                    {/* Stats */}
                    <div className="p-4 border-b border-white/20 dark:border-gray-700/20 flex-shrink-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm z-0">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/70 dark:to-orange-900/70 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-200/50 dark:border-orange-800/50">
                                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{filteredPandals.length}</div>
                                <div className="text-xs text-orange-700 dark:text-orange-300">Total</div>
                            </div>
                            <div className="bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-950/70 dark:to-rose-900/70 backdrop-blur-sm rounded-xl p-3 text-center border border-pink-200/50 dark:border-pink-800/50">
                                <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                                    {filteredPandals.filter(p => (p.rating ?? 0) >= 4.5).length}
                                </div>
                                <div className="text-xs text-pink-700 dark:text-pink-300">Highly Rated</div>
                            </div>
                        </div>
                    </div>

                    {/* Pandal List */}
                    <div className="flex-1 overflow-y-auto bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm">
                        <div className="p-4 space-y-3">
                            {visiblePandals.map(pandal => (
                                <div
                                    key={pandal.$id}
                                    onClick={() => {
                                        onPandalClick(pandal);
                                        onClose();
                                    }}
                                    className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl cursor-pointer hover:border-orange-300 dark:hover:border-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{pandal.name}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{pandal.area}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-yellow-500">★</span>
                                            <span className="text-xs text-gray-600 dark:text-gray-300">{pandal.rating || 'N/A'}</span>
                                        </div>
                                        {pandal.distance && (
                                            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">{pandal.distance.toFixed(1)}km</span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Load More Trigger */}
                            {visibleCount < totalCount && (
                                <div
                                    ref={loadMoreRef}
                                    className="py-6 text-center"
                                    style={{ minHeight: '80px' }}
                                >
                                    <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 dark:border-gray-700/20">
                                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm">Loading more... ({visibleCount}/{totalCount})</span>
                                    </div>

                                    <button
                                        onClick={onLoadMore}
                                        className="block mx-auto mt-3 px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
                                    >
                                        Load More ({totalCount - visibleCount} remaining)
                                    </button>
                                </div>
                            )}

                            {/* End of list */}
                            {visibleCount >= totalCount && totalCount > 10 && (
                                <div className="py-4 text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/20">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        ✨ Showing all {totalCount} pandals
                                    </span>
                                </div>
                            )}

                            {/* Empty state */}
                            {totalCount === 0 && (
                                <div className="py-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
                                    <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">No pandals found</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};