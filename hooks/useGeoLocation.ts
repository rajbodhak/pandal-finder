import { useState, useEffect, useCallback, useRef } from "react";
import { UserLocation } from "@/lib/types";

export const useGeolocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<UserLocation | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const hasRequestedRef = useRef(false);

    // Function to check if location has changed significantly (>100m)
    const hasLocationChangedSignificantly = useCallback((newLocation: UserLocation, oldLocation: UserLocation) => {
        const distance = Math.sqrt(
            Math.pow((newLocation.latitude - oldLocation.latitude) * 111320, 2) +
            Math.pow((newLocation.longitude - oldLocation.longitude) * 111320 * Math.cos(newLocation.latitude * Math.PI / 180), 2)
        );
        return distance > 100; // Only update if moved more than 100 meters
    }, []);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation Not Supported");
            setLoading(false);
            return;
        }

        // Prevent multiple simultaneous requests
        if (hasRequestedRef.current) {
            // console.log('🚫 Location request already in progress');
            return;
        }

        hasRequestedRef.current = true;
        setLoading(true);
        setError(null);

        const success = (position: GeolocationPosition) => {
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            // Only update state if location changed significantly or it's the first location
            setLocation(prevLocation => {
                if (!prevLocation || hasLocationChangedSignificantly(newLocation, prevLocation)) {
                    // console.log('📍 Location updated:', newLocation);
                    return newLocation;
                }
                // console.log('📍 Location unchanged (< 100m), skipping update');
                return prevLocation;
            });

            setLoading(false);
        };

        const errorHandler = (err: GeolocationPositionError) => {
            console.error('❌ Geolocation error:', err.message);
            setError(err.message);
            setLoading(false);
            hasRequestedRef.current = false;
        };

        // Use getCurrentPosition instead of watchPosition for less aggressive tracking
        // Only use watchPosition if you specifically need live tracking
        navigator.geolocation.getCurrentPosition(success, errorHandler, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000 // Accept cached location up to 1 minute old
        });

        // Optional: Enable live tracking only if needed
        // Uncomment these lines if you need continuous location updates
        /*
        watchIdRef.current = navigator.geolocation.watchPosition(success, errorHandler, {
            enableHighAccuracy: false, // Less aggressive
            timeout: 30000,
            maximumAge: 300000 // Accept cached location up to 5 minutes old
        });
        */
    }, [hasLocationChangedSignificantly]);

    const stopWatching = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        hasRequestedRef.current = false;
    }, []);

    // Fixed useEffect - only request once on mount
    useEffect(() => {
        // Only auto-request on first mount if we don't have location
        if (!hasRequestedRef.current && !location && !error) {
            requestLocation();
        }

        // Cleanup on unmount
        return () => {
            stopWatching();
        };
    }, []); // Keep empty dependency array, but add ref guards

    return { location, loading, error, requestLocation, stopWatching };
};