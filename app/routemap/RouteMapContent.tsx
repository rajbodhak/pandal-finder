"use client";

import { useSearchParams } from 'next/navigation';
import RouteMapPage from '@/components/routemap/RouteMapPage';

export default function RouteMapContent() {
    const searchParams = useSearchParams();
    const routeId = searchParams.get('route');

    return <RouteMapPage initialRouteId={routeId} />;
}