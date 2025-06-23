// hooks/useRoadmap.ts
import { useState } from 'react';
import { AreaConfig, StartingPoint, RoadmapPandal, Pandal } from '@/lib/types';
import { RoadmapService } from '@/components/roadmap/RoadmapService';

export const useRoadmap = () => {
    const [selectedArea, setSelectedArea] = useState<AreaConfig | null>(null);
    const [selectedStartingPoint, setSelectedStartingPoint] = useState<StartingPoint | null>(null);
    const [route, setRoute] = useState<RoadmapPandal[]>([]);
    const [routeStats, setRouteStats] = useState<any>(null);

    const generateRoute = (startingPoint: StartingPoint, pandals: Pandal[]) => {
        const generatedRoute = RoadmapService.generateRoute(startingPoint, pandals);
        const stats = RoadmapService.calculateRouteStats(generatedRoute);

        setRoute(generatedRoute);
        setRouteStats(stats);

        return { route: generatedRoute, stats };
    };

    const resetRoute = () => {
        setRoute([]);
        setRouteStats(null);
        setSelectedStartingPoint(null);
    };

    const resetAll = () => {
        setSelectedArea(null);
        setSelectedStartingPoint(null);
        setRoute([]);
        setRouteStats(null);
    };

    return {
        selectedArea,
        setSelectedArea,
        selectedStartingPoint,
        setSelectedStartingPoint,
        route,
        routeStats,
        generateRoute,
        resetRoute,
        resetAll
    };
};
