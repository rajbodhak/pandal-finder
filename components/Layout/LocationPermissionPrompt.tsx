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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 flex items-center justify-center p-4">
            <div className="max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 text-center transition-all">
                <div className="mb-6">
                    <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/70 dark:to-pink-950/70 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    Location Access Required
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    To find the best pandals near you and provide accurate directions,
                    we need access to your location.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={onRequestLocation}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-pink-600 dark:from-orange-600 dark:to-pink-600 dark:hover:from-orange-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg backdrop-blur-sm"
                    >
                        Allow Location Access
                    </button>

                    <button
                        onClick={onContinueWithoutLocation}
                        className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:scale-105 font-medium shadow-lg"
                    >
                        Continue Without Location
                    </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 leading-relaxed">
                    Your location data is only used to find nearby pandals and is not stored or shared.
                </p>
            </div>
        </div>
    );
};