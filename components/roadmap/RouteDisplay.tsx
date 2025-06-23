import { RoadmapPandal, StartingPoint } from "@/lib/types";
import { useState } from "react";
import { Clock, MapPin, Star, Users, Route } from 'lucide-react';

export const RouteDisplay: React.FC<{
    route: RoadmapPandal[];
    routeStats: any;
    startingPoint: StartingPoint;
    onBack: () => void;
}> = ({ route, routeStats, startingPoint, onBack }) => {
    const [completedPandals, setCompletedPandals] = useState<Set<string>>(new Set());

    const togglePandalComplete = (pandalId: string) => {
        const newCompleted = new Set(completedPandals);
        if (newCompleted.has(pandalId)) {
            newCompleted.delete(pandalId);
        } else {
            newCompleted.add(pandalId);
        }
        setCompletedPandals(newCompleted);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'must_visit': return 'bg-red-100 text-red-800 border-red-200';
            case 'recommended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'optional': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="text-orange-600 hover:text-orange-700"
                >
                    ← Back
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Roadmap from {startingPoint.name}
                    </h2>
                    <p className="text-gray-600">Your optimized pandal hopping route</p>
                </div>
            </div>

            {/* Route Stats */}
            <div className="bg-orange-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <Route className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                        <p className="text-sm text-gray-600">Total Distance</p>
                        <p className="font-semibold">{routeStats.totalDistance} km</p>
                    </div>
                    <div>
                        <Clock className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                        <p className="text-sm text-gray-600">Walking Time</p>
                        <p className="font-semibold">{routeStats.totalWalkingTime} min</p>
                    </div>
                    <div>
                        <MapPin className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                        <p className="text-sm text-gray-600">Total Pandals</p>
                        <p className="font-semibold">{route.length}</p>
                    </div>
                    <div>
                        <Star className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{routeStats.estimatedDuration}</p>
                    </div>
                </div>
            </div>

            {/* Starting Point */}
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                </div>
                <div>
                    <h3 className="font-semibold text-green-800">Starting Point</h3>
                    <p className="text-green-700">{startingPoint.name}</p>
                    <p className="text-sm text-green-600">{startingPoint.description}</p>
                </div>
            </div>

            {/* Route Steps */}
            <div className="space-y-4">
                {route.map((pandal, index) => (
                    <div key={pandal.$id} className="relative">
                        {/* Walking Direction */}
                        {pandal.walkingTimeFromPrevious > 0 && (
                            <div className="flex items-center gap-3 ml-4 mb-2 text-sm text-gray-600">
                                <div className="w-px h-8 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <span>🚶‍♂️</span>
                                    <span>
                                        Walk {pandal.distanceFromPrevious}m ({pandal.walkingTimeFromPrevious} min)
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Pandal Card */}
                        <div className={`relative p-4 rounded-lg border-2 transition-all ${completedPandals.has(pandal.$id)
                            ? 'bg-green-50 border-green-300'
                            : 'bg-white border-gray-200 hover:border-orange-300'
                            }`}>
                            {/* Sequence Number */}
                            <div className="absolute -left-3 top-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {pandal.sequence}
                            </div>

                            <div className="ml-8">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            {pandal.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-2">{pandal.address}</p>
                                    </div>
                                    <button
                                        onClick={() => togglePandalComplete(pandal.$id)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${completedPandals.has(pandal.$id)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {completedPandals.has(pandal.$id) ? 'Visited ✓' : 'Mark as Visited'}
                                    </button>
                                </div>

                                {/* Priority & Stats */}
                                <div className="flex items-center gap-4 mb-3">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(pandal.priority)}`}>
                                        {pandal.priority.replace('_', ' ').toUpperCase()}
                                    </span>
                                    {pandal.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="text-sm font-medium">{pandal.rating}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">{pandal.estimatedVisitTime} min</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className={`h-4 w-4 ${pandal.crowd_level === 'high' ? 'text-red-500' :
                                            pandal.crowd_level === 'medium' ? 'text-yellow-500' :
                                                'text-green-500'
                                            }`} />
                                        <span className="text-sm text-gray-600 capitalize">{pandal.crowd_level}</span>
                                    </div>
                                </div>

                                {/* Highlights */}
                                {pandal.highlights.length > 0 && (
                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-2">
                                            {pandal.highlights.map((highlight, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tips */}
                                {pandal.tips && (
                                    <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                                        <p className="text-sm text-yellow-800">
                                            <strong>💡 Tip:</strong> {pandal.tips}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Your Progress</h3>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Visited: {completedPandals.size} / {route.length} pandals
                    </span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full">
                        <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${(completedPandals.size / route.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium text-orange-600">
                        {Math.round((completedPandals.size / route.length) * 100)}%
                    </span>
                </div>
            </div>
        </div>
    );
};