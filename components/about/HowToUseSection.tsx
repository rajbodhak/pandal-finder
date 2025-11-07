import { Smartphone } from 'lucide-react';

const howToSteps = [
    "Allow location access for personalized results",
    "Browse pandals on interactive map or list view",
    "Use search & filters to find specific areas",
    "Get directions and explore cultural heritage",
    "Check Route Map for journey"
];

export default function HowToUseSection() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    How to Use
                </h2>
            </div>
            <div className="space-y-2">
                {howToSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}