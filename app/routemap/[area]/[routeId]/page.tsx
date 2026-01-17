import { Metadata } from 'next';
import { Suspense } from 'react';
import RouteDisplayContent from './RouteDisplayContent';

export const metadata: Metadata = {
    title: 'Route Details - Route Planner',
    description: 'Follow your custom pandal route',
};

export default async function RouteDisplayPage({
    params,
}: {
    params: Promise<{ area: string; routeId: string }>;
}) {
    const { area, routeId } = await params;

    return (
        <Suspense fallback={<div>Loading route...</div>}>
            <RouteDisplayContent areaSlug={area} routeId={routeId} />
        </Suspense>
    );
}