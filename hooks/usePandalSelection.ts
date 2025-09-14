import { useState, useCallback } from 'react';
import { PandalWithDistance, UserLocation } from '@/lib/types';
import { generateRouteUrl } from '@/lib/utils';

export const usePandalSelection = (userLocation: UserLocation | null) => {
    const [selectedPandal, setSelectedPandal] = useState<PandalWithDistance | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const handlePandalClick = useCallback((pandal: PandalWithDistance | null) => {
        setSelectedPandal(pandal);
    }, []);

    // New function to clear only selection (used when completely resetting)
    const clearSelection = useCallback(() => {
        setSelectedPandal(null);
        setShowDetails(false);
    }, []);

    // New function to hide only details (used when switching to list view)
    const hideDetails = useCallback(() => {
        setShowDetails(false);
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

        // Check if pandal has coordinates
        if (!pandal.latitude || !pandal.longitude) {
            alert('Location coordinates not available for this pandal');
            return;
        }

        const url = generateRouteUrl(userLocation, {
            latitude: pandal.latitude,
            longitude: pandal.longitude
        });
        window.open(url, '_blank');
    }, [userLocation]);

    // Modified to only hide details, keep selection for zoom
    const handleCloseDetails = useCallback(() => {
        setShowDetails(false);
    }, []);

    return {
        selectedPandal,
        showDetails,
        handlePandalClick,
        handleViewDetails,
        handleGetDirections,
        handleCloseDetails,
        clearSelection,
        hideDetails
    };
};