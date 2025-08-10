"use client"

import { MobileHeader } from '@/components/Layout/MobileHeader'
import { DesktopHeader } from '@/components/Layout/DesktopHeader'
import { MobileSidebar } from '@/components/Layout/MobileSidebar'
import { useState, useEffect } from 'react'
import React from 'react';
import { ManualRouteService } from '@/components/routemap/ManualRouteService';
import { useMobileState } from '@/hooks/useMobileState'
import { useResponsive } from '@/hooks/useResponsive'
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { usePageViews } from '@/hooks/usePageViews';
import { Instagram, Twitter, Github, MapPin, Search, Navigation, Camera, Heart, Star, User, Sparkles, Smartphone, Map, Route } from 'lucide-react';
import Image from 'next/image'

const Page = () => {
    // State management
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isMobile } = useResponsive();
    const {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
    } = useMobileState();

    // Simplified page view tracking
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
    const handleSidebarToggle = () => {
        toggleSidebar();
    };

    const handleSidebarClose = () => {
        closeSidebar();
    };

    const handleRefreshClick = () => {
        window.location.reload();
    };

    const dummyProps = {
        searchQuery: '',
        onSearchChange: () => { },
        filteredPandals: [],
        onSearchSelect: () => { },
        viewMode: 'map' as const,
        onViewModeChange: () => { }
    };

    const features = [
        { icon: MapPin, text: "Interactive map with pandal locations", color: "from-blue-500 to-cyan-500" },
        { icon: Search, text: "Smart search and filter functionality", color: "from-purple-500 to-violet-500" },
        { icon: Map, text: "Custom route map by starting point", color: "from-orange-500 to-amber-500" },
        { icon: Navigation, text: "Distance calculation & GPS navigation", color: "from-green-500 to-emerald-500" },
        { icon: Camera, text: "High-quality pandal details (photo upload coming soon)", color: "from-pink-500 to-rose-500" },
        { icon: Star, text: "Visit tracking & user analytics", color: "from-indigo-500 to-purple-500" },
        { icon: Route, text: "More custom routes & pandals coming soon", color: "from-teal-500 to-cyan-500" }
    ];

    const howToSteps = [
        "Allow location access for personalized results",
        "Browse pandals on interactive map or list view",
        "Use search & filters to find specific areas",
        "Get directions and explore cultural heritage",
        "Check Route Map for journey"
    ];

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

                        {/* Header Card - Site Name, Views & Instagram */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4">
                            {/* Site Name */}
                            <div className="flex items-center justify-center gap-2 mb-4">
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

                            {/* Views & Instagram */}
                            <div className="grid grid-cols-2 gap-3 text-center">
                                {/* Total Views */}
                                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg border border-orange-200/50 dark:border-orange-700/30">
                                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                        {viewsLoading ? (
                                            <div className="animate-pulse">...</div>
                                        ) : viewsError ? (
                                            <div className="text-xs text-red-500">Error</div>
                                        ) : pageViewStats ? (
                                            pageViewStats.totalViews > 1000
                                                ? `${Math.floor(pageViewStats.totalViews / 1000)}k`
                                                : pageViewStats.totalViews.toLocaleString()
                                        ) : '0'}
                                    </div>
                                    <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                                        Views
                                    </div>
                                </div>

                                {/* Instagram */}
                                <div
                                    className="group p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg border border-purple-200/50 dark:border-purple-700/30 hover:shadow-lg cursor-pointer transition-all duration-300"
                                    onClick={() => window.open('https://instagram.com/duggakhoj.in', '_blank')}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                            <Instagram className="h-3 w-3" />
                                        </div>
                                        <div className="text-xs text-purple-700 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors font-medium">
                                            Follow
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
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

                        {/* Features & How to Use Grid */}
                        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                            {/* Features Card */}
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
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                <feature.icon className="h-2.5 w-2.5 text-white" />
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* How to Use Card */}
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
                        </div>

                        {/* About the Creator Card */}
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
                                        onClick={() => window.open('https://x.com/Rajidesu', '_blank')}
                                    >
                                        <Twitter className="h-3 w-3 text-white" />
                                    </div>
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

export default Page