import { Sparkles, MapPin, Search, Map, Navigation, Camera, Star, Route } from 'lucide-react';

const features = [
    { icon: MapPin, text: "Interactive map with pandal locations", color: "from-blue-500 to-cyan-500" },
    { icon: Search, text: "Smart search and filter functionality", color: "from-purple-500 to-violet-500" },
    { icon: Map, text: "Custom route map by starting point", color: "from-orange-500 to-amber-500" },
    { icon: Navigation, text: "Distance calculation & GPS navigation", color: "from-green-500 to-emerald-500" },
    { icon: Camera, text: "High-quality pandal details (photo upload coming soon)", color: "from-pink-500 to-rose-500" },
    { icon: Star, text: "Visit tracking & user analytics", color: "from-indigo-500 to-purple-500" },
    { icon: Route, text: "More custom routes & pandals coming soon", color: "from-teal-500 to-cyan-500" }
];

export default function FeaturesSection() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Features
                </h2>
            </div>
            <div className="space-y-2">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex-shrink-0 mt-1"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}