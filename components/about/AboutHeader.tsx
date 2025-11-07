import Image from 'next/image';
import { Instagram } from 'lucide-react';

interface AboutHeaderProps {
    viewsLoading?: boolean;
    viewsError?: string | null;
    totalViews?: number;
}

export default function AboutHeader({
    viewsLoading,
    viewsError,
    totalViews = 0
}: AboutHeaderProps) {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 md:p-4 p-2">
            {/* Site Name */}
            <div className="flex items-center justify-between mb-2 md:mb-4">
                {/* Left: Logo + Site Name */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-sm flex items-center justify-center shadow-lg">
                        <Image
                            src="/logo.svg"
                            alt="DuggaKhoj Logo"
                            width={24}
                            height={24}
                            className="rounded-sm"
                        />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent font-baloo2">
                        DuggaKhoj
                    </h1>
                </div>

                {/* Right: Instagram */}
                <div
                    className="group px-3 py-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg border border-purple-200/50 dark:border-purple-700/30 hover:shadow-lg cursor-pointer transition-all duration-300"
                    onClick={() => window.open('https://instagram.com/duggakhoj', '_blank')}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                            <Instagram className="h-3 w-3" />
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors font-medium">
                            Follow
                        </div>
                    </div>
                </div>
            </div>

            {/* Views Counter - Currently commented out but can be enabled */}
            <div className="flex justify-center">
                {/* Uncomment to show views
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg border border-orange-200/50 dark:border-orange-700/30">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {viewsLoading ? (
                            <div className="animate-pulse">...</div>
                        ) : viewsError ? (
                            <div className="text-xs text-red-500">Error</div>
                        ) : totalViews > 1000
                            ? `${Math.floor(totalViews / 1000)}k`
                            : totalViews.toLocaleString()}
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                        Views
                    </div>
                </div>
                */}
            </div>
        </div>
    );
}