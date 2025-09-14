import { AreaConfig } from "@/lib/types";
import { ChevronRight, MapPin, Navigation } from "lucide-react";

export const AreaSelector: React.FC<{
    areas: AreaConfig[];
    onSelectArea: (area: AreaConfig) => void;
}> = ({ areas, onSelectArea }) => {
    return (
        <div className="mt-14 mb-14 h-screen px-2 pt-2 md:px-6 md:pt-8">
            <div className="max-w-6xl mx-auto md:max-w-7xl">
                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-3 mb-4 md:p-8 md:mb-8 md:rounded-2xl">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-2 md:mb-3">
                            <Navigation className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-1 md:mb-3">
                            Route Maps
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-2xl md:max-w-3xl mx-auto md:leading-relaxed">
                            Select an area to discover amazing pandals and create your perfect route
                        </p>
                    </div>
                </div>

                {/* Area Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {areas.map((area, index) => (
                        <div
                            key={area.id}
                            onClick={() => onSelectArea(area)}
                            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/20 hover:scale-[1.02] md:hover:scale-[1.03] cursor-pointer transition-all duration-300 p-3 md:p-6 overflow-hidden"
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 dark:from-orange-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl"></div>

                            {/* Card Number */}
                            <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg">
                                    {index + 1}
                                </div>
                            </div>

                            <div className="relative z-10">
                                {/* Area Icon */}
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4 group-hover:scale-102 transition-transform duration-300">
                                    <MapPin className="h-4 w-4 md:h-6 md:w-6 text-orange-600 dark:text-orange-400" />
                                    <span className="text-base md:text-xl font-bold text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                                        {area.displayName}
                                    </span>
                                </div>

                                {/* Area Description */}
                                <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-3 md:mb-6 line-clamp-3 md:line-clamp-4 leading-relaxed md:leading-relaxed">
                                    {area.description}
                                </p>

                                {/* Area Stats */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {area.startingPoints.length} starting points
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 md:gap-2 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform duration-300">
                                        <span className="text-xs md:text-sm font-medium">Explore</span>
                                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-orange-300/50 dark:group-hover:border-orange-600/50 transition-colors duration-300"></div>

                            {/* Desktop Enhanced Hover Glow */}
                            <div className="hidden md:block absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* Desktop Footer Enhancement */}
                <div className="hidden md:block mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-700/20">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Choose your starting area to begin your pandal journey
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};