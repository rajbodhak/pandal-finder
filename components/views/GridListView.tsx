'use client';
import React from 'react';
import { MapPin } from 'lucide-react';
import { PandalCard } from '@/components/PandalCard';
import { PandalWithDistance } from '@/lib/types';

interface GridListViewProps {
    viewMode: 'grid' | 'list';
    visiblePandals: PandalWithDistance[];
    totalCount: number;
    visibleCount: number;
    hasMore: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
    onGetDirections: (pandal: PandalWithDistance) => void;
    onViewDetails: (pandal: PandalWithDistance) => void;
    onLoadMore?: () => void;
}

export const GridListView: React.FC<GridListViewProps> = ({
    viewMode,
    visiblePandals,
    totalCount,
    visibleCount,
    hasMore,
    loadMoreRef,
    onGetDirections,
    onViewDetails,
    onLoadMore
}) => {
    return (
        <div className="container mx-auto px-4">
            <div className={`
        ${viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
      `}>
                {visiblePandals.length > 0 ? (
                    visiblePandals.map(pandal => (
                        <div key={pandal.$id || pandal.$id} className={viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}>
                            <PandalCard
                                pandal={pandal}
                                onGetDirections={onGetDirections}
                                onViewDetails={onViewDetails}
                                isMobile={false}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 mb-4">
                            <MapPin className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pandals found</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Try adjusting your filters or search terms to find more pandals.
                        </p>
                    </div>
                )}

                {/* Load More Section - Updated to match mobile behavior */}
                {hasMore && visibleCount < totalCount && (
                    <div className={`${viewMode === 'grid' ? 'col-span-full' : ''} py-8 text-center`}>
                        {/* Invisible trigger element for intersection observer */}
                        <div ref={loadMoreRef} className="h-1 w-full" />

                        {/* Load More Button - same style as mobile */}
                        <div className="mt-4">
                            <button
                                onClick={onLoadMore}
                                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Load More ({totalCount - visibleCount} remaining)
                            </button>
                        </div>
                    </div>
                )}

                {/* End message when all items are loaded */}
                {!hasMore && totalCount > 0 && visibleCount >= totalCount && (
                    <div className={`${viewMode === 'grid' ? 'col-span-full' : ''} py-8 text-center`}>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            You've seen all {totalCount} pandals!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};