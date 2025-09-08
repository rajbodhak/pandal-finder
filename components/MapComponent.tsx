'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PandalWithDistance, UserLocation } from '@/lib/types';

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
    pandals: PandalWithDistance[];
    userLocation: UserLocation | null;
    onPandalClick: (pandal: PandalWithDistance) => void;
    onViewDetails: (pandal: PandalWithDistance) => void;
    selectedPandal?: PandalWithDistance | null;
}

// Create reusable icon instances
const createPandalIcon = (isSelected: boolean, rating: number) => {
    return L.divIcon({
        className: 'pandal-marker',
        html: `
            <div style="
              background-color: ${isSelected ? '#ef4444' : '#f97316'}; 
              width: 30px; 
              height: 30px; 
              border-radius: 50%; 
              border: 3px solid white; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            ">
              ${rating.toFixed(1)}
            </div>
          `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
};

export const MapComponent: React.FC<MapComponentProps> = ({
    pandals,
    userLocation,
    onPandalClick,
    onViewDetails,
    selectedPandal
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());
    const previousSelectedPandalRef = useRef<PandalWithDistance | null>(null);
    const pandalMarkersRef = useRef<Map<string, L.Marker>>(new Map());
    const userMarkerRef = useRef<L.Marker | null>(null);
    const lastUserLocationRef = useRef<UserLocation | null>(null);
    const mapInitializedRef = useRef(false);
    const userHasInteractedRef = useRef(false);

    // Throttled update function for better performance
    const updateMarkersThrottled = useRef<NodeJS.Timeout | null>(null);

    // Memoized popup content generator
    const createPopupContent = useCallback((pandal: PandalWithDistance) => `
        <button 
            onclick="window.pandalMapActions?.closePopup()"
            style="
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 0, 0, 0.1);
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #6b7280;
                transition: all 0.2s ease;
            "
            onmouseover="this.style.background='rgba(139, 0, 0, 0.2)'"
            onmouseout="this.style.background='rgba(139, 0, 0, 0.1)'"
        >×</button>

        <h3 style="
            margin: 0 0 6px 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            padding-right: 25px;
        ">${pandal.name}</h3>
        
        <p style="
            margin: 0 0 8px 0;
            color: #6b7280;
            font-size: 13px;
            line-height: 1.4;
        ">${pandal.description}</p>

        <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
        ">
            <div style="display: flex; align-items: center;">
                <span style="color: #f59e0b; margin-right: 3px;">⭐</span>
                <span style="font-size: 13px; font-weight: 500; color: #374151;">${(pandal.rating ?? 0).toFixed(1)}</span>
            </div>
            ${pandal.distance ? `
            <div style="display: flex; align-items: center;">
                <span style="color: #6b7280; margin-right: 3px; font-size: 12px;">📍</span>
                <span style="font-size: 12px; color: #6b7280;">${pandal.distance.toFixed(1)}km</span>
            </div>
            ` : ''}
        </div>

        <div style="display: flex; gap: 6px;">
            <button 
                onclick="window.pandalMapActions?.viewDetails('${pandal.$id}')"
                style="
                    flex: 1;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                "
            >Details</button>
            
            <button 
                onclick="window.pandalMapActions?.getDirections('${pandal.$id}')"
                style="
                    flex: 1;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                "
            >Directions</button>
        </div>
    `, []);

    // Initialize map with optimized settings
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            attributionControl: false,
            zoomControl: true,
            // Optimizations for mobile performance
            preferCanvas: true, // Use canvas rendering for better performance
            fadeAnimation: false, // Disable fade animations
            zoomAnimation: true,
            markerZoomAnimation: false, // Disable marker zoom animation for smoother experience
            wheelPxPerZoomLevel: 120, // Faster zoom response
            zoomSnap: 0.5, // Allow fractional zoom levels for smoother zooming
            zoomDelta: 0.5 // Smaller zoom steps for more granular control
        }).setView([22.5726, 88.3639], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
            maxZoom: 19,
            keepBuffer: 2, // Reduce tile buffer for better performance
            updateWhenIdle: true, // Only update tiles when map is idle
            updateWhenZooming: false // Don't update tiles while zooming
        }).addTo(map);

        markersRef.current.addTo(map);
        mapRef.current = map;

        // Optimized interaction tracking
        map.on('dragstart zoomstart', () => {
            userHasInteractedRef.current = true;
        });

        // Throttle zoom events for better performance
        // eslint-disable-next-line prefer-const
        let zoomTimeout: NodeJS.Timeout | null = null;
        map.on('zoomstart', () => {
            if (zoomTimeout) clearTimeout(zoomTimeout);
        });

        mapInitializedRef.current = true;

        return () => {
            if (updateMarkersThrottled.current) {
                clearTimeout(updateMarkersThrottled.current);
            }
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                mapInitializedRef.current = false;
            }
        };
    }, []);

    // Handle selected pandal zoom (optimized)
    useEffect(() => {
        if (!mapRef.current || !selectedPandal) return;

        if (previousSelectedPandalRef.current?.$id !== selectedPandal.$id) {
            userHasInteractedRef.current = true;

            mapRef.current.setView([selectedPandal.latitude!, selectedPandal.longitude!], 16, {
                animate: true,
                duration: 0.3 // Faster animation
            });

            setTimeout(() => {
                const marker = pandalMarkersRef.current.get(selectedPandal.$id);
                if (marker && !marker.isPopupOpen()) {
                    marker.openPopup();
                }
            }, 350);

            previousSelectedPandalRef.current = selectedPandal;
        }
    }, [selectedPandal]);

    // Handle user location updates
    useEffect(() => {
        if (!mapRef.current || !userLocation || !mapInitializedRef.current) return;

        if (userMarkerRef.current) {
            markersRef.current.removeLayer(userMarkerRef.current);
        }

        const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
            icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            })
        }).bindPopup('Your Location');

        markersRef.current.addLayer(userMarker);
        userMarkerRef.current = userMarker;

        const isFirstLocation = !lastUserLocationRef.current;
        const hasSignificantChange = lastUserLocationRef.current &&
            (Math.abs(lastUserLocationRef.current.latitude - userLocation.latitude) > 0.01 ||
                Math.abs(lastUserLocationRef.current.longitude - userLocation.longitude) > 0.01);

        if ((isFirstLocation || hasSignificantChange) && !userHasInteractedRef.current && !selectedPandal) {
            mapRef.current.setView([userLocation.latitude, userLocation.longitude], 13, {
                animate: true,
                duration: 0.5
            });
        }

        lastUserLocationRef.current = userLocation;
    }, [userLocation]);

    // Optimized pandal markers with throttling
    useEffect(() => {
        if (!mapRef.current || !mapInitializedRef.current) return;

        // Throttle marker updates to prevent performance issues
        if (updateMarkersThrottled.current) {
            clearTimeout(updateMarkersThrottled.current);
        }

        updateMarkersThrottled.current = setTimeout(() => {
            const currentPandalIds = pandals.map(p => p.$id).sort().join(',');
            const existingPandalIds = Array.from(pandalMarkersRef.current.keys()).sort().join(',');

            if (currentPandalIds === existingPandalIds && pandals.length > 0) {
                // Just update selected state without recreating markers
                pandalMarkersRef.current.forEach((marker, pandalId) => {
                    const pandal = pandals.find(p => p.$id === pandalId);
                    if (pandal) {
                        const isSelected = selectedPandal?.$id === pandal.$id;
                        const icon = createPandalIcon(isSelected, pandal.rating ?? 0);
                        marker.setIcon(icon);
                    }
                });
                return;
            }

            // Batch remove markers for better performance
            const markersToRemove = Array.from(pandalMarkersRef.current.values());
            markersToRemove.forEach(marker => {
                markersRef.current.removeLayer(marker);
            });
            pandalMarkersRef.current.clear();

            // Batch add new markers
            const newMarkers: L.Marker[] = [];
            pandals.forEach(pandal => {
                const isSelected = selectedPandal?.$id === pandal.$id;

                const marker = L.marker([pandal.latitude!, pandal.longitude!], {
                    icon: createPandalIcon(isSelected, pandal.rating ?? 0)
                });

                const popup = L.popup({
                    closeButton: false,
                    className: 'custom-popup',
                    minWidth: 200,
                    autoPan: false,
                    keepInView: true
                }).setContent(createPopupContent(pandal));

                marker.bindPopup(popup);

                // Optimized click handler
                marker.on('click', (e) => {
                    e.originalEvent?.stopPropagation();
                    userHasInteractedRef.current = true;
                    onPandalClick(pandal);
                });

                newMarkers.push(marker);
                pandalMarkersRef.current.set(pandal.$id, marker);
            });

            // Add all markers at once
            newMarkers.forEach(marker => markersRef.current.addLayer(marker));

            // Only fit bounds if needed
            if (!userHasInteractedRef.current && !selectedPandal && pandals.length > 0) {
                const allLayers = markersRef.current.getLayers();
                if (allLayers.length > 0) {
                    const group = L.featureGroup(allLayers);
                    mapRef.current!.fitBounds(group.getBounds().pad(0.1), { animate: false });
                }
            }
        }, 50); // 50ms throttle

    }, [pandals, selectedPandal, createPopupContent]);

    // Setup global map actions
    useEffect(() => {
        (window as any).pandalMapActions = {
            viewDetails: (pandalId: string) => {
                const pandal = pandals.find(p => p.$id === pandalId);
                if (pandal) {
                    onViewDetails(pandal);
                }
            },
            getDirections: (pandalId: string) => {
                const pandal = pandals.find(p => p.$id === pandalId);
                if (pandal && userLocation) {
                    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${pandal.latitude},${pandal.longitude}`;
                    window.open(url, '_blank');
                }
            },
            closePopup: () => {
                if (mapRef.current) {
                    mapRef.current.closePopup();
                }
            }
        };

        return () => {
            delete (window as any).pandalMapActions;
        };
    }, [pandals, userLocation, onViewDetails]);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full rounded-lg overflow-hidden border border-gray-200"
            style={{
                minHeight: '400px',
                touchAction: 'pan-x pan-y', // Optimize touch handling
                WebkitTransform: 'translateZ(0)', // Force GPU acceleration
                transform: 'translateZ(0)'
            }}
        />
    );
};