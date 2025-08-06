import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Users, Navigation, ChevronRight } from 'lucide-react';
import { PandalWithDistance, UserLocation } from '@/lib/types';
import { formatDistance, generateRouteUrl } from '@/lib/utils';

interface PandalDetailsProps {
    pandal: PandalWithDistance;
    userLocation: UserLocation | null;
    onClose: () => void;
}

export const PandalDetails: React.FC<PandalDetailsProps> = ({
    pandal,
    userLocation,
    onClose
}) => {
    const handleGetDirections = () => {
        if (!userLocation) return;

        const url = generateRouteUrl(userLocation, {
            latitude: pandal.latitude!,
            longitude: pandal.longitude!
        });
        window.open(url, '_blank');
    };

    const getCrowdLevelInfo = (level: string) => {
        switch (level) {
            case 'low':
                return {
                    color: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
                    text: 'Low Crowd - Peaceful visit expected',
                    icon: '🟢'
                };
            case 'medium':
                return {
                    color: 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800',
                    text: 'Medium Crowd - Moderate waiting time',
                    icon: '🟡'
                };
            case 'medium-high':
                return {
                    color: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800',
                    text: 'Medium-High Crowd - Moderate wait',
                    icon: '🟠'
                };
            case 'high':
                return {
                    color: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
                    text: 'High Crowd - Expect long queues',
                    icon: '🔴'
                };
            default:
                return {
                    color: 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800',
                    text: 'Crowd level unknown',
                    icon: '⚪'
                };
        }
    };

    const crowdInfo = getCrowdLevelInfo(pandal.crowd_level ?? "medium");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-lg sm:max-w-xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative">
                    {pandal.imageUrl ? (
                        <div className="relative h-32 sm:h-40 w-full overflow-hidden rounded-t-xl">
                            <Image
                                src={pandal.imageUrl}
                                alt={pandal.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4 text-white">
                                <h1 className="text-lg sm:text-xl font-bold mb-1">{pandal.name}</h1>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-gray-800 text-xs">{(pandal.rating ?? 0).toFixed(1)}</span>
                                    </div>
                                    {pandal.distance && (
                                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                            <MapPin className="w-3 h-3 text-orange-600" />
                                            <span className="text-gray-800 text-xs font-medium">{formatDistance(pandal.distance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-orange-950/50 dark:via-rose-950/50 dark:to-pink-950/50 h-24 sm:h-32 flex items-center justify-center rounded-t-xl border-b border-orange-200/50 dark:border-orange-800/50">
                            <div className="text-center px-4">
                                <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1">{pandal.name}</h1>
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20 dark:border-gray-700/20">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="font-medium text-gray-800 dark:text-white text-xs">{(pandal.rating ?? 0).toFixed(1)}</span>
                                    </div>
                                    {pandal.distance && (
                                        <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20 dark:border-gray-700/20">
                                            <MapPin className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                                            <span className="text-gray-800 dark:text-white text-xs font-medium">{formatDistance(pandal.distance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}


                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto">
                    {/* Description */}
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 rounded-lg p-3 border border-orange-200/50 dark:border-orange-800/50 mb-3">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{pandal.description}</p>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow duration-300 mb-3">
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Location</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{pandal.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Crowd Level */}
                    {pandal.crowd_level && (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Users className="w-3 h-3 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Crowd Info</h3>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-medium border ${crowdInfo.color}`}>
                                <span>{crowdInfo.icon}</span>
                                <span className="truncate">{crowdInfo.text}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-3 sm:p-4 border-t border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 backdrop-blur-sm rounded-b-xl">
                    <div className="flex gap-2">
                        {userLocation && (
                            <button
                                onClick={handleGetDirections}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-2.5 px-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                            >
                                <Navigation className="w-4 h-4" />
                                Directions
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 py-2.5 px-3 rounded-lg font-medium hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};