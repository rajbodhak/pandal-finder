"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Star, Route, Bus, Train, Car, Navigation, AlertTriangle, ArrowLeft, } from 'lucide-react';
import { Pandal, ManualRoute } from '@/lib/types';
import { useStorage } from '@/hooks/useStorage';

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
    const {
        markPandalVisited,
        isPandalVisited,
        updateRouteProgress,
        markRouteCompleted,
        isRouteCompleted,
        getRouteProgress,
        unmarkPandalVisited
    } = useStorage();

    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [showAlternatives, setShowAlternatives] = useState<Set<string>>(new Set());
    const [isRouteComplete, setIsRouteComplete] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Use ref to track if we're updating from storage to prevent loops
    const isUpdatingFromStorage = useRef(false);

    // Initialize completed steps from storage on component mount
    useEffect(() => {
        const savedProgress = getRouteProgress(route.id);
        if (savedProgress && savedProgress.completedSteps) {
            isUpdatingFromStorage.current = true;
            setCompletedSteps(new Set(savedProgress.completedSteps));
            isUpdatingFromStorage.current = false;
        }

        // Check if route is already completed
        setIsRouteComplete(isRouteCompleted(route.id));
        setIsInitialized(true);
    }, [route.id]);

    // Save progress whenever completedSteps changes (but not during initialization)
    useEffect(() => {
        if (!isInitialized || isUpdatingFromStorage.current) {
            return;
        }

        // Convert Set to sorted array for comparison
        const currentStepsArray = Array.from(completedSteps).sort();
        const savedProgress = getRouteProgress(route.id);
        const savedStepsArray = savedProgress ? Array.from(savedProgress.completedSteps).sort() : [];

        // Only update if the steps actually changed
        const hasChanged = JSON.stringify(currentStepsArray) !== JSON.stringify(savedStepsArray);

        if (hasChanged && completedSteps.size > 0) {
            updateRouteProgress(route.id, completedSteps);
        }
    }, [completedSteps, route.id, updateRouteProgress, isInitialized]);

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
        const isCurrentlyInCompletedSteps = newCompleted.has(stepId);

        // Check if this is a pandal (not start/end) and if it's visited in storage
        const isPandalStep = stepId !== 'start' && stepId !== 'end';
        const isCurrentlyVisitedInStorage = isPandalStep ? isPandalVisited(stepId) : false;

        // Determine if we're marking or unmarking
        const shouldUnmark = isCurrentlyInCompletedSteps || isCurrentlyVisitedInStorage;

        if (shouldUnmark) {
            // Removing step - handle unvisiting
            newCompleted.delete(stepId);

            // If it's a pandal step, unmark it from storage
            if (isPandalStep) {
                unmarkPandalVisited(stepId);
            }
        } else {
            // Adding step - handle visiting
            newCompleted.add(stepId);

            // If it's a pandal step, mark it as visited in storage
            if (isPandalStep) {
                const pandal = getPandalById(stepId);
                if (pandal) {
                    markPandalVisited(stepId, pandal.area);
                }
            }
        }

        // Update state after storage operations
        setCompletedSteps(newCompleted);

        // Check if route is completed (all pandals + start + end)
        const totalSteps = route.pandalSequence.length + 2;
        if (newCompleted.size === totalSteps && !isRouteComplete) {
            markRouteCompleted(route.id);
            setIsRouteComplete(true);
        } else if (newCompleted.size < totalSteps && isRouteComplete) {
            // Route was completed but now incomplete, update state
            setIsRouteComplete(false);
        }
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

    const renderStepButton = (stepId: string, stepType: 'start' | 'pandal' | 'end', pandalName?: string) => {
        const isCompletedInSession = completedSteps.has(stepId);
        const isPandalVisitedBefore = stepType === 'pandal' ? isPandalVisited(stepId) : false;

        // For pandals: show as active if either completed in session OR visited before
        // For start/end: only show as active if completed in session
        const isActive = stepType === 'pandal'
            ? (isCompletedInSession || isPandalVisitedBefore)
            : isCompletedInSession;

        let buttonText = '';
        let buttonClass = '';

        if (stepType === 'start') {
            buttonText = isCompletedInSession ? '✓' : 'Start';
        } else if (stepType === 'end') {
            buttonText = isCompletedInSession ? '✓' : 'Done';
        } else {
            // For pandals: show checkmark if active (either completed in session OR visited before)
            buttonText = isActive ? '✓' : 'Visit';
        }

        if (isActive) {
            buttonClass = 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600';
        } else {
            buttonClass = 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600';
        }

        return (
            <div className="flex items-center gap-1">
                <button
                    onClick={() => toggleStepComplete(stepId)}
                    className={`px-2 py-1 rounded-md transition-colors text-xs font-medium min-w-[45px] ${buttonClass}`}
                >
                    {buttonText}
                </button>
            </div>
        );
    };

    // Share functionality
    const shareRoute = async (method: 'whatsapp' | 'copy' | 'generic') => {
        const shareText = `Check out this Durga Puja route: ${route.name}\n${route.description}\nVisit ${route.pandalSequence.length} pandals in ${route.estimatedTotalTime}!`;
        const shareUrl = `${window.location.origin}${window.location.pathname}?route=${route.id}`;

        switch (method) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`);
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                    // You might want to show a toast notification here
                    alert('Route link copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
                break;
            case 'generic':
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: route.name,
                            text: shareText,
                            url: shareUrl
                        });
                    } catch (err) {
                        console.error('Error sharing:', err);
                    }
                }
                break;
        }
    };


    const getAutoProgress = () => {
        const visitedInRoute = route.pandalSequence.filter(id =>
            completedSteps.has(id) || isPandalVisited(id)
        ).length;

        const autoStart = visitedInRoute > 0;
        const autoEnd = visitedInRoute === route.pandalSequence.length;

        return { autoStart, autoEnd, visitedInRoute };
    };

    const { autoStart, autoEnd } = getAutoProgress();

    const calculateActualProgress = () => {
        let actualCompletedSteps = 0;

        if (autoStart) {
            actualCompletedSteps += 1;
        }

        // Count pandals (either completed in current session OR previously visited)
        route.pandalSequence.forEach(pandalId => {
            if (completedSteps.has(pandalId) || isPandalVisited(pandalId)) {
                actualCompletedSteps += 1;
            }
        });

        if (autoEnd) {
            actualCompletedSteps += 1;
        }


        return actualCompletedSteps;
    };

    const totalSteps = route.pandalSequence.length + 2;
    const actualCompletedCount = calculateActualProgress();
    const completionPercentage = (actualCompletedCount / totalSteps) * 100;
    const visitedPandalsCount = route.pandalSequence.filter(pandalId =>
        completedSteps.has(pandalId) || isPandalVisited(pandalId)
    ).length;

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
                            {isRouteComplete && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                                    ✓ Completed
                                </span>
                            )}
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
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">Visited</p>
                                <p className="font-semibold text-xs text-gray-800 dark:text-white">{visitedPandalsCount}/{route.pandalSequence.length}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/20 dark:border-gray-700/20">
                            <Route className="h-3 w-3 text-orange-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">Progress</p>
                                <div className="flex items-center gap-1">
                                    <p className="font-semibold text-xs text-gray-800 dark:text-white">{actualCompletedCount}/{totalSteps}</p>
                                    <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                            style={{ width: `${completionPercentage}%` }}
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
                            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-2 transition-all ${autoStart
                                ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                        {autoStart ? '✓' : 'S'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                                            {route.startingPoint.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-xs">
                                            {autoStart ? 'Route started!' : 'Visit any pandal to start'}
                                        </p>
                                    </div>
                                    {autoStart && (
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                            Started
                                        </span>
                                    )}
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
                            const isPandalVisitedBefore = isPandalVisited(pandalId);

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
                                    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-2 transition-all ${completedSteps.has(pandalId) || isPandalVisitedBefore
                                        ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}>
                                        {/* Pandal header */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                                                            {pandal.name}
                                                        </h3>
                                                        {/* Small badge for previously visited */}
                                                        {/* {isPandalVisitedBefore && !completedSteps.has(pandalId) && (
                                                            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Previously visited"></span>
                                                        )} */}
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-1">
                                                        {pandal.address}
                                                    </p>
                                                </div>
                                            </div>
                                            {renderStepButton(pandalId, 'pandal', pandal.name)}
                                        </div>

                                        {/* Compact pandal stats */}
                                        <div className="flex items-center gap-3 text-xs">
                                            {pandal.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                    <span className="text-gray-700 dark:text-gray-300">{pandal.rating}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${pandal.crowd_level === 'high' ? 'bg-red-500' :
                                                    pandal.crowd_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}></div>
                                                <span className="capitalize text-gray-700 dark:text-gray-300 text-xs">
                                                    {pandal.crowd_level}
                                                </span>
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

                            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 p-2 transition-all ${autoEnd
                                ? 'border-green-300 dark:border-green-600 bg-green-50/80 dark:bg-green-950/50'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                        {autoEnd ? '✓' : 'E'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                                            Route Complete
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-xs">
                                            {autoEnd ? 'Route Ended!' : 'Visit all Pandals to end'}
                                        </p>
                                    </div>
                                    {autoEnd && (
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                            You've visited All Pandals
                                        </span>
                                    )}
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
                                            width: `${completionPercentage}%`
                                        }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {actualCompletedCount} of {totalSteps} steps completed
                                </p>

                                {/* Additional breakdown */}
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>
                                        🏛️ Pandals: {route.pandalSequence.filter(id => completedSteps.has(id) || isPandalVisited(id)).length}/{route.pandalSequence.length}
                                    </span>
                                    <span>
                                        📍 Route: {(completedSteps.has('start') ? 1 : 0) + (completedSteps.has('end') ? 1 : 0)}/2
                                    </span>
                                </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedRouteDisplay;