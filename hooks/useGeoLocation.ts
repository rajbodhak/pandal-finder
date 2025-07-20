import { useState, useEffect, useCallback, useRef } from "react";
import { UserLocation } from "@/lib/types";

export const useGeolocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<UserLocation | null>(null);
    const watchIdRef = useRef<number | null>(null);

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

        // Start watching position for live updates with less frequent updates
        watchIdRef.current = navigator.geolocation.watchPosition(success, errorHandler, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 30000
        });
    }, []);

    const stopWatching = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!location && !error && !loading) {
            requestLocation();
        }

        // Cleanup on unmount
        return () => {
            stopWatching();
        };
    }, []);

    return { location, loading, error, requestLocation, stopWatching };
};