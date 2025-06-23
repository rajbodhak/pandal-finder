import { useState, useCallback } from 'react';
import { PandalWithDistance, UserLocation } from '@/lib/types';
import { generateRouteUrl } from '@/lib/utils';

export const usePandalSelection = (userLocation: UserLocation | null) => {
    const [selectedPandal, setSelectedPandal] = useState<PandalWithDistance | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const handlePandalClick = useCallback((pandal: PandalWithDistance) => {
        setSelectedPandal(pandal);
    }, []);

    const handleViewDetails = useCallback((pandal: PandalWithDistance) => {
        setSelectedPandal(pandal);
        setShowDetails(true);
    }, []);

    const handleGetDirections = useCallback((pandal: PandalWithDistance) => {
        if (!userLocation) {
            alert('Location permission required for directions');
            return;
        }

        const url = generateRouteUrl(userLocation, {
            latitude: pandal.latitude,
            longitude: pandal.longitude
        });
        window.open(url, '_blank');
    }, [userLocation]);

    const handleCloseDetails = useCallback(() => {
        setShowDetails(false);
        setSelectedPandal(null);
    }, []);

    return {
        selectedPandal,
        showDetails,
        handlePandalClick,
        handleViewDetails,
        handleGetDirections,
        handleCloseDetails
    };
};