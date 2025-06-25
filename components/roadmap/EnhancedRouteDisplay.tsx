"use client";
import React, { useState } from 'react';
import { Clock, MapPin, Star, Users, Route, Bus, Train, Car, Navigation, AlertTriangle, DollarSign } from 'lucide-react';
import { RouteSegment, Pandal, StartingPoint, ManualRoute } from '@/lib/types';

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
            case 'bus': return <Bus className="h-4 w-4" />;
            case 'metro': return <Train className="h-4 w-4" />;
            case 'auto': return <Car className="h-4 w-4" />;
            case 'taxi': return <Car className="h-4 w-4" />;
            case 'ferry': return '⛴️';
            default: return <Navigation className="h-4 w-4" />;
        }
    };

    const getTransportColor = (mode: string) => {
        switch (mode) {
            case 'walk': return 'bg-green-100 text-green-800 border-green-300';
            case 'bus': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'metro': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'auto': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'taxi': return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'ferry': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={onBack}
                        className="text-orange-600 hover:text-orange-700"
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{route.name}</h1>
                        <p className="text-gray-600">{route.description}</p>
                    </div>
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="font-semibold">{route.estimatedTotalTime}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Pandals</p>
                            <p className="font-semibold">{route.pandalSequence.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Total Cost</p>
                            <p className="font-semibold">₹{route.totalCost}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Route className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Progress</p>
                            <p className="font-semibold">{completedSteps.size}/{route.pandalSequence.length + 1}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips and Warnings */}
            {(route.tips.length > 0 || route.warnings?.length) && (
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {route.tips.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                {route.tips.map((tip, idx) => (
                                    <li key={idx}>• {tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {route.warnings && route.warnings.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Warnings
                            </h3>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                {route.warnings.map((warning, idx) => (
                                    <li key={idx}>• {warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Route Steps */}
            <div className="space-y-6">
                {/* Starting Point */}
                <div className="relative">
                    <div className={`bg-white rounded-lg border-2 p-4 transition-all ${completedSteps.has('start') ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                    S
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{route.startingPoint.name}</h3>
                                    <p className="text-gray-600">{route.startingPoint.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleStepComplete('start')}
                                className={`px-4 py-2 rounded-lg transition-colors ${completedSteps.has('start')
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {completedSteps.has('start') ? 'Started ✓' : 'Mark as Started'}
                            </button>
                        </div>
                    </div>

                    {/* Starting Connection */}
                    {route.startingConnection && (
                        <>
                            <div className="flex items-center justify-center py-4">
                                <div className="w-px h-8 bg-gray-300"></div>
                            </div>

                            <div className={`bg-white border rounded-lg p-4 mx-8 ${getTransportColor(route.startingConnection.connection.transportMode)}`}>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {getTransportIcon(route.startingConnection.connection.transportMode)}
                                        <span className="font-medium capitalize">
                                            {route.startingConnection.connection.transportMode}
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        {route.startingConnection.connection.distance}m •
                                        {route.startingConnection.connection.estimatedTime} min •
                                        ₹{route.startingConnection.connection.cost}
                                    </div>
                                </div>
                                {route.startingConnection.connection.transportDetails?.busNumber && (
                                    <p className="text-sm mt-2">Bus: {route.startingConnection.connection.transportDetails.busNumber}</p>
                                )}
                                {route.startingConnection.connection.notes && (
                                    <p className="text-sm text-gray-600 mt-1">
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
                    const nextSegment = route.routeSegments[index];

                    if (!pandal) {
                        return (
                            <div key={pandalId} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700">⚠️ Pandal not found: {pandalId}</p>
                            </div>
                        );
                    }

                    return (
                        <div key={pandalId} className="relative">
                            {/* Connecting Line */}
                            <div className="flex items-center justify-center py-4">
                                <div className="w-px h-8 bg-gray-300"></div>
                            </div>

                            {/* Pandal Card */}
                            <div className={`bg-white rounded-lg border-2 p-4 transition-all ${completedSteps.has(pandalId) ? 'border-green-300 bg-green-50' : 'border-gray-200'
                                }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{pandal.name}</h3>
                                            <p className="text-gray-600">{pandal.address}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleStepComplete(pandalId)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${completedSteps.has(pandalId)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {completedSteps.has(pandalId) ? 'Visited ✓' : 'Mark as Visited'}
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    {pandal.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span>{pandal.rating}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Users className={`h-4 w-4 ${pandal.crowd_level === 'high' ? 'text-red-500' :
                                            pandal.crowd_level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                                            }`} />
                                        <span className="capitalize">{pandal.crowd_level} crowd</span>
                                    </div>
                                </div>
                            </div>

                            {/* Next Route Segment */}
                            {nextSegment && (
                                <>
                                    <div className="flex items-center justify-center py-4">
                                        <div className="w-px h-8 bg-gray-300"></div>
                                    </div>

                                    <div className={`bg-white border rounded-lg p-4 mx-8 ${getTransportColor(nextSegment.transportMode)}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    {getTransportIcon(nextSegment.transportMode)}
                                                    <span className="font-medium capitalize">{nextSegment.transportMode}</span>
                                                </div>
                                                <div className="text-sm">
                                                    {nextSegment.distance}m • {nextSegment.estimatedTime} min • ₹{nextSegment.cost}
                                                </div>
                                            </div>

                                            {nextSegment.alternativeRoutes && nextSegment.alternativeRoutes.length > 0 && (
                                                <button
                                                    onClick={() => toggleAlternatives(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`)}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    {showAlternatives.has(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`) ? 'Hide' : 'Show'} Alternatives
                                                </button>
                                            )}
                                        </div>

                                        {nextSegment.transportDetails?.busNumber && (
                                            <p className="text-sm mt-2">Bus: {nextSegment.transportDetails.busNumber}</p>
                                        )}
                                        {nextSegment.transportDetails?.metroLine && (
                                            <p className="text-sm mt-2">Metro: {nextSegment.transportDetails.metroLine}</p>
                                        )}
                                        {nextSegment.transportDetails?.walkingRoute && (
                                            <p className="text-sm mt-2">Route: {nextSegment.transportDetails.walkingRoute}</p>
                                        )}
                                        {nextSegment.notes && (
                                            <p className="text-sm text-gray-600 mt-1">{nextSegment.notes}</p>
                                        )}

                                        {/* Alternative Routes */}
                                        {showAlternatives.has(`${nextSegment.fromPandalId}-${nextSegment.toPandalId}`) && nextSegment.alternativeRoutes && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <p className="text-sm font-medium mb-2">Alternative Routes:</p>
                                                {nextSegment.alternativeRoutes.map((alt, altIndex) => (
                                                    <div key={altIndex} className="text-sm text-gray-600 mb-1">
                                                        • {getTransportIcon(alt.transportMode)} {alt.transportMode} - {alt.distance}m, {alt.estimatedTime} min, ₹{alt.cost || 0}
                                                        {alt.notes && <span className="ml-2 text-gray-500">({alt.notes})</span>}
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

                {/* Destination/End Point */}
                <div className="relative">
                    <div className="flex items-center justify-center py-4">
                        <div className="w-px h-8 bg-gray-300"></div>
                    </div>

                    <div className={`bg-white rounded-lg border-2 p-4 transition-all ${completedSteps.has('end') ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                    E
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Route Completed!</h3>
                                    <p className="text-gray-600">You've visited all pandals on this route</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleStepComplete('end')}
                                className={`px-4 py-2 rounded-lg transition-colors ${completedSteps.has('end')
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {completedSteps.has('end') ? 'Completed ✓' : 'Mark as Complete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Summary */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Route Summary</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Route Progress</h4>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                                className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                                style={{
                                    width: `${(completedSteps.size / (route.pandalSequence.length + 1)) * 100}%`
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                            {completedSteps.size} of {route.pandalSequence.length + 1} steps completed
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Best Time to Visit</h4>
                        <p className="text-sm text-gray-600">
                            {route.bestTimeToStart || "Morning hours (9-11 AM) or evening (6-8 PM) for less crowd"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Share Route */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Share This Route</h3>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Share via WhatsApp
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        Copy Route Link
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Download as PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnhancedRouteDisplay;