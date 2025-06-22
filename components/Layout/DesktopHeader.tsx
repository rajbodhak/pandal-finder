'use client';
import React from 'react';
import { MapPin, Grid, List } from 'lucide-react';

interface DesktopHeaderProps {
    filteredCount: number;
    hasUserLocation: boolean;
    viewMode: 'map' | 'grid' | 'list';
    onViewModeChange: (mode: 'map' | 'grid' | 'list') => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
    filteredCount,
    hasUserLocation,
    viewMode,
    onViewModeChange
}) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 relative z-10">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-600 text-white p-2 rounded-lg">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Durga Puja Pandal Finder</h1>
                            <p className="text-sm text-gray-600">
                                {filteredCount} pandals found
                                {hasUserLocation && ' near you'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => onViewModeChange('map')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'map'
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <MapPin className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};