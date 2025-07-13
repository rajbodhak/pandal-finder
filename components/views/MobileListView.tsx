'use client';
import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { PandalWithDistance } from '@/lib/types';
import { FilterBar } from '@/components/FilterBar';
import { FilterOptions } from '@/lib/types';

interface MobileListViewProps {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredPandals: PandalWithDistance[];
    visiblePandals: PandalWithDistance[];
    visibleCount: number;
    totalCount: number;
    onPandalClick: (pandal: PandalWithDistance) => void;
    onViewDetails: (pandal: PandalWithDistance) => void;
    onGetDirections: (pandal: PandalWithDistance) => void;
    onLoadMore: () => void;
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
    onSwitchToMap?: (selectedPandal?: PandalWithDistance) => void; // Updated to accept optional pandal
}

export const MobileListView: React.FC<MobileListViewProps> = ({
    filters,
    onFiltersChange,
    searchQuery,
    onSearchChange,
    filteredPandals,
    visiblePandals,
    visibleCount,
    totalCount,
    onLoadMore,
    loadMoreRef,
    onSwitchToMap
}) => {

    const handlePandalClick = (pandal: PandalWithDistance) => {
        if (onSwitchToMap) {
            onSwitchToMap(pandal);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-orange-50/50 via-rose-50/50 to-pink-50/50 dark:from-gray-900/50 dark:via-orange-950/50 dark:to-rose-950/50">
            {/* Filters */}
            <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 shadow-lg z-10">
                <FilterBar
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    onSearch={onSearchChange}
                    searchQuery={searchQuery}
                />
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 px-4 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/70 dark:to-orange-900/70 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-200/50 dark:border-orange-800/50">
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{totalCount}</div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">Total</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-950/70 dark:to-rose-900/70 backdrop-blur-sm rounded-xl p-3 text-center border border-pink-200/50 dark:border-pink-800/50">
                        <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                            {filteredPandals.filter(p => (p.rating ?? 0) >= 4.5).length}
                        </div>
                        <div className="text-xs text-pink-700 dark:text-pink-300">Top Rated</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950/70 dark:to-purple-900/70 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-200/50 dark:border-purple-800/50">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {filteredPandals.filter(p => p.distance && p.distance <= 2).length}
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">Nearby</div>
                    </div>
                </div>
            </div>

            {/* Pandal List */}
            <div className="flex-1 overflow-y-auto bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm">
                <div className="p-3 space-y-3">
                    {visiblePandals.map(pandal => (
                        <div
                            key={pandal.$id}
                            className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] hover:border-orange-300 dark:hover:border-orange-600"
                        >
                            {/* Pandal Header */}
                            <div
                                className="cursor-pointer"
                                onClick={() => handlePandalClick(pandal)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-tight">
                                            {pandal.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <MapPin className="w-4 h-4 text-orange-500" />
                                            <span>{pandal.area}</span>
                                        </div>
                                    </div>
                                    {pandal.distance && (
                                        <div className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 rounded-lg px-2 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/50">
                                            {pandal.distance.toFixed(1)}km
                                        </div>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {pandal.rating ? pandal.rating.toFixed(1) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Tap to view on map
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* Load More */}
                    {visibleCount < totalCount && (
                        <div
                            ref={loadMoreRef}
                            className="py-6 text-center"
                            style={{ minHeight: '80px' }}
                        >
                            <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 dark:border-gray-700/20 shadow-lg">
                                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm">Loading more... ({visibleCount}/{totalCount})</span>
                            </div>

                            <button
                                onClick={onLoadMore}
                                className="block mx-auto mt-3 px-6 py-2 text-sm bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg font-medium"
                            >
                                Load More ({totalCount - visibleCount} remaining)
                            </button>
                        </div>
                    )}

                    {/* End of list */}
                    {visibleCount >= totalCount && totalCount > 10 && (
                        <div className="py-4 text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/20">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                ✨ Showing all {totalCount} pandals
                            </span>
                        </div>
                    )}

                    {/* Empty state */}
                    {totalCount === 0 && (
                        <div className="py-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
                            <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                            </div>
                            <p className="text-base text-gray-600 dark:text-gray-300 font-medium">No pandals found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};