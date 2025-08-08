'use client';
import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
    const { isMobile } = useResponsive();
    const pathname = usePathname();

    const needsMobileSpacing = pathname === '/' || pathname === '/about' || pathname === '/routemap';

    return (
        <footer className={`bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-t border-white/20 dark:border-gray-700/20 transition-all ${isMobile && needsMobileSpacing
            ? 'fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center px-4 z-10'
            : 'relative mt-auto'
            }`}>
            <div className={`${isMobile && needsMobileSpacing ? 'text-center' : 'container mx-auto px-4 py-6'}`}>
                {isMobile && needsMobileSpacing ? (
                    // Mobile fixed footer
                    <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                            © 2025 DuggaKhoj
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Made with ❤️ for the community by <span className="font-semibold text-orange-600 dark:text-orange-400">Raj</span>
                        </p>
                    </div>
                ) : (
                    // Desktop footer
                    <div className="text-center text-gray-600 dark:text-gray-300">
                        <p className="mb-2">
                            <strong className="text-gray-800 dark:text-white">DuggaKhoj</strong> - Discover the best pandals in your area
                        </p>
                        <p className="text-sm">
                            Built with ❤️ By <span className="font-semibold text-orange-600 dark:text-orange-400">for the community</span>
                        </p>
                    </div>
                )}
            </div>
        </footer>
    );
};