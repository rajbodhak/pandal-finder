import { useState, useEffect, useCallback } from 'react';
import { pageViewService } from '@/lib/services/appwritePageViewService';
import type { PageViewStats } from '@/lib/pageViews';

interface UsePageViewsOptions {
    trackOnMount?: boolean;
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
        debounceMs = 2000
    } = options;

    const [stats, setStats] = useState<PageViewStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastTrackTime, setLastTrackTime] = useState(0);
    const [hasTrackedInitial, setHasTrackedInitial] = useState(false);

    // Get stats without tracking
    const refreshStats = useCallback(async () => {
        if (!pageId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await pageViewService.getPageViewStats(pageId);

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

    // Track a view
    const trackView = useCallback(async () => {
        if (!pageId) return;

        // Debounce tracking to prevent too many requests
        const now = Date.now();
        if (now - lastTrackTime < debounceMs) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await pageViewService.trackPageView(pageId);

            if (response.success && response.stats) {
                setStats(response.stats);
                setLastTrackTime(now);
            } else {
                setError(response.error || 'Failed to track page view');
                // Still try to get stats even if tracking failed
                await refreshStats();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Error tracking page view:', err);
            // Fallback to just getting stats
            await refreshStats();
        } finally {
            setLoading(false);
        }
    }, [pageId, lastTrackTime, debounceMs, refreshStats]);

    // Initial load - get stats first, then track if needed
    useEffect(() => {
        if (!pageId) return;

        const initializePageViews = async () => {
            // First, always get current stats
            await refreshStats();

            // Then track a view if needed (only once per session)
            if (trackOnMount && !hasTrackedInitial) {
                setHasTrackedInitial(true);
                // Small delay to ensure stats are loaded first
                setTimeout(() => {
                    trackView();
                }, 100);
            }
        };

        initializePageViews();
    }, [pageId]); // Only depend on pageId to avoid infinite loops

    return {
        stats,
        loading,
        error,
        trackView,
        refreshStats
    };
}