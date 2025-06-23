import { RoadmapPandal } from "@/lib/types";

export const useRouteOptimization = () => {
    const optimizeRouteByPreference = (
        route: RoadmapPandal[],
        preference: 'shortest' | 'highest_rated' | 'less_crowded'
    ): RoadmapPandal[] => {
        switch (preference) {
            case 'shortest':
                return [...route].sort((a, b) => a.distanceFromPrevious - b.distanceFromPrevious);
            case 'highest_rated':
                return [...route].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'less_crowded':
                const crowdWeight = { low: 1, medium: 2, high: 3 };
                return [...route].sort(
                    (a, b) => crowdWeight[a.crowd_level || 'medium'] - crowdWeight[b.crowd_level || 'medium']
                );
            default:
                return route;
        }
    };

    return { optimizeRouteByPreference };
};
