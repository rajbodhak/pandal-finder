"use client";

import React, { useState, useEffect } from 'react';
import { AreaSelector } from './AreaSelector';
import { StartingPointSelector } from './StartingPointSelector';
import RouteDisplay from './RouteDisplay';
import { ManualRouteService } from './ManualRouteService';
import { KOLKATA_AREAS } from './AreaConfig';
import { AreaConfig, StartingPoint, Pandal, ManualRoute } from '@/lib/types';
import { databaseService } from '@/lib/database';
import { MapPin, AlertCircle } from 'lucide-react';

import { NORTH_PANDALS } from '@/data/pandals/north-pandals';
import { SOUTH_PANDALS } from '@/data/pandals/south-pandals';
import RoadmapHeader from './RouteMapHeader';
import { LoadingSpinner } from '../LoadingSpinner';

// Add other area pandals as needed
const ALL_LOCAL_PANDALS: Pandal[] = [
    ...(NORTH_PANDALS as Pandal[]),
    ...(SOUTH_PANDALS as Pandal[]),
    // Central Kolkata will use North Kolkata pandals
    ...(NORTH_PANDALS as Pandal[]).map(pandal => ({
        ...pandal,
        area: 'central_kolkata' as const
    }))
];

interface RouteMapPageProps {
    initialRouteId?: string | null;
}

// Main Roadmap Page Component
const RouteMapPage: React.FC<RouteMapPageProps> = ({ initialRouteId }) => {

    const [currentStep, setCurrentStep] = useState<'area' | 'starting-point' | 'routes' | 'route-display'>('area');
    const [selectedArea, setSelectedArea] = useState<AreaConfig | null>(null);
    const [selectedStartingPoint, setSelectedStartingPoint] = useState<StartingPoint | null>(null);
    const [availableRoutes, setAvailableRoutes] = useState<ManualRoute[]>([]);
    const [areaRoutes, setAreaRoutes] = useState<ManualRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<ManualRoute | null>(null);
    const [pandals, setPandals] = useState<Pandal[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cameFromRoutes, setCameFromRoutes] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize route service
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setInitialLoading(true);
                await ManualRouteService.loadRoutes();
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('Failed to initialize app:', error);
                setError('Failed to initialize the application. Please refresh the page.');
            } finally {
                setInitialLoading(false);
                setIsInitialized(true);
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        const handleDirectRouteAccess = async () => {
            if (!initialRouteId || !isInitialized) return;

            try {
                setLoading(true);
                setError(null);

                // Find the route by ID across all areas
                let foundRoute: ManualRoute | null = null;
                let foundArea: AreaConfig | null = null;

                for (const area of KOLKATA_AREAS) {
                    const routes = ManualRouteService.getRoutesByArea(area.id);
                    const route = routes.find(r => r.id === initialRouteId);
                    if (route) {
                        foundRoute = route;
                        foundArea = area;
                        break;
                    }
                }

                if (foundRoute && foundArea) {
                    // Set up the route directly
                    setSelectedArea(foundArea);
                    setSelectedStartingPoint(foundRoute.startingPoint);
                    setSelectedRoute(foundRoute);

                    // Fetch pandals for this area
                    const areaPandals = await fetchPandalsForArea(foundArea.id);
                    setPandals(areaPandals);

                    // Set area routes
                    const routes = ManualRouteService.getRoutesByArea(foundArea.id);
                    setAreaRoutes(routes);
                    setAvailableRoutes(routes);

                    // Skip directly to route display
                    setCurrentStep('route-display');
                    setCameFromRoutes(false);
                } else {
                    setError(`Route "${initialRouteId}" not found. Please select from available routes.`);
                    setCurrentStep('area');
                }
            } catch (error) {
                console.error('Error loading direct route:', error);
                setError('Failed to load the requested route. Please try again.');
                setCurrentStep('area');
            } finally {
                setLoading(false);
            }
        };

        if (isInitialized) {
            handleDirectRouteAccess();
        }
    }, [initialRouteId, isInitialized]);

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
                return localPandals;
            }

            // Fallback to database if no local data
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

        // Get available routes for this area and store them separately
        const routes = ManualRouteService.getRoutesByArea(area.id);
        setAreaRoutes(routes); // Store original area routes
        setAvailableRoutes(routes); // Also set as current available routes
    };

    // FIXED: Handle starting point selection
    const handleStartingPointSelect = (startingPoint: StartingPoint) => {
        setSelectedStartingPoint(startingPoint);

        // IMPORTANT: Filter from areaRoutes (original) instead of availableRoutes (potentially filtered)
        const routesForStartingPoint = areaRoutes.filter(
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

    // Navigation handlers
    const handleBackToArea = () => {
        setCurrentStep('area');
        setSelectedArea(null);
        setSelectedStartingPoint(null);
        setAvailableRoutes([]);
        setAreaRoutes([]);
        setSelectedRoute(null);
        setCameFromRoutes(false);
        setError(null);
    };

    // FIXED: Reset availableRoutes to original area routes when going back to starting point
    const handleBackToStartingPoint = () => {
        setCurrentStep('starting-point');
        setSelectedStartingPoint(null);
        setAvailableRoutes(areaRoutes); // IMPORTANT: Reset to original area routes
        setSelectedRoute(null);
        setCameFromRoutes(false);
        setError(null);
    };

    // FIX: Add the missing handleBackToRoutes function
    const handleBackToRoutes = () => {
        setCurrentStep('routes');
        setSelectedRoute(null);

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
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-3 sm:p-6 mt-20">
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
                            </div>
                        )}

                        {currentStep === 'route-display' && selectedRoute && (
                            <RouteDisplay
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

export default RouteMapPage;