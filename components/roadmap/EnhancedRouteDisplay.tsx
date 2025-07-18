"use client";
import React, { useState } from 'react';
import { Clock, MapPin, Star, Users, Route, Bus, Train, Car, Navigation, AlertTriangle, DollarSign } from 'lucide-react';
import { Pandal, ManualRoute } from '@/lib/types';

interface EnhancedRouteDisplayProps {
    route: ManualRoute;
    pandals: Pandal[];
    onBack: () => void;
}

const EnhancedRouteDisplay: React.FC<EnhancedRouteDisplayProps> = ({
    route,
    pandals,
    onBack
}) => {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [showAlternatives, setShowAlternatives] = useState<Set<string>>(new Set());

    const getTransportIcon = (mode: string) => {
        switch (mode) {
            case 'walk': return '🚶‍♂️';
            case 'bus': return <Bus className="h-3 w-3 sm:h-4 sm:w-4" />;
            case 'metro': return <Train className="h-3 w-3 sm:h-4 sm:w-4" />;
            case 'auto': return <Car className="h-3 w-3 sm:h-4 sm:w-4" />;
            case 'taxi': return <Car className="h-3 w-3 sm:h-4 sm:w-4" />;
            case 'ferry': return '⛴️';
            default: return <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />;
        }
    };

    const getTransportColor = (mode: string) => {
        switch (mode) {
            case 'walk': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
            case 'bus': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';
            case 'metro': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700';
            case 'auto': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
            case 'taxi': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
            case 'ferry': return 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
        }
    };

    const toggleStepComplete = (stepId: string) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(stepId)) {
            newCompleted.delete(stepId);
        } else {
            newCompleted.add(stepId);
        }
        setCompletedSteps(newCompleted);
    };

    const toggleAlternatives = (segmentId: string) => {
        const newShow = new Set(showAlternatives);
        if (newShow.has(segmentId)) {
            newShow.delete(segmentId);
        } else {
            newShow.add(segmentId);
        }
        setShowAlternatives(newShow);
    };

    // Helper function to get pandal by ID
    const getPandalById = (pandalId: string): Pandal | undefined => {
        return pandals.find(p => p.$id === pandalId);
    };

    return (
        <div className="mt-10 min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 px-3 sm:px-4 py-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-3 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <button
                            onClick={onBack}
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm sm:text-base"
                        >
                            ← Back
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white truncate">{route.name}</h1>
                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base line-clamp-2">{route.description}</p>
                        </div>
                    </div>

                    {/* Route Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Duration</p>
                                <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">{route.estimatedTotalTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pandals</p>
                                <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">{route.pandalSequence.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
                                <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">₹{route.totalCost}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Progress</p>
                                <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">{completedSteps.size}/{route.pandalSequence.length + 1}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips and Warnings */}
                {(route.tips.length > 0 || route.warnings?.length) && (
                    <div className="grid gap-3 sm:gap-4 mb-4 sm:mb-6">
                        {route.tips.length > 0 && (
                            <div className="bg-blue-50/80 dark:bg-blue-950/50 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-sm sm:text-base">💡 Tips</h3>
                                <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    {route.tips.map((tip, idx) => (
                                        <li key={idx}>• {tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {route.warnings && route.warnings.length > 0 && (
                            <div className="bg-yellow-50/80 dark:bg-yellow-950/50 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
                                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2 text-sm sm:text-base">
                                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" /> Warnings
                                </h3>
                                <ul className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                    {route.warnings.map((warning, idx) => (
                                        <li key={idx}>• {warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Route Steps */}
                <div className="sm:space-y-2">
                    {/* Starting Point */}
                    <div className="relative">
                        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-3 sm:p-4 transition-all ${completedSteps.has('start') ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50' : 'border-gray-200 dark:border-gray-700'
                            }`}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                                        S
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white truncate">{route.startingPoint.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2">{route.startingPoint.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleStepComplete('start')}
                                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${completedSteps.has('start')
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {completedSteps.has('start') ? '✓' : 'Start'}
                                </button>
                            </div>
                        </div>

                        {/* Starting Connection */}
                        {route.startingConnection && (
                            <>
                                <div className="flex items-center justify-center py-2 sm:py-4">
                                    <div className="w-px h-4 sm:h-8 bg-gray-300 dark:bg-gray-600"></div>
                                </div>

                                <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-lg p-3 sm:p-4 mx-4 sm:mx-8 ${getTransportColor(route.startingConnection.connection.transportMode)}`}>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            {getTransportIcon(route.startingConnection.connection.transportMode)}
                                            <span className="font-medium capitalize text-xs sm:text-sm">
                                                {route.startingConnection.connection.transportMode}
                                            </span>
                                        </div>
                                        <div className="text-xs sm:text-sm">
                                            {route.startingConnection.connection.distance}m •
                                            {route.startingConnection.connection.estimatedTime} min •
                                            ₹{route.startingConnection.connection.cost}
                                        </div>
                                    </div>
                                    {route.startingConnection.connection.transportDetails?.busNumber && (
                                        <p className="text-xs sm:text-sm mt-2">Bus: {route.startingConnection.connection.transportDetails.busNumber}</p>
                                    )}
                                    {route.startingConnection.connection.notes && (
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {route.startingConnection.connection.notes}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Pandals and Routes */}
                    {route.pandalSequence.map((pandalId, index) => {
                        const pandal = getPandalById(pandalId);
                        const nextSegment = index < route.routeSegments.length ? route.routeSegments[index] : null;
                        const uniqueKey = `${route.id}-pandal-${pandalId}-${index}`;

                        if (!pandal) {
                            return (
                                <div key={uniqueKey} className="bg-red-50/80 dark:bg-red-950/50 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
                                    <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm">⚠️ Pandal not found: {pandalId}</p>
                                </div>
                            );
                        }

                        return (
                            <div key={uniqueKey} className="relative">
                                {/* Connecting Line */}
                                <div className="flex items-center justify-center py-2 sm:py-4">
                                    <div className="w-px h-4 sm:h-8 bg-gray-300 dark:bg-gray-600"></div>
                                </div>

                                {/* Pandal Card */}
                                <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-3 sm:p-4 transition-all ${completedSteps.has(pandalId) ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50' : 'border-gray-200 dark:border-gray-700'
                                    }`}>
                                    {/* Pandal content */}
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white truncate">{pandal.name}</h3>
                                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2">{pandal.address}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleStepComplete(pandalId)}
                                            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${completedSteps.has(pandalId)
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {completedSteps.has(pandalId) ? '✓' : 'Visit'}
                                        </button>
                                    </div>

                                    {/* Pandal stats */}
                                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
                                        {pandal.rating && (
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                                                <span className="text-gray-700 dark:text-gray-300">{pandal.rating}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Users className={`h-3 w-3 sm:h-4 sm:w-4 ${pandal.crowd_level === 'high' ? 'text-red-500' :
                                                pandal.crowd_level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                                                }`} />
                                            <span className="capitalize text-gray-700 dark:text-gray-300">{pandal.crowd_level} crowd</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Route Segment - Only if it exists */}
                                {nextSegment && (
                                    <>
                                        <div className="flex items-center justify-center py-2 sm:py-4">
                                            <div className="w-px h-4 sm:h-8 bg-gray-300 dark:bg-gray-600"></div>
                                        </div>

                                        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-lg p-3 sm:p-4 mx-4 sm:mx-8 ${getTransportColor(nextSegment.transportMode)}`}>
                                            {/* Transport segment content */}
                                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className="flex items-center gap-2">
                                                        {getTransportIcon(nextSegment.transportMode)}
                                                        <span className="font-medium capitalize text-xs sm:text-sm">{nextSegment.transportMode}</span>
                                                    </div>
                                                    <div className="text-xs sm:text-sm">
                                                        {nextSegment.distance}m • {nextSegment.estimatedTime} min • ₹{nextSegment.cost}
                                                    </div>
                                                </div>

                                                {nextSegment.alternativeRoutes && nextSegment.alternativeRoutes.length > 0 && (
                                                    <button
                                                        onClick={() => toggleAlternatives(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`)}
                                                        className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 whitespace-nowrap"
                                                    >
                                                        {showAlternatives.has(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`) ? 'Hide' : 'Show'} Alt
                                                    </button>
                                                )}
                                            </div>

                                            {/* Transport details */}
                                            {nextSegment.transportDetails?.busNumber && (
                                                <p className="text-xs sm:text-sm mt-2">Bus: {nextSegment.transportDetails.busNumber}</p>
                                            )}
                                            {nextSegment.transportDetails?.walkingRoute && (
                                                <p className="text-xs sm:text-sm mt-2">Route: {nextSegment.transportDetails.walkingRoute}</p>
                                            )}
                                            {nextSegment.notes && (
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{nextSegment.notes}</p>
                                            )}

                                            {/* Alternative Routes */}
                                            {showAlternatives.has(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`) && nextSegment.alternativeRoutes && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                                    <p className="text-xs sm:text-sm font-medium mb-2">Alternatives:</p>
                                                    {nextSegment.alternativeRoutes.map((alt, altIndex) => (
                                                        <div key={`${route.id}-alt-${altIndex}-${nextSegment.fromPandalId}-${nextSegment.toPandalId}`} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                            • {getTransportIcon(alt.transportMode)} {alt.transportMode} - {alt.distance}m, {alt.estimatedTime} min, ₹{alt.cost || 0}
                                                            {alt.notes && <span className="ml-2 text-gray-500 dark:text-gray-500">({alt.notes})</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {/* End Point */}
                    <div className="relative">
                        <div className="flex items-center justify-center py-2 sm:py-4">
                            <div className="w-px h-4 sm:h-8 bg-gray-300 dark:bg-gray-600"></div>
                        </div>

                        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-3 sm:p-4 transition-all ${completedSteps.has('end') ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50' : 'border-gray-200 dark:border-gray-700'
                            }`}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                                        E
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white">Route Completed!</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">You've visited all pandals on this route</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleStepComplete('end')}
                                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${completedSteps.has('end')
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {completedSteps.has('end') ? '✓' : 'Done'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Summary */}
                <div className="mt-6 sm:mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Route Summary</h3>
                    <div className="grid gap-4 sm:gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base">Route Progress</h4>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 mb-2">
                                <div
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(completedSteps.size / (route.pandalSequence.length + 2)) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {completedSteps.size} of {route.pandalSequence.length + 2} steps completed
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base">Best Time to Visit</h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {route.bestTimeToStart || "Morning hours (9-11 AM) or evening (6-8 PM) for less crowd"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Share Route */}
                <div className="mt-4 sm:mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Share This Route</h3>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm sm:text-base">
                            Share via WhatsApp
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all text-sm sm:text-base">
                            Copy Route Link
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm sm:text-base">
                            Download as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedRouteDisplay;