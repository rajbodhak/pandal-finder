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

    // Manual load more function
    const loadMore = useCallback(() => {
        setVisibleCount(prevCount => {
            const newCount = Math.min(prevCount + increment, totalItems);
            return newCount;
        });
    }, [increment, totalItems]);

    // Reset count when dependencies change
    useEffect(() => {
        setVisibleCount(initialCount);
    }, [...resetDeps, initialCount]);

    // Set up intersection observer
    useEffect(() => {
        const currentRef = loadMoreRef.current;

        if (!currentRef) return;

        // Disconnect existing observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer with improved logic
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (entry.isIntersecting) {
                    // Use functional update with current state check
                    setVisibleCount(currentCount => {
                        if (currentCount < totalItems) {
                            const newCount = Math.min(currentCount + increment, totalItems);
                            console.log(`Loading more: ${currentCount} -> ${newCount} of ${totalItems}`);
                            return newCount;
                        }
                        return currentCount;
                    });
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px', // Load earlier for better UX
                root: null
            }
        );

        observerRef.current.observe(currentRef);

        // Cleanup function
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [totalItems, increment]); // Only depend on totalItems and increment

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