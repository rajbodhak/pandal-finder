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

    const loadMore = useCallback(() => {
        const newCount = Math.min(visibleCount + increment, totalItems);
        setVisibleCount(newCount);
    }, [visibleCount, increment, totalItems]);

    // Reset count when dependencies change
    useEffect(() => {
        setVisibleCount(initialCount);
    }, [...resetDeps, initialCount]);

    // Intersection observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && visibleCount < totalItems) {
                    loadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [visibleCount, totalItems, loadMore]);

    return {
        visibleCount,
        loadMore,
        loadMoreRef,
        hasMore: visibleCount < totalItems
    };
};