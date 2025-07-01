import { AreaConfig } from "@/lib/types";
import { ChevronRight, MapPin, Navigation } from "lucide-react";

export const AreaSelector: React.FC<{
    areas: AreaConfig[];
    onSelectArea: (area: AreaConfig) => void;
}> = ({ areas, onSelectArea }) => {
    return (
        <div className="mt-12 min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 px-3 sm:px-4 pt-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-3 sm:mb-4">
                            <Navigation className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-2xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
                            Choose Your Exploration Area
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                            Select an area to discover amazing pandals and create your perfect route
                        </p>
                    </div>
                </div>

                {/* Area Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {areas.map((area, index) => (
                        <div
                            key={area.id}
                            onClick={() => onSelectArea(area)}
                            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 p-4 sm:p-6 overflow-hidden"
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 dark:from-orange-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                            {/* Card Number */}
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                    {index + 1}
                                </div>
                            </div>

                            <div className="relative z-10">
                                {/* Area Icon */}
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                                </div>

                                {/* Area Title */}
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                                    {area.displayName}
                                </h3>

                                {/* Area Description */}
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                                    {area.description}
                                </p>

                                {/* Area Stats */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {area.startingPoints.length} starting points
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform duration-300">
                                        <span className="text-xs sm:text-sm font-medium">Explore</span>
                                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-300/50 dark:group-hover:border-orange-600/50 transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-6 md:mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 md:p-6">
                    <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
                            Ready to Start Your Journey? 🎉
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
                            Each area offers unique pandals and experiences. Choose your preferred area to discover optimized routes,
                            crowd information, and the best times to visit. Your adventure awaits!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};