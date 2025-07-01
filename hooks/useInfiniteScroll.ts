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

    // Use functional update to avoid stale closure
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

    // Separate the intersection observer logic and use refs for current values
    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                // FIXED: Check hasMore condition here with current state
                if (entry.isIntersecting) {
                    setVisibleCount(currentCount => {
                        if (currentCount < totalItems) {
                            const newCount = Math.min(currentCount + increment, totalItems);
                            return newCount;
                        }
                        return currentCount;
                    });
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
                root: null
            }
        );

        const currentRef = loadMoreRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [totalItems, increment]);

    const hasMore = visibleCount < totalItems;

    // Debug log for current state
    useEffect(() => {
    }, [visibleCount, totalItems, hasMore]);

    return {
        visibleCount,
        loadMore,
        loadMoreRef,
        hasMore
    };
};