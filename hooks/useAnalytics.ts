import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, analytics } from '@/lib/analytics';

export const useAnalytics = () => {
    const pathname = usePathname();
    const startTimeRef = useRef<number>(Date.now());

    // Track page views
    useEffect(() => {
        trackPageView(pathname);
        startTimeRef.current = Date.now();

        // Track time spent when leaving page
        return () => {
            const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
            analytics.timeSpent(pathname, timeSpent);
        };
    }, [pathname]);

    return analytics;
};