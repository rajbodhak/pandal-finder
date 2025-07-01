import React from 'react';
import Image from 'next/image';
import { X, Star, MapPin, Clock, Users, Calendar, Navigation, ChevronRight } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative">
                    {pandal.imageUrl ? (
                        <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-t-xl">
                            <Image
                                src={pandal.imageUrl}
                                alt={pandal.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                                <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{pandal.name}</h1>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-gray-800 text-xs sm:text-sm">{(pandal.rating ?? 0).toFixed(1)}</span>
                                    </div>
                                    {pandal.distance && (
                                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                                            <span className="text-gray-800 text-xs sm:text-sm font-medium">{formatDistance(pandal.distance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-orange-950/50 dark:via-rose-950/50 dark:to-pink-950/50 h-32 sm:h-40 flex items-center justify-center rounded-t-xl border-b border-orange-200/50 dark:border-orange-800/50">
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">{pandal.name}</h1>
                                <div className="flex items-center justify-center gap-3 sm:gap-4">
                                    <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 dark:border-gray-700/20">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span className="font-medium text-gray-800 dark:text-white text-sm">{(pandal.rating ?? 0).toFixed(1)}</span>
                                    </div>
                                    {pandal.distance && (
                                        <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 dark:border-gray-700/20">
                                            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                            <span className="text-gray-800 dark:text-white text-sm font-medium">{formatDistance(pandal.distance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg border border-white/20 dark:border-gray-700/20 hover:scale-110"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                    {/* Description */}
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 rounded-lg p-3 sm:p-4 border border-orange-200/50 dark:border-orange-800/50 mb-4 sm:mb-6">
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{pandal.description}</p>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1">Location</h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{pandal.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Crowd Level */}
                    {pandal.crowd_level && (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
                            <div className="flex items-center gap-3 mb-2 sm:mb-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Crowd Information</h3>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border ${crowdInfo.color}`}>
                                <span>{crowdInfo.icon}</span>
                                <span>{crowdInfo.text}</span>
                            </div>
                        </div>
                    )}

                    {/* Special Features */}
                    {pandal.special_features && pandal.special_features.length > 0 && (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
                            <div className="flex items-center gap-3 mb-2 sm:mb-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Star className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Special Features</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {pandal.special_features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-orange-200/50 dark:border-orange-800/50"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-6 border-t border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 backdrop-blur-sm rounded-b-xl">
                    <div className="flex gap-3">
                        {userLocation && (
                            <button
                                onClick={handleGetDirections}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <Navigation className="w-4 h-4" />
                                Get Directions
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm sm:text-base"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};