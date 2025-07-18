import { useState, useEffect, useCallback, useRef } from "react";
import { UserLocation } from "@/lib/types";

export const useGeolocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [isWatching, setIsWatching] = useState(false);

    const watchIdRef = useRef<number | null>(null);

    const startWatching = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation Not Supported");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsWatching(true);

        const success = (position: GeolocationPosition) => {
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            setLocation(newLocation);
            setLoading(false);

            // Log location updates for debugging
            console.log('Location updated:', newLocation);
        };

        const errorHandler = (err: GeolocationPositionError) => {
            console.error('Geolocation error:', err);
            setError(err.message);
            setLoading(false);
            setIsWatching(false);
        };

        // Use watchPosition for continuous location tracking
        watchIdRef.current = navigator.geolocation.watchPosition(
            success,
            errorHandler,
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 15000,
            }
        );
    }, []);

    const stopWatching = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
            setIsWatching(false);
            console.log('Stopped watching location');
        }
    }, []);

    // One-time location request (for initial setup or manual refresh)
    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation Not Supported");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const success = (position: GeolocationPosition) => {
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            setLocation(newLocation);
            setLoading(false);

            console.log('Single location request:', newLocation);
        };

        const errorHandler = (err: GeolocationPositionError) => {
            console.error('Single location request error:', err);
            setError(err.message);
            setLoading(false);
        };

        navigator.geolocation.getCurrentPosition(success, errorHandler, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 15000
        });
    }, []);

    // Auto-start watching on mount
    useEffect(() => {
        if (!location && !error && !loading && !isWatching) {
            startWatching();
        }
    }, [location, error, loading, isWatching, startWatching]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    return {
        location,
        loading,
        error,
        requestLocation,
        startWatching,
        stopWatching,
        isWatching
    };
};