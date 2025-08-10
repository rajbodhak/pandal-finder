'use client';
import React from 'react';
import { MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useResponsive } from '@/hooks/useResponsive';
import { useMobileState } from '@/hooks/useMobileState';
import { MobileHeader } from '../Layout/MobileHeader';
import { MobileSidebar } from '../Layout/MobileSidebar';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const RouteMapHeader = () => {
    const { isMobile } = useResponsive();
    const {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
    } = useMobileState();

    const pathname = usePathname();
    const isMainPage = pathname === '/';
    const isAboutPage = pathname === '/about';

    // Dummy props for MobileHeader (since route page doesn't need search/view toggle)
    const dummyProps = {
        searchQuery: '',
        onSearchChange: () => { },
        filteredPandals: [],
        onSearchSelect: () => { },
        viewMode: 'map' as const,
        onViewModeChange: () => { }
    };

    // Render MobileHeader on mobile, regular header on desktop
    if (isMobile) {
        return (
            <>
                <MobileHeader
                    onToggleSidebar={toggleSidebar}
                    onCloseSidebar={closeSidebar}
                    isSidebarOpen={isSidebarOpen}
                    {...dummyProps}
                />

                {/* Add MobileSidebar for mobile */}
                <MobileSidebar
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                />
            </>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-b border-white/20 dark:border-gray-700/20 z-40 transition-all duration-300">
            <div className="container mx-auto px-6 py-2">
                <div className="flex items-center justify-between">
                    {/* Left side - Logo and info */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 text-white p-1.5 rounded-xl shadow-xl backdrop-blur-sm transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                                <Image
                                    src="/logo.svg"
                                    alt="DuggaKhoj Logo"
                                    width={30}
                                    height={30}
                                    className="rounded-sm"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                    DuggaKhoj
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                    Route Map
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Center - Navigation Links */}
                    <div className="hidden md:flex items-center gap-2">

                        {/* Home Link (show when not on home page) */}
                        {!isMainPage && (
                            <Link
                                href="/"
                                className="px-4 py-2 lg:px-6 lg:py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <MapPin className="w-4 h-4" />
                                <span className="hidden lg:inline font-medium">Home</span>
                            </Link>
                        )}

                        {/* About Link (show when not on about page) */}
                        {!isAboutPage && (
                            <Link
                                href="/about"
                                className="px-4 py-2 lg:px-6 lg:py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-orange-600 dark:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Info className="w-4 h-4" />
                                <span className="hidden lg:inline font-medium">About</span>
                            </Link>
                        )}

                    </div>

                    {/* Right side - Theme switcher */}
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default RouteMapHeader;