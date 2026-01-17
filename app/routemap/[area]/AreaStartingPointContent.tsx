'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StartingPointSelector } from '@/components/routemap/StartingPointSelector';
import { ManualRouteService } from '@/components/routemap/ManualRouteService';
import { KOLKATA_AREAS } from '@/components/routemap/AreaConfig';
import { AreaConfig, StartingPoint } from '@/lib/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function AreaStartingPointContent({ areaSlug }: { areaSlug: string }) {
    const router = useRouter();
    const [area, setArea] = useState<AreaConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initArea = async () => {
            try {
                // Load routes first
                await ManualRouteService.loadRoutes();

                // Find area by slug (convert slug back to ID)
                const areaId = areaSlug.replace(/-/g, '_');
                const foundArea = KOLKATA_AREAS.find(a => a.id === areaId);

                if (!foundArea) {
                    // Invalid area, redirect to routemap home
                    router.push('/routemap');
                    return;
                }

                setArea(foundArea);
            } catch (error) {
                console.error('Error loading area:', error);
                router.push('/routemap');
            } finally {
                setLoading(false);
            }
        };

        initArea();
    }, [areaSlug, router]);

    const handleStartingPointSelect = async (startingPoint: StartingPoint) => {
        if (!area) return;

        // Get routes for this starting point
        const routes = ManualRouteService.getRoutesByArea(area.id);
        const routesForStartingPoint = routes.filter(
            route => route.startingPoint.id === startingPoint.id
        );

        if (routesForStartingPoint.length === 0) {
            // No routes, stay on page (error will be shown)
            return;
        }

        if (routesForStartingPoint.length === 1) {
            // Single route: go directly to route display
            router.push(`/routemap/${areaSlug}/${routesForStartingPoint[0].id}`);
        } else {
            // Multiple routes: go to first one (or you could show selection)
            // For now, let's go to first route
            router.push(`/routemap/${areaSlug}/${routesForStartingPoint[0].id}`);
        }
    };

    const handleBack = () => {
        router.push('/routemap');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950">
                <LoadingSpinner message="Loading area..." />
            </div>
        );
    }

    if (!area) {
        return null;
    }

    return (
        <StartingPointSelector
            area={area}
            onSelectStartingPoint={handleStartingPointSelect}
            onBack={handleBack}
        />
    );
}