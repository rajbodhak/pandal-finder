import { useState, useEffect } from 'react';
import { Pandal, PandalWithDistance, UserLocation, FilterOptions } from '@/lib/types';
import { databaseService } from '@/lib/database';
import { calculateDistance, filterAndSortPandals } from '@/lib/utils';

export const usePandals = (userLocation: UserLocation | null, filters: FilterOptions) => {
    const [pandals, setPandals] = useState<PandalWithDistance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPandals = async () => {
        try {
            setLoading(true);
            const data = await databaseService.getAllPandals();

            const pandalsWithDistance: PandalWithDistance[] = data.map(pandal => ({
                ...pandal,
                distance: userLocation
                    ? calculateDistance(userLocation, { latitude: pandal.latitude, longitude: pandal.longitude })
                    : undefined
            }));

            const filteredPandals = filterAndSortPandals(pandalsWithDistance, filters);
            setPandals(filteredPandals);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch pandals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPandals();
    }, [userLocation, filters]);

    return { pandals, loading, error, refetch: fetchPandals };
};
