import { AreaConfig } from "@/lib/types";
import { ChevronRight, MapPin, Navigation } from "lucide-react";

export const AreaSelector: React.FC<{
    areas: AreaConfig[];
    onSelectArea: (area: AreaConfig) => void;
}> = ({ areas, onSelectArea }) => {
    return (
        <div className="mt-14 mb-14 h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 px-2 pt-2">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-3 mb-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-2">
                            <Navigation className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                            Route Maps
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl mx-auto">
                            Select an area to discover amazing pandals and create your perfect route
                        </p>
                    </div>
                </div>

                {/* Area Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {areas.map((area, index) => (
                        <div
                            key={area.id}
                            onClick={() => onSelectArea(area)}
                            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 p-3 overflow-hidden"
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 dark:from-orange-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                            {/* Card Number */}
                            <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {index + 1}
                                </div>
                            </div>

                            <div className="relative z-10">
                                {/* Area Icon */}
                                <div className="flex items-center gap-2 mb-2 group-hover:scale-102 transition-transform duration-300">
                                    <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span className="text-base font-bold text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                                        {area.displayName}
                                    </span>
                                </div>

                                {/* Area Description */}
                                <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-3 leading-relaxed">
                                    {area.description}
                                </p>

                                {/* Area Stats */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                            {area.startingPoints.length} starting points
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform duration-300">
                                        <span className="text-xs font-medium">Explore</span>
                                        <ChevronRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-300/50 dark:group-hover:border-orange-600/50 transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};