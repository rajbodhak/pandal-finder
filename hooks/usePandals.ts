// 1. UPDATED usePandals Hook - Fetch all data once, filter on client side
import { useState, useEffect } from 'react';
import { Pandal, PandalWithDistance, UserLocation, FilterOptions } from '@/lib/types';
import { databaseService } from '@/lib/database';
import { calculateDistance } from '@/lib/utils';

export const usePandals = (userLocation: UserLocation | null) => {
    const [allPandals, setAllPandals] = useState<PandalWithDistance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPandals = async () => {
        try {
            setLoading(true);
            console.log('Fetching all pandals from database...');
            const data = await databaseService.getAllPandals();
            console.log('Fetched pandals count:', data.length);

            const pandalsWithDistance: PandalWithDistance[] = data.map(pandal => ({
                ...pandal,
                distance: userLocation
                    ? calculateDistance(userLocation, { latitude: pandal.latitude, longitude: pandal.longitude })
                    : undefined
            }));

            setAllPandals(pandalsWithDistance);
        } catch (err) {
            console.error('Error fetching pandals:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch pandals');
        } finally {
            setLoading(false);
        }
    };

    // Only fetch when userLocation changes, not filters
    useEffect(() => {
        fetchPandals();
    }, [userLocation]);

    // Recalculate distances when userLocation changes
    useEffect(() => {
        if (userLocation && allPandals.length > 0) {
            console.log('Recalculating distances for', allPandals.length, 'pandals');
            const updatedPandals = allPandals.map(pandal => ({
                ...pandal,
                distance: calculateDistance(userLocation, { latitude: pandal.latitude, longitude: pandal.longitude })
            }));
            setAllPandals(updatedPandals);
        }
    }, [userLocation]);

    return {
        pandals: allPandals,
        loading,
        error,
        refetch: fetchPandals
    };
};