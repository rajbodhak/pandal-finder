// hooks/usePandalsByArea.ts
import { useState, useEffect } from 'react';
import { databaseService } from '@/lib/database';
import { Pandal } from '@/lib/types';

export const usePandalsByArea = (area: string | null) => {
    const [pandals, setPandals] = useState<Pandal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!area) return;

        const fetchPandals = async () => {
            try {
                setLoading(true);
                setError(null);
                const pandals = await databaseService.getPandalsByArea(area);
                setPandals(pandals);
            } catch (err) {
                console.error('Error fetching pandals:', err);
                setError('Failed to load pandals');
            } finally {
                setLoading(false);
            }
        };

        fetchPandals();
    }, [area]);

    return { pandals, loading, error };
};
