import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Users, ChevronRight, Navigation } from 'lucide-react';
import { PandalWithDistance } from '@/lib/types';
import { formatDistance } from '@/lib/utils';

interface PandalCardProps {
    pandal: PandalWithDistance;
    onGetDirections: (pandal: PandalWithDistance) => void;
    onViewDetails: (pandal: PandalWithDistance) => void;
    isMobile?: boolean;
}

export const PandalCard: React.FC<PandalCardProps> = ({
    pandal,
    onGetDirections,
    onViewDetails,
    isMobile = false
}) => {
    const getCrowdLevelColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
            case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
            case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800';
        }
    };

    if (isMobile) {
        return (
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[120px]">
                <div className="flex gap-3 p-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                        {pandal.imageUrl ? (
                            <Image
                                src={pandal.imageUrl}
                                alt={pandal.name}
                                fill
                                className="object-cover rounded-lg"
                                sizes="80px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-200 via-rose-200 to-pink-200 dark:from-orange-900 dark:via-rose-900 dark:to-pink-900 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        )}

                        {/* Distance Badge */}
                        {pandal.distance && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full px-2 py-1">
                                <span className="text-xs font-medium">{formatDistance(pandal.distance)}</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-base text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                                {pandal.name}
                            </h3>
                            {pandal.rating && (
                                <div className="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/50 dark:to-pink-950/50 rounded-full px-2 py-1 flex-shrink-0">
                                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">{pandal.rating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {pandal.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                                {pandal.description.length > 80 ? `${pandal.description.substring(0, 80)}...` : pandal.description}
                            </p>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-3 flex-grow">
                            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{pandal.address}</span>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex items-center justify-between gap-2 mt-auto">
                            {/* Crowd Level */}
                            {pandal.crowd_level ? (
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize border ${getCrowdLevelColor(pandal.crowd_level)}`}>
                                        {pandal.crowd_level}
                                    </span>
                                </div>
                            ) : (
                                <div></div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => onGetDirections(pandal)}
                                    className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:scale-110"
                                    title="Get Directions"
                                >
                                    <Navigation className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onViewDetails(pandal)}
                                    className="p-2 border border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-all duration-300 hover:scale-110"
                                    title="View Details"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // Desktop version
    return (
        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[420px] flex flex-col">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 dark:from-orange-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            {/* Image Section */}
            <div className="relative h-48 w-full flex-shrink-0">
                {pandal.imageUrl ? (
                    <Image
                        src={pandal.imageUrl}
                        alt={pandal.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-200 via-rose-200 to-pink-200 dark:from-orange-900 dark:via-rose-900 dark:to-pink-900 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm">No Image Available</span>
                        </div>
                    </div>
                )}

                {/* Rating Badge */}
                {pandal.rating && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/20 dark:border-gray-700/20">
                        <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                        <span className="text-sm font-medium text-gray-800 dark:text-white">{pandal.rating.toFixed(1)}</span>
                    </div>
                )}

                {/* Distance Badge */}
                {pandal.distance && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full px-3 py-1.5">
                        <span className="text-sm font-medium">{formatDistance(pandal.distance)}</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="relative z-10 p-6 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 leading-tight">
                    {pandal.name}
                </h3>

                {/* Description */}
                {pandal.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                        {pandal.description.length > 120 ? `${pandal.description.substring(0, 120)}...` : pandal.description}
                    </p>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{pandal.address}</span>
                </div>

                {/* Crowd Level */}
                {pandal.crowd_level && (
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className={`text-sm px-3 py-1 rounded-full font-medium capitalize border ${getCrowdLevelColor(pandal.crowd_level)}`}>
                            {pandal.crowd_level} Crowd
                        </span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-orange-200/50 dark:border-orange-800/50 mt-auto">
                    <button
                        onClick={() => onGetDirections(pandal)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <Navigation className="w-4 h-4" />
                        Get Directions
                    </button>
                    <button
                        onClick={() => onViewDetails(pandal)}
                        className="flex-1 border border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 py-3 px-4 rounded-lg text-sm font-medium hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <ChevronRight className="w-4 h-4" />
                        View Details
                    </button>
                </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-300/50 dark:group-hover:border-orange-600/50 transition-colors duration-300"></div>
        </div>
    );
};