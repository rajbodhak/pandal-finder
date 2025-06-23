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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
                <div className="mb-4">
                    <MapPin className="w-16 h-16 mx-auto text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Location Access Required</h2>
                <p className="text-gray-600 mb-6">
                    To find the best pandals near you and provide accurate directions,
                    we need access to your location.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={onRequestLocation}
                        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                        Allow Location Access
                    </button>
                    <button
                        onClick={onContinueWithoutLocation}
                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Continue Without Location
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    Your location data is only used to find nearby pandals and is not stored or shared.
                </p>
            </div>
        </div>
    );
};