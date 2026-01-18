import { useState, useEffect } from 'react';
import { Pandal, PandalWithDistance, UserLocation } from '@/lib/types';
import { databaseService } from '@/lib/database';
import { calculateDistance } from '@/lib/utils';

export const usePandals = (userLocation: UserLocation | null) => {
    const [allPandals, setAllPandals] = useState<PandalWithDistance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPandals = async () => {
        try {
            setLoading(true);
            const data = await databaseService.getAllPandals();

            const pandalsWithDistance: PandalWithDistance[] = data.map((pandal: Pandal) => ({
                ...pandal,
                distance: userLocation && pandal.latitude !== undefined && pandal.longitude !== undefined
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Recalculate distances when userLocation changes
    useEffect(() => {
        if (userLocation && allPandals.length > 0) {
            const updatedPandals = allPandals.map((pandal: PandalWithDistance) => ({
                ...pandal,
                distance: pandal.latitude !== undefined && pandal.longitude !== undefined
                    ? calculateDistance(userLocation, { latitude: pandal.latitude, longitude: pandal.longitude })
                    : undefined
            }));
            setAllPandals(updatedPandals);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation]);

    return {
        pandals: allPandals,
        loading,
        error,
        refetch: fetchPandals
    };
};