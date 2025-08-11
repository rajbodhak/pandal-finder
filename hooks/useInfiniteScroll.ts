import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
    totalItems: number;
    initialCount: number;
    increment: number;
    resetDeps?: any[];
}

export const useInfiniteScroll = ({
    totalItems,
    initialCount,
    increment,
    resetDeps = []
}: UseInfiniteScrollProps) => {
    const [visibleCount, setVisibleCount] = useState(initialCount);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isLoadingRef = useRef(false);

    // Manual load more function
    const loadMore = useCallback(() => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        setVisibleCount(prevCount => {
            const newCount = Math.min(prevCount + increment, totalItems);
            setTimeout(() => {
                isLoadingRef.current = false;
            }, 100);
            return newCount;
        });
    }, [increment, totalItems]);

    // Reset count when dependencies change
    useEffect(() => {
        setVisibleCount(initialCount);
        isLoadingRef.current = false;
    }, [...resetDeps, initialCount]);

    // Set up intersection observer - Fixed dependencies
    useEffect(() => {
        if (!loadMoreRef.current) return;

        // Disconnect existing observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer with more aggressive settings
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isLoadingRef.current) {

                        isLoadingRef.current = true;

                        // Use functional update to avoid stale closure
                        setVisibleCount(currentCount => {
                            if (currentCount < totalItems) {
                                const newCount = Math.min(currentCount + increment, totalItems);

                                // Reset loading flag after a short delay
                                requestAnimationFrame(() => {
                                    setTimeout(() => {
                                        isLoadingRef.current = false;
                                    }, 50);
                                });

                                return newCount;
                            }

                            isLoadingRef.current = false;
                            return currentCount;
                        });
                    }
                });
            },
            {
                threshold: [0, 0.1, 0.5],
                rootMargin: '100px 0px',
                root: null
            }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);

            // Check if element is already in view on initial load
            setTimeout(() => {
                if (loadMoreRef.current && observerRef.current) {
                    const rect = loadMoreRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    // Check if element is already visible
                    if (rect.top <= windowHeight + 100 && rect.bottom >= -100) {
                        if (!isLoadingRef.current && visibleCount < totalItems) {
                            loadMore();
                        }
                    }
                }
            }, 100);
        }

        // Cleanup function
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [totalItems, increment, visibleCount]);

    // Update observer when totalItems changes without recreating it
    useEffect(() => {
        // Reset loading state when totalItems changes
        isLoadingRef.current = false;

        // Force re-check intersection after content changes
        if (observerRef.current && loadMoreRef.current) {
            // Temporarily disconnect and reconnect to refresh intersection state
            observerRef.current.unobserve(loadMoreRef.current);
            setTimeout(() => {
                if (observerRef.current && loadMoreRef.current) {
                    observerRef.current.observe(loadMoreRef.current);
                }
            }, 10);
        }
    }, [totalItems]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const hasMore = visibleCount < totalItems;

    return {
        visibleCount,
        loadMore,
        loadMoreRef,
        hasMore
    };
};