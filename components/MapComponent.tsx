'use client';
import React, { useEffect, useRef } from 'react';
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

    // Initialize map
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            attributionControl: false
        }).setView([22.5726, 88.3639], 11); // Kolkata center

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''  // Remove attribution
        }).addTo(map);

        markersRef.current.addTo(map);
        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !selectedPandal) return;

        // Small delay to ensure map is fully rendered when switching to map view
        const timer = setTimeout(() => {
            if (mapRef.current && selectedPandal.latitude && selectedPandal.longitude) {
                mapRef.current.setView([selectedPandal.latitude, selectedPandal.longitude], 16, {
                    animate: true,
                    duration: 0.5
                });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [selectedPandal, pandals]);

    // Handle zoom when selectedPandal changes
    useEffect(() => {
        if (!mapRef.current || !selectedPandal) return;

        // Only zoom if this is a new selection (not just a re-render)
        if (previousSelectedPandalRef.current?.$id !== selectedPandal.$id) {
            // Zoom to the selected pandal
            mapRef.current.setView([selectedPandal.latitude!, selectedPandal.longitude!], 16, {
                animate: true,
                duration: 0.5
            });

            // Open the popup for the selected pandal after zoom
            setTimeout(() => {
                const marker = pandalMarkersRef.current.get(selectedPandal.$id);
                if (marker && !marker.isPopupOpen()) {
                    marker.openPopup();
                }
            }, 500);

            previousSelectedPandalRef.current = selectedPandal;
        }
    }, [selectedPandal]);

    // Update markers when pandals change
    useEffect(() => {
        if (!mapRef.current) return;

        markersRef.current.clearLayers();
        pandalMarkersRef.current.clear();

        // Add user location marker
        if (userLocation) {
            const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                    iconSize: [18, 18],
                    iconAnchor: [9, 9]
                })
            }).bindPopup('Your Location');

            markersRef.current.addLayer(userMarker);
        }

        // Add pandal markers
        pandals.forEach(pandal => {
            const isSelected = selectedPandal?.$id === pandal.$id;

            const marker = L.marker([pandal.latitude!, pandal.longitude!], {
                icon: L.divIcon({
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
              ${(pandal.rating ?? 0).toFixed(1)}
            </div>
          `,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                })
            });

            const popup = L.popup({
                closeButton: false,
                className: 'custom-popup',
                minWidth: 200
            }).setContent(`
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
`);

            // Create the marker with popup
            marker.bindPopup(popup);

            // Handle click - trigger callback only (zoom effect will handle popup)
            marker.on('click', (e) => {
                onPandalClick(pandal);
            });

            markersRef.current.addLayer(marker);
            pandalMarkersRef.current.set(pandal.$id, marker);
        });

        if (markersRef.current.getLayers().length > 0 && !selectedPandal) {
            const group = L.featureGroup(markersRef.current.getLayers());
            mapRef.current.fitBounds(group.getBounds().pad(0.1));
        }
    }, [pandals, userLocation, selectedPandal]);

    // Setup global map actions for popup buttons
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
            style={{ minHeight: '400px' }}
        />
    );
};