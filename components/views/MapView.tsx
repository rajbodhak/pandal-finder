'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { PandalCard } from '@/components/PandalCard';
import { PandalWithDistance, UserLocation } from '@/lib/types';

const MapComponent = dynamic(
    () => import('@/components/MapComponent').then(mod => ({ default: mod.MapComponent })),
    {
        ssr: false,
        loading: () => <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />
    }
);

interface MapViewProps {
    filteredPandals: PandalWithDistance[];
    userLocation: UserLocation | null;
    selectedPandal: PandalWithDistance | null;
    isMobile: boolean;
    onPandalClick: (pandal: PandalWithDistance) => void;
    onViewDetails: (pandal: PandalWithDistance) => void;
    onGetDirections: (pandal: PandalWithDistance) => void;
}

export const MapView: React.FC<MapViewProps> = ({
    filteredPandals,
    userLocation,
    selectedPandal,
    isMobile,
    onPandalClick,
    onViewDetails,
    onGetDirections
}) => {
    return (
        <div className={`${isMobile ? '' : 'container mx-auto px-4'} ${isMobile ? '' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
            {/* Map */}
            <div className={isMobile ? '' : 'lg:col-span-2'}>
                <div className={`${isMobile ? '' : 'bg-white rounded-lg shadow-sm overflow-hidden'}`}>
                    <div className={`${isMobile ? 'h-screen' : 'h-96 lg:h-[600px]'} relative z-0`}>
                        <MapComponent
                            pandals={filteredPandals}
                            userLocation={userLocation}
                            onPandalClick={onPandalClick}
                            onViewDetails={onViewDetails}
                            selectedPandal={selectedPandal}
                        />
                    </div>
                </div>
            </div>

            {/* Selected Pandal Info (Desktop only) */}
            {!isMobile && (
                <div className="lg:col-span-1">
                    {selectedPandal ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <PandalCard
                                pandal={selectedPandal}
                                onGetDirections={onGetDirections}
                                onViewDetails={onViewDetails}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Click on a pandal marker to see details</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};