// lib/analytics.ts
import { track } from '@vercel/analytics';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views (for Google Analytics)
export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    }
};

// Track custom events (works with both GA4 and Vercel Analytics)
export const trackEvent = (
    eventName: string,
    properties?: Record<string, any>
) => {
    // Google Analytics (if configured)
    if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
        window.gtag('event', eventName, {
            ...properties,
            event_category: properties?.category || 'general'
        });
    }

    // Vercel Analytics (works automatically) - Using proper import
    if (typeof window !== 'undefined') {
        track(eventName, properties || {});
    }
};

// Specific tracking functions for DuggaKhoj
export const analytics = {
    // Track when user views a pandal
    pandalViewed: (pandalName: string, area: string, theme?: string) => {
        trackEvent('pandal_viewed', {
            pandal_name: pandalName,
            area: area,
            theme: theme,
            category: 'engagement'
        });
    },

    // Track when user generates a route
    routeGenerated: (area: string, pandalCount: number, startLocation?: string) => {
        trackEvent('route_generated', {
            area: area,
            pandal_count: pandalCount,
            start_location: startLocation,
            category: 'feature_usage'
        });
    },

    // Track search activity
    searchPerformed: (query: string, resultsCount: number, filters?: any) => {
        trackEvent('search_performed', {
            search_query: query.toLowerCase(), // Normalize for privacy
            results_count: resultsCount,
            has_filters: !!filters,
            category: 'search'
        });
    },

    // Track location permission requests
    locationPermission: (granted: boolean, source: string) => {
        trackEvent('location_permission', {
            granted: granted,
            source: source, // 'prompt', 'header', 'map', etc.
            category: 'permissions'
        });
    },

    // Track filter usage
    filterUsed: (filterType: string, filterValue: string) => {
        trackEvent('filter_used', {
            filter_type: filterType, // 'area', 'theme', 'rating', etc.
            filter_value: filterValue,
            category: 'interaction'
        });
    },

    // Track map interactions
    mapInteraction: (action: string, details?: any) => {
        trackEvent('map_interaction', {
            action: action, // 'zoom', 'pan', 'marker_click', etc.
            ...details,
            category: 'map'
        });
    },

    // Track user engagement time (optional)
    timeSpent: (page: string, seconds: number) => {
        if (seconds > 10) { // Only track if user spent meaningful time
            trackEvent('time_on_page', {
                page: page,
                seconds: seconds,
                category: 'engagement'
            });
        }
    }
};