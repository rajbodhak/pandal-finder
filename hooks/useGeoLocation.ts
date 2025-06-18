import { useState, useEffect } from "react";
import { UserLocation } from "@/lib/types";

export const useGeolocation = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [location, setLocation] = useState<UserLocation | null>(null);

    useEffect(() => {

        if (!navigator.geolocation) {
            setError("Geolocation Not Supported");
            setLoading(false);
            return;
        }

        const success = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            });
            setLoading(false);
        };

        const error = (err: GeolocationPositionError) => {
            setError(err.message);
            setLoading(false);
        };

        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        });

    }, []);

    return { location, loading, error };
}