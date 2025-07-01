import { useState, useMemo, useCallback } from 'react';
import { FilterOptions, PandalWithDistance, UserLocation } from '@/lib/types';

export const usePandalFilters = (
    allPandals: PandalWithDistance[],
    userLocation: UserLocation | null
) => {
    const [filters, setFilters] = useState<FilterOptions>({
        sortBy: 'distance',
        area: [],
        category: '',
        maxDistance: undefined,
        minRating: undefined,
        crowdLevel: []
    });
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPandals = useMemo(() => {

        let filtered = [...allPandals];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(pandal =>
                pandal.name.toLowerCase().includes(query) ||
                pandal.address.toLowerCase().includes(query) ||
                pandal.description!.toLowerCase().includes(query) ||
                pandal.area.toLowerCase().includes(query) ||
                pandal.special_features?.some(feature =>
                    feature.toLowerCase().includes(query)
                )
            );
        }

        // Apply area filter
        if (filters.area && filters.area.length > 0) {
            filtered = filtered.filter(pandal => filters.area!.includes(pandal.area));
        }

        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter(pandal => pandal.category === filters.category);
        }

        // Apply distance filter
        if (filters.maxDistance && userLocation) {
            filtered = filtered.filter(pandal =>
                pandal.distance !== undefined && pandal.distance <= filters.maxDistance!
            );
        }

        // Apply rating filter
        if (filters.minRating) {
            filtered = filtered.filter(pandal =>
                pandal.rating !== undefined && pandal.rating >= filters.minRating!
            );
        }

        // Apply crowd level filter
        if (filters.crowdLevel && filters.crowdLevel.length > 0) {
            filtered = filtered.filter(pandal =>
                pandal.crowd_level && filters.crowdLevel!.includes(pandal.crowd_level)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'distance':
                    if (!a.distance && !b.distance) return 0;
                    if (!a.distance) return 1;
                    if (!b.distance) return -1;
                    return a.distance - b.distance;

                case 'rating':
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;

                case 'name':
                    return a.name.localeCompare(b.name);

                case 'popular':
                    return (b.rating || 0) - (a.rating || 0);

                default:
                    return 0;
            }
        });

        return filtered;
    }, [allPandals, searchQuery, filters, userLocation]);

    const updateFilters = useCallback((newFilters: FilterOptions) => {
        setFilters(newFilters);
    }, []);

    const updateSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    return {
        filters,
        searchQuery,
        filteredPandals,
        updateFilters,
        updateSearchQuery
    };
};