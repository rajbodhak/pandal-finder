import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Users, Clock } from 'lucide-react';
import { PandalWithDistance } from '@/lib/types';
import { formatDistance } from '@/lib/utils';

interface PandalCardProps {
    pandal: PandalWithDistance;
    onGetDirections: (pandal: PandalWithDistance) => void;
    onViewDetails: (pandal: PandalWithDistance) => void;
}

export const PandalCard: React.FC<PandalCardProps> = ({
    pandal,
    onGetDirections,
    onViewDetails
}) => {
    const getCrowdLevelColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'high': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative h-48 w-full">
                {pandal.imageUrl ? (
                    <Image
                        src={pandal.imageUrl}
                        alt={pandal.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image Available</span>
                    </div>
                )}

                {/* Rating Badge */}
                {pandal.rating && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-black/80">{pandal.rating.toFixed(1)}</span>
                    </div>
                )}

                {/* Distance Badge */}
                {pandal.distance && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full px-2 py-1">
                        <span className="text-xs font-medium">{formatDistance(pandal.distance)}</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {pandal.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {pandal.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 line-clamp-1">{pandal.address}</span>
                </div>


                {/* Crowd Level */}
                {pandal.crowd_level && (
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getCrowdLevelColor(pandal.crowd_level)}`}>
                            {pandal.crowd_level} Crowd
                        </span>
                    </div>
                )}

                {/* Special Features */}
                {pandal.special_features && pandal.special_features.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {pandal.special_features.slice(0, 2).map((feature, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                                >
                                    {feature}
                                </span>
                            ))}
                            {pandal.special_features.length > 2 && (
                                <span className="text-xs text-gray-500">
                                    +{pandal.special_features.length - 2} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                        onClick={() => onGetDirections(pandal)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Get Directions
                    </button>
                    <button
                        onClick={() => onViewDetails(pandal)}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};