import { User, Github, Instagram } from 'lucide-react';

export default function CreatorSection() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    About the Creator
                </h2>
            </div>

            <div className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Passionate developer and Durga Puja enthusiast dedicated to preserving and sharing Bengali cultural heritage through technology.
                </p>

                {/* Social Icons */}
                <div className="flex gap-2">
                    <div
                        className="w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
                        onClick={() => window.open('https://github.com/rajbodhak', '_blank')}
                    >
                        <Github className="h-3 w-3 text-white" />
                    </div>
                    <div
                        className="w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
                        onClick={() => window.open('https://instagram.com/rajidesu.in', '_blank')}
                    >
                        <Instagram className="h-3 w-3 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}