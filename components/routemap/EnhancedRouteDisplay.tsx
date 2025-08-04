"use client";
import React, { useState } from 'react';
import { Clock, MapPin, Star, Users, Route, Bus, Train, Car, Navigation, AlertTriangle, DollarSign, ArrowLeft } from 'lucide-react';
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
            case 'bus': return <Bus className="h-3 w-3" />;
            case 'metro': return <Train className="h-3 w-3" />;
            case 'auto': return <Car className="h-3 w-3" />;
            case 'taxi': return <Car className="h-3 w-3" />;
            case 'ferry': return '⛴️';
            default: return <Navigation className="h-3 w-3" />;
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
        <div className="bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 min-h-screen mb-8">
            {/* Sticky Header */}
            <div className="fixed top-14 left-0 right-0 bg-orange-50/60 dark:bg-red-900/10 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-gray-700/20 z-20 px-4 py-3 md:py-4">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button and Title Row */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-200 text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back</span>
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="md:text-lg text-base font-bold text-gray-800 dark:text-white">{route.name}</h1>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:sm line-clamp-2">{route.description}</p>

                </div>
            </div>

            {/* Scrollable Content */}
            <div className="pt-36 px-4 pb-6">
                <div className="max-w-4xl mx-auto">

                    <div className="grid grid-cols-3 gap-2 my-2">
                        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/20 dark:border-gray-700/20">
                            <Clock className="h-3 w-3 text-orange-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">Duration</p>
                                <p className="font-semibold text-xs text-gray-800 dark:text-white truncate">{route.estimatedTotalTime}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/20 dark:border-gray-700/20">
                            <MapPin className="h-3 w-3 text-orange-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">Pandals</p>
                                <p className="font-semibold text-xs text-gray-800 dark:text-white">{route.pandalSequence.length}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/20 dark:border-gray-700/20">
                            <Route className="h-3 w-3 text-orange-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">Progress</p>
                                <div className="flex items-center gap-1">
                                    <p className="font-semibold text-xs text-gray-800 dark:text-white">{completedSteps.size}/{route.pandalSequence.length + 1}</p>
                                    <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                            style={{ width: `${(completedSteps.size / (route.pandalSequence.length + 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips and Warnings */}
                    {(route.tips.length > 0 || route.warnings?.length) && (
                        <div className="grid gap-2 mb-3">
                            {route.tips.length > 0 && (
                                <div className="bg-blue-50/80 dark:bg-blue-950/50 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1 text-xs">💡 Tips</h3>
                                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5">
                                        {route.tips.map((tip, idx) => (
                                            <li key={idx}>• {tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {route.warnings && route.warnings.length > 0 && (
                                <div className="bg-yellow-50/80 dark:bg-yellow-950/50 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1 flex items-center gap-1 text-xs">
                                        <AlertTriangle className="h-3 w-3" /> Warnings
                                    </h3>
                                    <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-0.5">
                                        {route.warnings.map((warning, idx) => (
                                            <li key={idx}>• {warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Route Steps */}
                    <div className="space-y-1">
                        {/* Starting Point */}
                        <div className="relative">
                            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-2 transition-all ${completedSteps.has('start') ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50' : 'border-gray-200 dark:border-gray-700'
                                }`}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                                            S
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-sm text-gray-800 dark:text-white truncate">{route.startingPoint.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">{route.startingPoint.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleStepComplete('start')}
                                        className={`px-2 py-1 rounded-lg transition-colors text-xs whitespace-nowrap ${completedSteps.has('start')
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
                                    <div className="flex items-center justify-center py-1">
                                        <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
                                    </div>

                                    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-lg p-2 mx-3 ${getTransportColor(route.startingConnection.connection.transportMode)}`}>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="flex items-center gap-1">
                                                {getTransportIcon(route.startingConnection.connection.transportMode)}
                                                <span className="font-medium capitalize text-xs">
                                                    {route.startingConnection.connection.transportMode}
                                                </span>
                                            </div>
                                            <div className="text-xs">
                                                {route.startingConnection.connection.distance}m •
                                                {route.startingConnection.connection.estimatedTime} min •
                                                ₹{route.startingConnection.connection.cost}
                                            </div>
                                        </div>
                                        {route.startingConnection.connection.transportDetails?.busNumber && (
                                            <p className="text-xs mt-1">Bus: {route.startingConnection.connection.transportDetails.busNumber}</p>
                                        )}
                                        {route.startingConnection.connection.notes && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
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
                                    <div key={uniqueKey} className="bg-red-50/80 dark:bg-red-950/50 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-lg p-2">
                                        <p className="text-red-700 dark:text-red-300 text-xs">⚠️ Pandal not found: {pandalId}</p>
                                    </div>
                                );
                            }

                            return (
                                <div key={uniqueKey} className="relative">
                                    {/* Connecting Line */}
                                    <div className="flex items-center justify-center py-1">
                                        <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
                                    </div>

                                    {/* Pandal Card */}
                                    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-2 transition-all ${completedSteps.has(pandalId) ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50' : 'border-gray-200 dark:border-gray-700'
                                        }`}>
                                        {/* Pandal content */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-sm text-gray-800 dark:text-white truncate">{pandal.name}</h3>
                                                    <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">{pandal.address}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleStepComplete(pandalId)}
                                                className={`px-2 py-1 rounded-lg transition-colors text-xs whitespace-nowrap ${completedSteps.has(pandalId)
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                {completedSteps.has(pandalId) ? '✓' : 'Visit'}
                                            </button>
                                        </div>

                                        {/* Pandal stats */}
                                        <div className="flex items-center gap-2 text-xs flex-wrap">
                                            {pandal.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                    <span className="text-gray-700 dark:text-gray-300">{pandal.rating}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Users className={`h-3 w-3 ${pandal.crowd_level === 'high' ? 'text-red-500' :
                                                    pandal.crowd_level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                                                    }`} />
                                                <span className="capitalize text-gray-700 dark:text-gray-300">{pandal.crowd_level} crowd</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Route Segment - Only if it exists */}
                                    {nextSegment && (
                                        <>
                                            <div className="flex items-center justify-center py-1">
                                                <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
                                            </div>

                                            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-lg p-2 mx-3 ${getTransportColor(nextSegment.transportMode)}`}>
                                                {/* Transport segment content */}
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <div className="flex items-center gap-1">
                                                            {getTransportIcon(nextSegment.transportMode)}
                                                            <span className="font-medium capitalize text-xs">{nextSegment.transportMode}</span>
                                                        </div>
                                                        <div className="text-xs">
                                                            {nextSegment.distance}m • {nextSegment.estimatedTime} min • ₹{nextSegment.cost}
                                                        </div>
                                                    </div>

                                                    {nextSegment.alternativeRoutes && nextSegment.alternativeRoutes.length > 0 && (
                                                        <button
                                                            onClick={() => toggleAlternatives(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`)}
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 whitespace-nowrap"
                                                        >
                                                            {showAlternatives.has(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`) ? 'Hide' : 'Show'} Alt
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Transport details */}
                                                {nextSegment.transportDetails?.busNumber && (
                                                    <p className="text-xs mt-1">Bus: {nextSegment.transportDetails.busNumber}</p>
                                                )}
                                                {nextSegment.transportDetails?.walkingRoute && (
                                                    <p className="text-xs mt-1">Route: {nextSegment.transportDetails.walkingRoute}</p>
                                                )}
                                                {nextSegment.notes && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{nextSegment.notes}</p>
                                                )}

                                                {/* Alternative Routes */}
                                                {showAlternatives.has(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`) && nextSegment.alternativeRoutes && (
                                                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                                        <p className="text-xs font-medium mb-1">Alternatives:</p>
                                                        {nextSegment.alternativeRoutes.map((alt, altIndex) => (
                                                            <div key={`${route.id}-alt-${altIndex}-${nextSegment.fromPandalId}-${nextSegment.toPandalId}`} className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                                • {getTransportIcon(alt.transportMode)} {alt.transportMode} - {alt.distance}m, {alt.estimatedTime} min, ₹{alt.cost || 0}
                                                                {alt.notes && <span className="ml-1 text-gray-500 dark:text-gray-500">({alt.notes})</span>}
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
                            <div className="flex items-center justify-center py-1">
                                <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
                            </div>

                            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-2 transition-all ${completedSteps.has('end') ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50' : 'border-gray-200 dark:border-gray-700'
                                }`}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                                            E
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Route Completed!</h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-xs">You've visited all pandals on this route</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleStepComplete('end')}
                                        className={`px-2 py-1 rounded-lg transition-colors text-xs whitespace-nowrap ${completedSteps.has('end')
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
                    <div className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-3">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">Route Summary</h3>
                        <div className="grid gap-3">
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1 text-sm">Route Progress</h4>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(completedSteps.size / (route.pandalSequence.length + 2)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {completedSteps.size} of {route.pandalSequence.length + 2} steps completed
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1 text-sm">Best Time to Visit</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {route.bestTimeToStart || "Morning hours (9-11 AM) or evening (6-8 PM) for less crowd"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Share Route */}
                    <div className="mt-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-3">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">Share This Route</h3>
                        <div className="flex flex-col gap-2">
                            <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-xs">
                                Share via WhatsApp
                            </button>
                            <button className="px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all text-xs">
                                Copy Route Link
                            </button>
                            <button className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-xs">
                                Download as PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedRouteDisplay;