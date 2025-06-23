'use client';
import React from 'react';
import { PandalWithDistance, UserLocation } from '@/lib/types';

interface StatsSectionProps {
    filteredPandals: PandalWithDistance[];
    userLocation: UserLocation | null;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ filteredPandals, userLocation }) => {
    return (
        <div className="container mx-auto px-4 mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{filteredPandals.length}</div>
                <div className="text-sm text-gray-600">Total Pandals</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                    {filteredPandals.filter(p => (p.rating ?? 0) >= 4.5).length}
                </div>
                <div className="text-sm text-gray-600">Highly Rated</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                    {userLocation ? filteredPandals.filter(p => p.distance && p.distance <= 5).length : '-'}
                </div>
                <div className="text-sm text-gray-600">Within 5km</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                    {filteredPandals.filter(p => p.crowd_level === 'low').length}
                </div>
                <div className="text-sm text-gray-600">Low Crowd</div>
            </div>
        </div>
    );
};