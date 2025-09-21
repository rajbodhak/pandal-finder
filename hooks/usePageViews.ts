import { useState, useEffect, useCallback } from 'react';
import { pageViewService } from '@/lib/services/appwritePageViewService';
import type { PageViewStats } from '@/lib/pageViews';

interface UsePageViewsOptions {
    trackOnMount?: boolean;
    debounceMs?: number;
    cooldownMinutes?: number;
}

interface UsePageViewsReturn {
    stats: PageViewStats | null;
    loading: boolean;
    error: string | null;
    trackView: () => Promise<void>;
    refreshStats: () => Promise<void>;
}

// Utility functions for unique view tracking
const generateVisitorId = (): string => {
    // Simple visitor fingerprint based on browser characteristics
    const navigator_info = navigator.userAgent + navigator.language + screen.width + screen.height;
    let hash = 0;
    for (let i = 0; i < navigator_info.length; i++) {
        const char = navigator_info.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
};

const shouldTrackView = (pageId: string, cooldownMinutes: number): boolean => {
    const now = Date.now();
    const cooldownMs = cooldownMinutes * 60 * 1000;

    // Check session storage first (prevents same-session duplicates)
    const sessionKey = `page_view_${pageId}_session`;
    if (sessionStorage.getItem(sessionKey)) {
        return false; // Already tracked in this session
    }

    // Check localStorage for time-based cooldown
    const lastViewKey = `page_view_${pageId}_last`;
    const lastViewTime = localStorage.getItem(lastViewKey);

    if (lastViewTime && (now - parseInt(lastViewTime)) < cooldownMs) {
        return false; // Still in cooldown period
    }

    return true; // OK to track
};

const markViewAsTracked = (pageId: string): void => {
    const now = Date.now();

    // Mark in session storage (prevents duplicates in same session)
    sessionStorage.setItem(`page_view_${pageId}_session`, 'true');

    // Mark in localStorage with timestamp (for cooldown)
    localStorage.setItem(`page_view_${pageId}_last`, now.toString());
};

export function usePageViews(
    pageId: string,
    options: UsePageViewsOptions = {}
): UsePageViewsReturn {
    const {
        trackOnMount = true,
        debounceMs = 2000,
        cooldownMinutes = 25
    } = options;

    const [stats, setStats] = useState<PageViewStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastTrackTime, setLastTrackTime] = useState(0);

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

    // Track a view (with unique visitor logic)
    const trackView = useCallback(async () => {
        if (!pageId) return;

        // Check if we should track this view
        if (!shouldTrackView(pageId, cooldownMinutes)) {
            // console.log('View tracking skipped: already tracked recently');
            return;
        }

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

                // Mark this view as tracked
                markViewAsTracked(pageId);

                // console.log('Page view tracked successfully for:', pageId);
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
    }, [pageId, lastTrackTime, debounceMs, cooldownMinutes, refreshStats]);

    // Initial load - get stats first, then track if needed
    useEffect(() => {
        if (!pageId) return;

        const initializePageViews = async () => {
            // First, always get current stats
            await refreshStats();

            // Then track a view if needed (with unique visitor logic)
            if (trackOnMount) {
                // Small delay to ensure stats are loaded first
                setTimeout(() => {
                    trackView();
                }, 100);
            }
        };

        initializePageViews();
    }, [pageId, refreshStats, trackView, trackOnMount]);

    return {
        stats,
        loading,
        error,
        trackView,
        refreshStats
    };
}