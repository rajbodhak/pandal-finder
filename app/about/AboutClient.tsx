"use client"

import { MobileHeader } from '@/components/Layout/MobileHeader'
import { DesktopHeader } from '@/components/Layout/DesktopHeader'
import { MobileSidebar } from '@/components/Layout/MobileSidebar'
import { useState, useEffect } from 'react'
import { ManualRouteService } from '@/components/routemap/ManualRouteService';
import { useMobileState } from '@/hooks/useMobileState'
import { useResponsive } from '@/hooks/useResponsive'
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { usePageViews } from '@/hooks/usePageViews';
import AboutHeader from '@/components/about/AboutHeader';
import AboutContent from '@/components/about/AboutContent';
import FeaturesSection from '@/components/about/FeaturesSection';
import HowToUseSection from '@/components/about/HowToUseSection';
import CreatorSection from '@/components/about/CreatorSection';

const AboutClient = () => {
    // State management
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isMobile } = useResponsive();
    const {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
    } = useMobileState();

    // Page view tracking
    const {
        stats: pageViewStats,
        loading: viewsLoading,
        error: viewsError
    } = usePageViews('about', {
        trackOnMount: true,
        debounceMs: 3000
    });

    // Initialize app
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setInitialLoading(true);
                await ManualRouteService.loadRoutes();
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.error('Failed to initialize app:', error);
                setError('Failed to initialize the application. Please refresh the page.');
            } finally {
                setInitialLoading(false);
            }
        };

        initializeApp();
    }, []);

    // Close sidebar when switching to desktop
    useEffect(() => {
        if (!isMobile) {
            closeSidebar();
        }
    }, [isMobile, closeSidebar]);

    // Event handlers
    const handleSidebarToggle = () => toggleSidebar();
    const handleSidebarClose = () => closeSidebar();
    const handleRefreshClick = () => window.location.reload();

    const dummyProps = {
        searchQuery: '',
        onSearchChange: () => { },
        filteredPandals: [],
        onSearchSelect: () => { },
        viewMode: 'map' as const,
        onViewModeChange: () => { }
    };

    // Loading state
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 flex flex-col">
                {isMobile ? (
                    <MobileHeader
                        onToggleSidebar={handleSidebarToggle}
                        onCloseSidebar={handleSidebarClose}
                        isSidebarOpen={isSidebarOpen}
                        {...dummyProps}
                    />
                ) : (
                    <DesktopHeader
                        pageTitle="About DuggaKhoj"
                        showViewControls={false}
                    />
                )}

                {isMobile && (
                    <MobileSidebar
                        isOpen={isSidebarOpen}
                        onClose={handleSidebarClose}
                    />
                )}

                <div className={`flex-1 ${isMobile ? 'pt-20 px-2 py-2 pb-20' : 'pt-6 px-6 pb-6'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
                            <LoadingSpinner message="Initializing your roadmap experience..." />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 flex flex-col">
                {isMobile ? (
                    <MobileHeader
                        onToggleSidebar={handleSidebarToggle}
                        onCloseSidebar={handleSidebarClose}
                        isSidebarOpen={isSidebarOpen}
                        {...dummyProps}
                    />
                ) : (
                    <DesktopHeader
                        pageTitle="About DuggaKhoj"
                        showViewControls={false}
                    />
                )}

                {isMobile && (
                    <MobileSidebar
                        isOpen={isSidebarOpen}
                        onClose={handleSidebarClose}
                    />
                )}

                <div className={`flex-1 ${isMobile ? 'pt-20 px-2 py-2 pb-20' : 'pt-6 px-6 pb-6'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            <button
                                onClick={handleRefreshClick}
                                className="mt-2 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main content
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 flex flex-col relative">
            {isMobile ? (
                <MobileHeader
                    onToggleSidebar={handleSidebarToggle}
                    onCloseSidebar={handleSidebarClose}
                    isSidebarOpen={isSidebarOpen}
                    {...dummyProps}
                />
            ) : (
                <DesktopHeader
                    pageTitle="About DuggaKhoj"
                    showViewControls={false}
                />
            )}

            {isMobile && (
                <MobileSidebar
                    isOpen={isSidebarOpen}
                    onClose={handleSidebarClose}
                />
            )}

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'blur-sm brightness-75' : ''}`}>
                <div className={`${isMobile ? 'mt-12 px-4 py-4 pb-20' : 'px-6 py-6'}`}>
                    <div className={`${isMobile ? 'max-w-4xl' : 'max-w-6xl'} mx-auto space-y-3`}>

                        <AboutHeader
                            viewsLoading={viewsLoading}
                            viewsError={viewsError}
                            totalViews={pageViewStats?.totalViews}
                        />

                        <AboutContent />

                        {/* Features & How to Use Grid */}
                        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                            <FeaturesSection />
                            <HowToUseSection />
                        </div>

                        <CreatorSection />

                    </div>
                </div>
            </main>

            {/* Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-20"
                    onClick={handleSidebarClose}
                />
            )}
        </div>
    )
}

export default AboutClient