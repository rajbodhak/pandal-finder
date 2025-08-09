import { useState, useEffect, useCallback } from 'react';
import { hybridPageViewService } from '@/lib/services/hybridPageViewService';
import type { PageViewStats } from '@/lib/pageViews';

interface UsePageViewsOptions {
    trackOnMount?: boolean;
    trackOnVisibilityChange?: boolean;
    debounceMs?: number;
}

interface UsePageViewsReturn {
    stats: PageViewStats | null;
    loading: boolean;
    error: string | null;
    trackView: () => Promise<void>;
    refreshStats: () => Promise<void>;
}

export function usePageViews(
    pageId: string,
    options: UsePageViewsOptions = {}
): UsePageViewsReturn {
    const {
        trackOnMount = true,
        trackOnVisibilityChange = true,
        debounceMs = 1000
    } = options;

    const [stats, setStats] = useState<PageViewStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastTrackTime, setLastTrackTime] = useState(0);

    // Track a view
    const trackView = useCallback(async () => {
        // Debounce tracking to prevent too many requests
        const now = Date.now();
        if (now - lastTrackTime < debounceMs) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await hybridPageViewService.trackPageView(pageId);

            if (response.success && response.stats) {
                setStats(response.stats);
                setLastTrackTime(now);
            } else {
                setError(response.error || 'Failed to track page view');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Error tracking page view:', err);
        } finally {
            setLoading(false);
        }
    }, [pageId, lastTrackTime, debounceMs]);

    // Get stats without tracking
    const refreshStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await hybridPageViewService.getPageViewStats(pageId);

            if (response.success && response.stats) {
                setStats(response.stats);
            } else {
                setError(response.error || 'Failed to get page stats');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Error getting page stats:', err);
        } finally {
            setLoading(false);
        }
    }, [pageId]);

    // Track on mount
    useEffect(() => {
        if (trackOnMount && pageId) {
            trackView();
        }
    }, [pageId, trackOnMount]); // Note: not including trackView to avoid infinite loops

    // Track on visibility change (when user returns to tab)
    useEffect(() => {
        if (!trackOnVisibilityChange || typeof document === 'undefined') {
            return;
        }

        const handleVisibilityChange = () => {
            if (!document.hidden && pageId) {
                trackView();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [pageId, trackOnVisibilityChange, trackView]);

    return {
        stats,
        loading,
        error,
        trackView,
        refreshStats
    };
}

// Hook for multiple pages
export function useMultiplePageViews(pageIds: string[]) {
    const [stats, setStats] = useState<Record<string, PageViewStats>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        if (pageIds.length === 0) return;

        try {
            setLoading(true);
            setError(null);

            // For multiple pages, we'll call individual stats since hybrid service
            // doesn't have getMultiplePageStats yet
            const results: Record<string, PageViewStats> = {};

            await Promise.all(
                pageIds.map(async (pageId) => {
                    const response = await hybridPageViewService.getPageViewStats(pageId);
                    if (response.success && response.stats) {
                        results[pageId] = response.stats;
                    } else {
                        // Fallback to zero stats
                        results[pageId] = {
                            totalViews: 0,
                            todayViews: 0,
                            weekViews: 0,
                            monthViews: 0,
                            lastViewAt: null
                        };
                    }
                })
            );

            setStats(results);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Error fetching multiple page stats:', err);
        } finally {
            setLoading(false);
        }
    }, [pageIds]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    };
}