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
import RoadmapHeader from './RouteMapHeader';
import { LoadingSpinner } from '../LoadingSpinner';

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

                    // Fetch pandals for this specific route using the new API
                    const routeData = await databaseService.getPandalsForRoute(initialRouteId);
                    setPandals(routeData.pandals);

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

    // Fetch pandals for area - now uses API only
    const fetchPandalsForArea = async (areaId: string): Promise<Pandal[]> => {
        try {
            setLoading(true);
            setError(null);

            // Fetch from API (using slugs from Appwrite)
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
        setAreaRoutes(routes);
        setAvailableRoutes(routes);
    };

    // Handle starting point selection
    const handleStartingPointSelect = async (startingPoint: StartingPoint) => {
        setSelectedStartingPoint(startingPoint);

        // Filter from areaRoutes (original) instead of availableRoutes
        const routesForStartingPoint = areaRoutes.filter(
            route => route.startingPoint.id === startingPoint.id
        );

        if (routesForStartingPoint.length === 1) {
            // If only one route, load its pandals and select it
            const route = routesForStartingPoint[0];

            try {
                setLoading(true);
                // Fetch pandals specifically for this route
                const routeData = await databaseService.getPandalsForRoute(route.id);
                setPandals(routeData.pandals);
                setSelectedRoute(route);
                setCameFromRoutes(false);
                setCurrentStep('route-display');
            } catch (error) {
                console.error('Error loading route pandals:', error);
                setError('Failed to load route details. Please try again.');
            } finally {
                setLoading(false);
            }
        } else if (routesForStartingPoint.length > 1) {
            // Multiple routes available, show selection
            setAvailableRoutes(routesForStartingPoint);
            setCameFromRoutes(true);
            setCurrentStep('routes');
        } else {
            // No predefined routes
            setError('No predefined routes available for this starting point. Please try a different starting point.');
        }
    };

    // Handle route selection from routes list
    const handleRouteSelect = async (route: ManualRoute) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch pandals specifically for this route
            const routeData = await databaseService.getPandalsForRoute(route.id);
            setPandals(routeData.pandals);
            setSelectedRoute(route);
            setCurrentStep('route-display');
        } catch (error) {
            console.error('Error loading route pandals:', error);
            setError('Failed to load route details. Please try again.');
        } finally {
            setLoading(false);
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
        setPandals([]);
        setCameFromRoutes(false);
        setError(null);
    };

    const handleBackToStartingPoint = () => {
        setCurrentStep('starting-point');
        setSelectedStartingPoint(null);
        setAvailableRoutes(areaRoutes); // Reset to original area routes
        setSelectedRoute(null);
        setPandals([]);
        setCameFromRoutes(false);
        setError(null);
    };

    const handleBackToRoutes = () => {
        setCurrentStep('routes');
        setSelectedRoute(null);
        setPandals([]);
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

                {/* Loading State */}
                {loading && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
                        <LoadingSpinner message="Loading route details..." />
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

                                    {/* Routes List */}
                                    <div className="space-y-3 mt-4">
                                        {availableRoutes.map((route) => (
                                            <button
                                                key={route.id}
                                                onClick={() => handleRouteSelect(route)}
                                                className="w-full text-left bg-white dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-300 dark:hover:border-orange-600"
                                            >
                                                <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
                                                    {route.name}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                                    {route.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>⏱️ {route.estimatedTotalTime}</span>
                                                    <span>📍 {route.pandalSequence.length} pandals</span>
                                                    <span>🚶 {route.difficulty}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'route-display' && selectedRoute && pandals.length > 0 && (
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