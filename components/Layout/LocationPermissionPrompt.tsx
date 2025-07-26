'use client';
import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationPermissionPromptProps {
    onRequestLocation: () => void;
    onContinueWithoutLocation: () => void;
}

export const LocationPermissionPrompt: React.FC<LocationPermissionPromptProps> = ({
    onRequestLocation,
    onContinueWithoutLocation
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 flex items-center justify-center p-2 sm:p-4">
            <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto p-4 sm:p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 text-center transition-all">
                <div className="mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/70 dark:to-pink-950/70 rounded-full w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <MapPin className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-orange-600 dark:text-orange-400" />
                    </div>
                </div>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                    Location Access Required
                </h2>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                    To find the best pandals near you and provide accurate directions,
                    we need access to your location.
                </p>

                <div className="bg-orange-50/50 dark:bg-orange-950/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-orange-200/50 dark:border-orange-800/50">
                    <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 font-medium mb-2">
                        📍 Allow Location in Browser Settings
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 leading-tight">
                        Settings → Site Settings → Location → Allow
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 leading-tight">
                        Or click the location icon 🔒 in your address bar
                    </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <button
                        onClick={onRequestLocation}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 sm:py-3 lg:py-4 px-4 sm:px-5 lg:px-6 rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-pink-600 dark:from-orange-600 dark:to-pink-600 dark:hover:from-orange-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 font-medium sm:font-semibold shadow-lg backdrop-blur-sm text-sm sm:text-base"
                    >
                        Allow Location Access
                    </button>

                    <button
                        onClick={onContinueWithoutLocation}
                        className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 lg:py-4 px-4 sm:px-5 lg:px-6 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:scale-105 font-medium shadow-lg text-sm sm:text-base"
                    >
                        Continue Without Location
                    </button>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4 sm:mt-6 leading-relaxed">
                    Your location data is only used to find nearby pandals and is not stored or shared.
                </p>
            </div>
        </div>
    );
};