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
                return <Train className="h-4 w-4" />;
            case 'railway':
                return <Train className="h-4 w-4" />;
            case 'bus_stop':
                return <Bus className="h-4 w-4" />;
            case 'parking':
                return <Car className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
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
        <div className="mt-12 h-auto bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 px-2 py-2">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-3 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={onBack}
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors text-sm font-medium"
                        >
                            ← Back
                        </button>
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Navigation2 className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                                    Choose Starting Point
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 text-xs">
                                    for <span className="font-semibold text-orange-600 dark:text-orange-400">{area.displayName}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Area Info */}
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/50 dark:to-pink-950/50 rounded-lg p-3 border border-orange-200/50 dark:border-orange-800/50">
                        <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            {area.description}
                        </p>
                    </div>
                </div>

                {/* Starting Points Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {area.startingPoints.map((point, index) => (
                        <div
                            key={point.id}
                            onClick={() => onSelectStartingPoint(point)}
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
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        {/* Point Icon and Type */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-8 h-8 bg-gradient-to-r ${getTypeColor(point.type)} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                                                {getTypeIcon(point.type)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 truncate">
                                                    {point.name}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${getTypeBadgeColor(point.type)}`}>
                                                    {getTypeIcon(point.type)}
                                                    {point.type.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed line-clamp-3">
                                            {point.description}
                                        </p>

                                        {/* Action Button */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                    Ready to start
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform duration-300">
                                                <span className="text-xs font-medium">Select</span>
                                                <ChevronRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-300/50 dark:group-hover:border-orange-600/50 transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                {/* <div className="mt-6 md:mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
                    <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
                            💡 Choose Your Perfect Starting Point
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
                            Select a starting point that's most convenient for you. Each point offers different transportation options and
                            access to various pandal routes. Consider your mode of transport and preferred exploration style.
                        </p>
                    </div>
                </div> */}
            </div>
        </div>
    );
};