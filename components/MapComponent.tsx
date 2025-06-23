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

    // Handle zoom when selectedPandal changes
    useEffect(() => {
        if (!mapRef.current || !selectedPandal) return;

        // Only zoom if this is a new selection (not just a re-render)
        if (previousSelectedPandalRef.current?.$id !== selectedPandal.$id) {
            mapRef.current.setView([selectedPandal.latitude, selectedPandal.longitude], 16, {
                animate: true,
                duration: 0.5
            });
            previousSelectedPandalRef.current = selectedPandal;
        }
    }, [selectedPandal]);

    // Update markers when pandals change
    useEffect(() => {
        if (!mapRef.current) return;

        markersRef.current.clearLayers();

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

            const marker = L.marker([pandal.latitude, pandal.longitude], {
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

            marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${pandal.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${pandal.description}</p>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="color: #f59e0b;">⭐</span>
            <span style="margin-left: 4px; font-weight: 500;">${(pandal.rating ?? 0).toFixed(1)}</span>
            ${pandal.distance ? `<span style="margin-left: 12px; color: #6b7280;">📍 ${pandal.distance.toFixed(1)}km</span>` : ''}
          </div>
          <div style="margin-top: 12px;">
            <button 
              onclick="window.pandalMapActions?.viewDetails('${pandal.$id}')"
              style="
                background-color: #3b82f6; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 6px; 
                font-size: 12px;
                cursor: pointer;
                margin-right: 8px;
              "
            >
              View Details
            </button>
            <button 
              onclick="window.pandalMapActions?.getDirections('${pandal.$id}')"
              style="
                background-color: #10b981; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 6px; 
                font-size: 12px;
                cursor: pointer;
              "
            >
              Directions
            </button>
          </div>
        </div>
      `);

            marker.on('click', () => onPandalClick(pandal));
            markersRef.current.addLayer(marker);
        });

        // Only fit bounds on initial load or when pandals change (not when selection changes)
        // This prevents the zoom reset when clicking markers
        if (markersRef.current.getLayers().length > 0 && !selectedPandal) {
            const group = L.featureGroup(markersRef.current.getLayers());
            mapRef.current.fitBounds(group.getBounds().pad(0.1));
        }
    }, [pandals, userLocation]);

    // Setup global map actions for popup buttons
    useEffect(() => {
        (window as any).pandalMapActions = {
            viewDetails: (pandalId: string) => {
                const pandal = pandals.find(p => p.$id === pandalId);
                if (pandal) {
                    onViewDetails(pandal); // Use the dedicated callback
                }
            },
            getDirections: (pandalId: string) => {
                const pandal = pandals.find(p => p.$id === pandalId);
                if (pandal && userLocation) {
                    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${pandal.latitude},${pandal.longitude}`;
                    window.open(url, '_blank');
                }
            }
        };

        return () => {
            delete (window as any).pandalMapActions;
        };
    }, [pandals, userLocation, onPandalClick, onViewDetails])

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full rounded-lg overflow-hidden border border-gray-200"
            style={{ minHeight: '400px' }}
        />
    );
};