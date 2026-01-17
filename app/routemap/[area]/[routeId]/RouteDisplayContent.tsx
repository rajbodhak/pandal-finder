'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ManualRouteService } from '@/components/routemap/ManualRouteService';
import { databaseService } from '@/lib/database';
import { ManualRoute, Pandal } from '@/lib/types';
import RouteDisplay from '@/components/routemap/RouteDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function RouteDisplayContent({
    areaSlug,
    routeId
}: {
    areaSlug: string;
    routeId: string;
}) {
    const router = useRouter();
    const [route, setRoute] = useState<ManualRoute | null>(null);
    const [pandals, setPandals] = useState<Pandal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRoute = async () => {
            try {
                setLoading(true);
                await ManualRouteService.loadRoutes();

                // Get route by ID
                const foundRoute = ManualRouteService.getRouteById(routeId);

                if (!foundRoute) {
                    // Route not found, redirect back to area page
                    router.push(`/routemap/${areaSlug}`);
                    return;
                }

                setRoute(foundRoute);

                // Fetch pandals for this route
                const routeData = await databaseService.getPandalsForRoute(routeId);
                setPandals(routeData.pandals);

            } catch (err) {
                console.error('Error loading route:', err);
                setError('Failed to load route. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadRoute();
    }, [routeId, areaSlug, router]);

    const handleBack = () => {
        // Go back to starting point selection for this area
        router.push(`/routemap/${areaSlug}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950">
                <LoadingSpinner message="Loading route details..." />
            </div>
        );
    }

    if (error || !route) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 flex items-center justify-center">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md">
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {error || 'Route not found'}
                    </h2>
                    <button
                        onClick={() => router.push(`/routemap/${areaSlug}`)}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Back to Starting Points
                    </button>
                </div>
            </div>
        );
    }

    return (
        <RouteDisplay
            route={route}
            pandals={pandals}
            onBack={handleBack}
        />
    );
}