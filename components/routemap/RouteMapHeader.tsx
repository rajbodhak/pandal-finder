'use client';
import React from 'react';
import { Home } from 'lucide-react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useResponsive } from '@/hooks/useResponsive';
import { useMobileState } from '@/hooks/useMobileState';
import { MobileHeader } from '../Layout/MobileHeader';
import { MobileSidebar } from '../Layout/MobileSidebar';

const RouteMapHeader = () => {
    const { isMobile } = useResponsive();
    const {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
    } = useMobileState();

    // Debug logging
    // console.log('RouteMapHeader Debug:', {
    //     isMobile,
    //     isSidebarOpen,
    //     showMobileSearch
    // });

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

    // Desktop header
    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-b border-white/20 dark:border-gray-700/20 z-40 transition-all">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left side - Home button */}
                <Link
                    href="/"
                    className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 dark:from-orange-600 dark:to-pink-600 dark:hover:from-orange-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
                >
                    <Home className="w-5 h-5" />
                </Link>

                {/* Center - Title */}
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        Routemap
                    </h1>
                </div>

                <ThemeSwitcher />
            </div>
        </header>
    );
};

export default RouteMapHeader;