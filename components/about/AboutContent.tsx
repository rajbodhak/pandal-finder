import { Heart } from 'lucide-react';

export default function AboutContent() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-3 w-3 text-white" />
                </div>
                About DuggaKhoj
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Your comprehensive guide to discovering and exploring pandals during Durga Puja festivities. Navigate through the rich cultural landscape of celebrations with detailed information about pandals, locations, and unique features.
            </p>
        </div>
    );
}