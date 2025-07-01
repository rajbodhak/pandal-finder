"use client";

import React, { useState } from 'react';
import { AreaSelector } from './AreaSelector';
import { StartingPointSelector } from './StartingPointSelector';
import EnhancedRouteDisplay from './EnhancedRouteDisplay';
import { ManualRouteService } from './ManualRouteService';
import { KOLKATA_AREAS } from './AreaConfig';
import { AreaConfig, StartingPoint, Pandal, ManualRoute } from '@/lib/types';
import { databaseService } from '@/lib/database';
import { MapPin, Route, AlertCircle, Clock, DollarSign } from 'lucide-react';

import { NORTH_PANDALS } from '@/data/pandals/north-pandals';
import RoadmapHeader from './RoadmapHeader';
import { LoadingSpinner } from '../LoadingSpinner';

// Add other area pandals as needed
const ALL_LOCAL_PANDALS: Pandal[] = [
    ...NORTH_PANDALS,
    // Add SOUTH_PANDALS, CENTRAL_PANDALS etc. when you have them
];

// Main Roadmap Page Component
const RoadmapPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'area' | 'starting-point' | 'routes' | 'route-display'>('area');
    const [selectedArea, setSelectedArea] = useState<AreaConfig | null>(null);
    const [selectedStartingPoint, setSelectedStartingPoint] = useState<StartingPoint | null>(null);
    const [availableRoutes, setAvailableRoutes] = useState<ManualRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<ManualRoute | null>(null);
    const [pandals, setPandals] = useState<Pandal[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Add this state to track if we came from routes step
    const [cameFromRoutes, setCameFromRoutes] = useState(false);

    // Initialize route service
    React.useEffect(() => {
        const initializeApp = async () => {
            try {
                setInitialLoading(true);
                await ManualRouteService.loadRoutes();
                // Add a small delay to show the loading state
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('Failed to initialize app:', error);
                setError('Failed to initialize the application. Please refresh the page.');
            } finally {
                setInitialLoading(false);
            }
        };

        initializeApp();
    }, []);

    // Get pandals for area - using local data first, fallback to database
    const fetchPandalsForArea = async (areaId: string): Promise<Pandal[]> => {
        try {
            setLoading(true);
            setError(null);

            // First try to get from local data
            const localPandals = ALL_LOCAL_PANDALS.filter(pandal =>
                pandal.area === areaId || pandal.area === areaId.replace('_', ' ')
            );

            if (localPandals.length > 0) {
                console.log(`Found ${localPandals.length} local pandals for area: ${areaId}`);
                return localPandals;
            }

            // Fallback to database if no local data
            console.log(`No local pandals found for ${areaId}, trying database...`);
            const dbPandals = await databaseService.getPandalsByArea(areaId);
            return dbPandals;

        } catch (error) {
            console.error('Error fetching pandals:', error);
            setError('Failed to fetch pandals. Please try again.');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Handle area selection
    const handleAreaSelect = async (area: AreaConfig) => {
        setSelectedArea(area);
        setCurrentStep('starting-point');

        // Fetch pandals for this area
        const areaPandals = await fetchPandalsForArea(area.id);
        setPandals(areaPandals);
        console.log(`Set ${areaPandals.length} pandals for area ${area.id}:`, areaPandals.map(p => p.$id));

        // Get available routes for this area
        const routes = ManualRouteService.getRoutesByArea(area.id);
        setAvailableRoutes(routes);
    };

    // Handle starting point selection
    const handleStartingPointSelect = (startingPoint: StartingPoint) => {
        setSelectedStartingPoint(startingPoint);

        // Filter routes by starting point
        const routesForStartingPoint = availableRoutes.filter(
            route => route.startingPoint.id === startingPoint.id
        );

        if (routesForStartingPoint.length === 1) {
            // If only one route, select it automatically and mark that we didn't come from routes page
            setSelectedRoute(routesForStartingPoint[0]);
            setCameFromRoutes(false);
            setCurrentStep('route-display');
        } else if (routesForStartingPoint.length > 1) {
            // Multiple routes available, show selection
            setAvailableRoutes(routesForStartingPoint);
            setCameFromRoutes(true); // Mark that we have a routes step
            setCurrentStep('routes');
        } else {
            // No predefined routes, could generate one or show message
            setError('No predefined routes available for this starting point. Please try a different starting point.');
        }
    };

    // Handle route selection
    const handleRouteSelect = (route: ManualRoute) => {
        setSelectedRoute(route);
        setCurrentStep('route-display');
    };

    // Navigation handlers
    const handleBackToArea = () => {
        setCurrentStep('area');
        setSelectedArea(null);
        setSelectedStartingPoint(null);
        setAvailableRoutes([]);
        setSelectedRoute(null);
        setCameFromRoutes(false);
        setError(null);
    };

    const handleBackToStartingPoint = () => {
        setCurrentStep('starting-point');
        setSelectedStartingPoint(null);
        setAvailableRoutes([]);
        setSelectedRoute(null);
        setCameFromRoutes(false);
        setError(null);
    };

    // FIX: Add the missing handleBackToRoutes function
    const handleBackToRoutes = () => {
        setCurrentStep('routes');
        setSelectedRoute(null);
        // Don't reset other states as we want to stay in the routes selection
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
            case 'moderate': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
            case 'hard': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
        }
    };

    // Show initial loading spinner
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 px-3 sm:px-4 py-4 ">
                <div className="max-w-6xl mx-auto">
                    <RoadmapHeader />
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 mt-20">
                        <LoadingSpinner message="Initializing your roadmap experience..." />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 px-3 sm:px-4 py-4">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <RoadmapHeader />

                {/* Error State */}
                {error && (
                    <div className="bg-red-50/80 dark:bg-red-950/50 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State for pandals */}
                {loading && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
                        <LoadingSpinner message="Loading pandals..." />
                    </div>
                )}

                {/* Step-based Navigation */}
                {!loading && (
                    <>
                        {currentStep === 'area' && (
                            <AreaSelector
                                areas={KOLKATA_AREAS}
                                onSelectArea={handleAreaSelect}
                            />
                        )}

                        {currentStep === 'starting-point' && selectedArea && (
                            <StartingPointSelector
                                area={selectedArea}
                                onSelectStartingPoint={handleStartingPointSelect}
                                onBack={handleBackToArea}
                            />
                        )}

                        {currentStep === 'routes' && availableRoutes.length > 0 && (
                            <div className="space-y-4 sm:space-y-6">
                                {/* Header */}
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-3 sm:p-6">
                                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                        <button
                                            onClick={handleBackToStartingPoint}
                                            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm sm:text-base"
                                        >
                                            ← Back
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                                                Select Route from {selectedStartingPoint?.name}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Choose from available predefined routes</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Route Selection */}
                                <div className="grid gap-3 sm:gap-4">
                                    {availableRoutes.map((route) => (
                                        <div
                                            key={route.id}
                                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-xl cursor-pointer transition-all transform hover:scale-[1.02]"
                                            onClick={() => handleRouteSelect(route)}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 truncate">
                                                        {route.name}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base line-clamp-2 mb-3">{route.description}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getDifficultyColor(route.difficulty)} shrink-0`}>
                                                    {route.difficulty}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Route className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 truncate">{route.pandalSequence.length} pandals</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 truncate">{route.estimatedTotalTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300 truncate">₹{route.totalCost}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-orange-500 text-sm">🕘</span>
                                                    <span className="text-gray-700 dark:text-gray-300 text-xs truncate">Start: {route.bestTimeToStart}</span>
                                                </div>
                                            </div>

                                            {/* Tips Preview */}
                                            {route.tips.length > 0 && (
                                                <div className="bg-blue-50/80 dark:bg-blue-950/50 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                        <strong>💡 Tip:</strong> {route.tips[0]}
                                                        {route.tips.length > 1 && ' (and more...)'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 'route-display' && selectedRoute && (
                            <EnhancedRouteDisplay
                                route={selectedRoute}
                                pandals={pandals}
                                onBack={cameFromRoutes ? handleBackToRoutes : handleBackToStartingPoint}
                            />
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && currentStep === 'routes' && availableRoutes.length === 0 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 sm:p-12">
                        <div className="text-center">
                            <div className="text-gray-400 dark:text-gray-500 mb-4">
                                <MapPin className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">No routes available</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">No predefined routes found for the selected starting point.</p>
                            </div>
                            <button
                                onClick={handleBackToStartingPoint}
                                className="mt-4 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
                            >
                                Try Different Starting Point
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoadmapPage;