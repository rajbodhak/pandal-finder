import React, { useState } from 'react';
import { AreaSelector } from './AreaSelector';
import { StartingPointSelector } from './StartingPointSelector';
import { RouteDisplay } from './RouteDisplay';
import { RoadmapService } from './RoadmapService';
import { KOLKATA_AREAS } from './AreaConfig';
import { AreaConfig, StartingPoint, RoadmapPandal, Pandal } from '@/lib/types';
import { databaseService } from '@/lib/database';
import { MapPin } from 'lucide-react';

// Main Roadmap Page Component
const RoadmapPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'area' | 'starting-point' | 'route'>('area');
    const [selectedArea, setSelectedArea] = useState<AreaConfig | null>(null);
    const [selectedStartingPoint, setSelectedStartingPoint] = useState<StartingPoint | null>(null);
    const [route, setRoute] = useState<RoadmapPandal[]>([]);
    const [routeStats, setRouteStats] = useState<any>(null);
    const [pandals, setPandals] = useState<Pandal[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch pandals from your existing Appwrite service
    const fetchPandalsForArea = async (areaName: string): Promise<Pandal[]> => {
        try {
            setLoading(true);
            // Use your existing service method
            const pandals = await databaseService.getPandalsByArea(areaName);
            return pandals;
        } catch (error) {
            console.error('Error fetching pandals:', error);
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
        const areaPandals = await fetchPandalsForArea(area.name);
        setPandals(areaPandals);
    };

    // Handle starting point selection
    const handleStartingPointSelect = (startingPoint: StartingPoint) => {
        setSelectedStartingPoint(startingPoint);

        if (pandals.length > 0) {
            // Generate route
            const generatedRoute = RoadmapService.generateRoute(startingPoint, pandals);
            const stats = RoadmapService.calculateRouteStats(generatedRoute);

            setRoute(generatedRoute);
            setRouteStats(stats);
            setCurrentStep('route');
        }
    };

    // Navigation handlers
    const handleBackToArea = () => {
        setCurrentStep('area');
        setSelectedArea(null);
        setSelectedStartingPoint(null);
        setRoute([]);
        setRouteStats(null);
    };

    const handleBackToStartingPoint = () => {
        setCurrentStep('starting-point');
        setSelectedStartingPoint(null);
        setRoute([]);
        setRouteStats(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🚶‍♂️ Durga Puja Roadmap
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Plan your perfect pandal hopping route across Kolkata
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-600">Loading pandals...</span>
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

                        {currentStep === 'route' && selectedStartingPoint && route.length > 0 && (
                            <RouteDisplay
                                route={route}
                                routeStats={routeStats}
                                startingPoint={selectedStartingPoint}
                                onBack={handleBackToStartingPoint}
                            />
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && currentStep === 'route' && route.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <MapPin className="h-16 w-16 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No pandals found</h3>
                            <p className="text-sm">No pandals available for the selected area.</p>
                        </div>
                        <button
                            onClick={handleBackToStartingPoint}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                            Try Different Starting Point
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoadmapPage;