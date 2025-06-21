import { PandalWithDistance, UserLocation, FilterOptions } from './types';

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
    point1: UserLocation,
    point2: { latitude: number; longitude: number }
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1.latitude * (Math.PI / 180)) *
        Math.cos(point2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Filter and sort pandals based on criteria
export const filterAndSortPandals = (
    pandals: PandalWithDistance[],
    filters: FilterOptions
): PandalWithDistance[] => {
    let filtered = [...pandals];

    // Apply filters
    if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.maxDistance && filtered[0]?.distance !== undefined) {
        filtered = filtered.filter(p => p.distance! <= filters.maxDistance!);
    }

    if (filters.minRating) {
        filtered = filtered.filter(p => p.rating !== undefined && p.rating >= filters.minRating!);
    }


    if (filters.crowdLevel?.length) {
        filtered = filtered.filter(
            (p) => p.crowd_level !== undefined && filters.crowdLevel!.includes(p.crowd_level)
        );
    }

    // Apply sorting
    filtered.sort((a, b) => {
        switch (filters.sortBy) {
            case 'distance':
                if (!a.distance || !b.distance) return 0;
                return a.distance - b.distance;
            case 'rating':
                return (b.rating ?? 0) - (a.rating ?? 0);
            case 'popular':
                // Combine rating (default to 0 if undefined) and crowd level
                const aScore = (a.rating ?? 0) + (a.crowd_level === 'high' ? 1 : 0);
                const bScore = (b.rating ?? 0) + (b.crowd_level === 'high' ? 1 : 0);
                return bScore - aScore;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    return filtered;
};

// Format distance for display
export const formatDistance = (distance: number): string => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
};

// Generate route URL (OpenRouteService or Google Maps)
export const generateRouteUrl = (
    userLocation: UserLocation,
    destination: { latitude: number; longitude: number },
    provider: 'google' | 'openroute' = 'google'
): string => {
    if (provider === 'google') {
        return `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${destination.latitude},${destination.longitude}`;
    }

    // OpenRouteService URL (for web interface)
    return `https://maps.openrouteservice.org/directions?n1=${userLocation.latitude}&n2=${userLocation.longitude}&n3=${destination.latitude}&n4=${destination.longitude}`;
};