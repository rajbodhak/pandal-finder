// hooks/useGeolocation.ts
import { useState, useEffect, useCallback } from "react";
import { UserLocation } from "@/lib/types";

export const useGeolocation = () => {
    const [loading, setLoading] = useState(false); // Changed to false initially
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<UserLocation | null>(null);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation Not Supported");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const success = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            });
            setLoading(false);
        };

        const errorHandler = (err: GeolocationPositionError) => {
            setError(err.message);
            setLoading(false);
        };

        navigator.geolocation.getCurrentPosition(success, errorHandler, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        });
    }, []);

    // Auto-request location on first load (optional - you can remove this if you want manual only)
    useEffect(() => {
        // Only auto-request if we haven't tried before and don't have location/error
        if (!location && !error && !loading) {
            requestLocation();
        }
    }, []); // Empty dependency array means this runs once on mount

    return { location, loading, error, requestLocation };
};