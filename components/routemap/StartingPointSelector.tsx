import { AreaConfig, StartingPoint } from "@/lib/types";
import { ChevronRight, MapPin, Train, Navigation2, Car, Bus } from "lucide-react";

export const StartingPointSelector: React.FC<{
    area: AreaConfig;
    onSelectStartingPoint: (startingPoint: StartingPoint) => void;
    onBack: () => void;
}> = ({ area, onSelectStartingPoint, onBack }) => {

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'metro':
                return <Train className="h-4 w-4 md:h-5 md:w-5" />;
            case 'railway':
                return <Train className="h-4 w-4 md:h-5 md:w-5" />;
            case 'bus_stop':
                return <Bus className="h-4 w-4 md:h-5 md:w-5" />;
            case 'parking':
                return <Car className="h-4 w-4 md:h-5 md:w-5" />;
            default:
                return <MapPin className="h-4 w-4 md:h-5 md:w-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'metro':
                return 'from-blue-500 to-cyan-500';
            case 'railway':
                return 'from-green-500 to-emerald-500';
            case 'bus_stop':
                return 'from-purple-500 to-violet-500';
            case 'parking':
                return 'from-gray-500 to-slate-500';
            default:
                return 'from-orange-500 to-pink-500';
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'metro':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
            case 'railway':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
            case 'bus_stop':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
            case 'parking':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-200';
            default:
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200';
        }
    };

    return (
        <div className="mt-14 h-auto bg-transparent px-2 py-2 mb-14 md:px-6 md:py-4">
            <div className="max-w-6xl mx-auto md:max-w-7xl">
                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-3 mb-4 md:p-6 md:mb-6">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                        <button
                            onClick={onBack}
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors text-sm md:text-base font-medium px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                            ← Back
                        </button>
                        <div className="h-4 w-px md:h-6 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Navigation2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                                    Choose Starting Point
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                                    for <span className="font-semibold text-orange-600 dark:text-orange-400">{area.displayName}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Area Info */}
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/50 dark:to-pink-950/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-orange-200/50 dark:border-orange-800/50">
                        <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
                            {area.description}
                        </p>
                    </div>
                </div>

                {/* Starting Points Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                    {area.startingPoints.map((point, index) => (
                        <div
                            key={point.id}
                            onClick={() => onSelectStartingPoint(point)}
                            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/20 hover:scale-[1.02] md:hover:scale-[1.03] cursor-pointer transition-all duration-300 p-3 md:p-5 overflow-hidden"
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 dark:from-orange-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl"></div>

                            {/* Card Number */}
                            <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg">
                                    {index + 1}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-3 md:gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Point Icon and Type */}
                                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                            <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${getTypeColor(point.type)} rounded-lg md:rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                {getTypeIcon(point.type)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white mb-1 md:mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 truncate">
                                                    {point.name}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-xs rounded-full font-medium ${getTypeBadgeColor(point.type)}`}>
                                                    {getTypeIcon(point.type)}
                                                    {point.type.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed line-clamp-3 md:line-clamp-4">
                                            {point.description}
                                        </p>

                                        {/* Action Button */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 md:gap-2">
                                                <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                    Ready to start
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 md:gap-2 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform duration-300">
                                                <span className="text-xs md:text-sm font-medium">Select</span>
                                                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                                            </div>
                                        </div>
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
                <div className="hidden md:block mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-700/20">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Select your preferred starting point to begin the route
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};