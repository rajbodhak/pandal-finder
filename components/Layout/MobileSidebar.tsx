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
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-30"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed top-0 left-0 h-full bg-white z-40 shadow-lg transform transition-transform duration-300 ease-in-out
        w-80 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900">Pandals Near You</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Filters */}
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <FilterBar
                            filters={filters}
                            onFiltersChange={onFiltersChange}
                            onSearch={onSearchChange}
                            searchQuery={searchQuery}
                        />
                    </div>

                    {/* Stats */}
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-orange-50 rounded-lg p-3 text-center">
                                <div className="text-lg font-bold text-orange-600">{filteredPandals.length}</div>
                                <div className="text-xs text-gray-600">Total</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                <div className="text-lg font-bold text-green-600">
                                    {filteredPandals.filter(p => (p.rating ?? 0) >= 4.5).length}
                                </div>
                                <div className="text-xs text-gray-600">Highly Rated</div>
                            </div>
                        </div>
                    </div>

                    {/* Pandal List */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-3">
                            {visiblePandals.map(pandal => (
                                <div
                                    key={pandal.$id}
                                    onClick={() => {
                                        onPandalClick(pandal);
                                        onClose();
                                    }}
                                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900 text-sm mb-1">{pandal.name}</h3>
                                    <p className="text-xs text-gray-600 mb-2">{pandal.area}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-yellow-600">★</span>
                                            <span className="text-xs text-gray-600">{pandal.rating || 'N/A'}</span>
                                        </div>
                                        {pandal.distance && (
                                            <span className="text-xs text-gray-500">{pandal.distance.toFixed(1)}km</span>
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
                                    <div className="inline-flex items-center gap-2 text-gray-500">
                                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm">Loading more... ({visibleCount}/{totalCount})</span>
                                    </div>

                                    <button
                                        onClick={onLoadMore}
                                        className="block mx-auto mt-3 px-4 py-2 text-sm text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                                    >
                                        Load More ({totalCount - visibleCount} remaining)
                                    </button>
                                </div>
                            )}

                            {/* End of list */}
                            {visibleCount >= totalCount && totalCount > 10 && (
                                <div className="py-4 text-center">
                                    <span className="text-xs text-gray-400">
                                        Showing all {totalCount} pandals
                                    </span>
                                </div>
                            )}

                            {/* Empty state */}
                            {totalCount === 0 && (
                                <div className="py-8 text-center">
                                    <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-sm text-gray-500">No pandals found</p>
                                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};