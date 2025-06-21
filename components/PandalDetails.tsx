import React from 'react';
import Image from 'next/image';
import { X, Star, MapPin, Clock, Users, Calendar } from 'lucide-react';
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
            latitude: pandal.latitude,
            longitude: pandal.longitude
        });
        window.open(url, '_blank');
    };

    const getCrowdLevelInfo = (level: string) => {
        switch (level) {
            case 'low':
                return { color: 'text-green-600 bg-green-100', text: 'Low Crowd - Peaceful visit expected' };
            case 'medium':
                return { color: 'text-yellow-600 bg-yellow-100', text: 'Medium Crowd - Moderate waiting time' };
            case 'high':
                return { color: 'text-red-600 bg-red-100', text: 'High Crowd - Expect long queues' };
            default:
                return { color: 'text-gray-600 bg-gray-100', text: 'Crowd level unknown' };
        }
    };

    const crowdInfo = getCrowdLevelInfo(pandal.crowd_level ?? "medium");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative">
                    {pandal.imageUrl ? (
                        <div className="relative h-64 w-full">
                            <Image
                                src={pandal.imageUrl}
                                alt={pandal.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <h1 className="text-2xl font-bold mb-2">{pandal.name}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-black/80 dark:text-white/80">{(pandal.rating ?? 0).toFixed(1)}</span>
                                    </div>
                                    {pandal.distance && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{formatDistance(pandal.distance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-orange-200 to-red-200 h-32 flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{pandal.name}</h1>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                        <span className="font-medium">{(pandal.rating ?? 0).toFixed(1)}</span>
                                    </div>
                                    {pandal.distance && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{formatDistance(pandal.distance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {/* Description */}
                    <p className="text-gray-700 mb-6 leading-relaxed">{pandal.description}</p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-900">Location</h3>
                                <p className="text-sm text-gray-600">{pandal.address}</p>
                            </div>
                        </div>

                    </div>

                    {/* Crowd Level */}
                    {pandal.crowd_level && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-gray-500" />
                                <h3 className="font-medium text-gray-900">Crowd Information</h3>
                            </div>
                            <div className={`inline-block px-3 py-2 rounded-lg text-sm font-medium ${crowdInfo.color}`}>
                                {crowdInfo.text}
                            </div>
                        </div>
                    )}

                    {/* Special Features */}
                    {pandal.special_features && pandal.special_features.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">Special Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {pandal.special_features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                        {userLocation && (
                            <button
                                onClick={handleGetDirections}
                                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Get Directions
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};