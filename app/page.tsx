'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PandalWithDistance } from '@/lib/types';
// Components
import { FilterBar } from '@/components/FilterBar';
import { PandalDetails } from '@/components/PandalDetails';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

// Layout Components
import { MobileHeader } from '@/components/Layout/MobileHeader';
import { DesktopHeader } from '@/components/Layout/DesktopHeader';
import { MobileSidebar } from '@/components/Layout/MobileSidebar';
import { LocationPermissionPrompt } from '@/components/Layout/LocationPermissionPrompt';
import { MapView } from '@/components/views/MapView';
import { GridListView } from '@/components/views/GridListView';
import { StatsSection } from '@/components/Layout/StatsSection';
import { MobileListView } from '@/components/views/MobileListView';

// Hooks
import { useGeolocation } from '@/hooks/useGeoLocation';
import { usePandals } from '@/hooks/usePandals';
import { useResponsive } from '@/hooks/useResponsive';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePandalFilters } from '@/hooks/usePandalFilters';
import { usePandalSelection } from '@/hooks/usePandalSelection';
import { useMobileState } from '@/hooks/useMobileState';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DuggaKhoj - Find the Best Durga Puja Pandals in Kolkata',
  description: 'Discover amazing Durga Puja pandals near you in Kolkata. Get directions, timings, crowd updates, and plan your perfect pandal hopping route.',
  keywords: [
    'durga puja pandals kolkata',
    'best pandals near me',
    'kolkata durga puja 2025',
    'pandal hopping guide',
    'durga puja celebrations',
    'কলকাতা দুর্গা পূজা'
  ],
  openGraph: {
    title: 'DuggaKhoj - Discover the Best Durga Puja Pandals',
    description: 'Your ultimate companion for exploring Durga Puja pandals in Kolkata. Find pandals, get directions, and plan your route.',
    url: 'https://duggakhoj.site',
  },
}

export default function PandalFinderPage() {

  // View state
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map');
  const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');
  const [hasUserDeclinedLocation, setHasUserDeclinedLocation] = useState(false);
  const [locationPromptDismissed, setLocationPromptDismissed] = useState(false);
  const [pendingPandalSelection, setPendingPandalSelection] = useState<PandalWithDistance | null>(null);

  // Custom hooks
  const { isMobile } = useResponsive();
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
    requestLocation
  } = useGeolocation();

  const {
    pandals: allPandals,
    loading: pandalsLoading,
    error: pandalsError,
    refetch
  } = usePandals(userLocation);

  const {
    filters,
    searchQuery,
    filteredPandals,
    updateFilters,
    updateSearchQuery
  } = usePandalFilters(allPandals, userLocation);

  const {
    selectedPandal,
    showDetails,
    handlePandalClick,
    handleViewDetails,
    handleGetDirections,
    handleCloseDetails,
    hideDetails
  } = usePandalSelection(userLocation);

  const {
    isSidebarOpen,
    showMobileSearch,
    toggleSidebar,
    closeSidebar,
    toggleMobileSearch
  } = useMobileState();

  // Mobile infinite scroll
  const {
    visibleCount: mobileVisibleCount,
    loadMore: loadMoreMobile,
    loadMoreRef: mobileLoadMoreRef,
  } = useInfiniteScroll({
    totalItems: filteredPandals.length,
    initialCount: 10,
    increment: 8,
    resetDeps: [filters, searchQuery]
  });

  // Desktop infinite scroll
  const {
    visibleCount: desktopVisibleCount,
    loadMoreRef: desktopLoadMoreRef,
    hasMore: desktopHasMore,
    loadMore: loadMoreDesktop,
  } = useInfiniteScroll({
    totalItems: filteredPandals.length,
    initialCount: 12,
    increment: 12,
    resetDeps: [filters, searchQuery]
  });

  // Memoized visible pandals on Mobile with better dependency tracking
  const mobileVisiblePandals = useMemo(() => {
    return filteredPandals.slice(0, mobileVisibleCount);
  }, [filteredPandals, mobileVisibleCount]);

  // Memoized visible pandals on Desktop with better dependency tracking
  const desktopVisiblePandals = useMemo(() => {
    return filteredPandals.slice(0, desktopVisibleCount);
  }, [filteredPandals, desktopVisibleCount]);

  // Handle location request with better error handling
  const handleLocationRequest = useCallback(async () => {
    try {
      await requestLocation?.();
      setHasUserDeclinedLocation(false);
    } catch (error) {
      console.error('Location request failed:', error);
      setHasUserDeclinedLocation(true);
    }
  }, [requestLocation]);

  // Handle continuing without location - FIXED: no more infinite reload
  const handleContinueWithoutLocation = useCallback(() => {
    setHasUserDeclinedLocation(true);
    setLocationPromptDismissed(true);
  }, []);

  // Handle search selection - MOVED TO TOP
  const handleSearchSelect = useCallback((pandal: PandalWithDistance) => {
    // Set the selected pandal (this will trigger zoom in MapComponent)
    handlePandalClick(pandal);

    // Close mobile search if it's open
    if (isMobile && showMobileSearch) {
      toggleMobileSearch();
    }
  }, [handlePandalClick, isMobile, showMobileSearch, toggleMobileSearch]);

  const handleSwitchToMap = useCallback((selectedPandal?: PandalWithDistance) => {
    setMobileViewMode('map');

    // If a pandal is provided, select it after the map is ready
    if (selectedPandal) {
      setTimeout(() => {
        handlePandalClick(selectedPandal);
      }, 500);
    }
  }, [mobileViewMode, handlePandalClick]);

  useEffect(() => {
    if (isMobile && mobileViewMode === 'list' && showDetails) {
      hideDetails();
    }
  }, [isMobile, mobileViewMode, showDetails, hideDetails]);

  useEffect(() => {
    if (mobileViewMode === 'map' && pendingPandalSelection) {
      const timer = setTimeout(() => {
        handlePandalClick(pendingPandalSelection);
        setPendingPandalSelection(null);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [mobileViewMode, pendingPandalSelection, handlePandalClick]);

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      closeSidebar();
    }
  }, [isMobile, closeSidebar]);

  useEffect(() => {
    // Only auto-request if user hasn't explicitly declined and we haven't already prompted
    if (!userLocation &&
      !locationLoading &&
      !locationError &&
      !hasUserDeclinedLocation &&
      !locationPromptDismissed) {
      const timer = setTimeout(() => {
        handleLocationRequest();
      }, 1000); // Increased delay for better UX

      return () => clearTimeout(timer);
    }
  }, [userLocation, locationLoading, locationError, hasUserDeclinedLocation, locationPromptDismissed, handleLocationRequest]);

  //loading state handling
  const isInitialLoading = (locationLoading && !hasUserDeclinedLocation) ||
    (pandalsLoading && !allPandals.length);

  // Show location prompt only if needed and not dismissed
  const shouldShowLocationPrompt = !userLocation &&
    !locationLoading &&
    !locationPromptDismissed &&
    (locationError || hasUserDeclinedLocation);

  // IMPROVED: Better error handling for when we have some data but errors
  const shouldShowPandalsError = pandalsError && allPandals.length === 0;

  //Loading
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
            <LoadingSpinner
              message={
                locationLoading
                  ? "Getting your location..."
                  : "Finding pandals near you..."
              }
            />
          </div>
        </div>
      </div>
    );
  }

  //Location Permission Prompt
  if (shouldShowLocationPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950">
        <LocationPermissionPrompt
          onRequestLocation={handleLocationRequest}
          onContinueWithoutLocation={handleContinueWithoutLocation}
        />
      </div>
    );
  }

  // Error states - only show if we have pandals error and no pandals
  if (pandalsError && !allPandals.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
            <ErrorMessage message={pandalsError} onRetry={refetch} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950 relative">
      {/* Headers */}
      {isMobile ? (
        <MobileHeader
          onToggleSidebar={toggleSidebar}
          onCloseSidebar={closeSidebar}
          searchQuery={searchQuery}
          onSearchChange={updateSearchQuery}
          filteredPandals={filteredPandals}
          onSearchSelect={handleSearchSelect}
          isSidebarOpen={isSidebarOpen}
          viewMode={mobileViewMode}
          onViewModeChange={setMobileViewMode}
        />
      ) : (
        <DesktopHeader
          filteredCount={filteredPandals.length}
          hasUserLocation={!!userLocation}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
      )}

      {/* IMPROVED: Better error messaging with theme - Only show in map view */}
      {locationError && locationPromptDismissed &&
        ((isMobile && mobileViewMode === 'map') || (!isMobile && viewMode === 'map')) && (
          <div className={`bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/90 dark:to-pink-950/90 border-l-4 border-orange-400 dark:border-orange-600 p-4 relative z-10 ${isMobile ? 'mt-16' : ''}`}>
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-start">
                <div className="flex">
                  <div className="relative ml-3 ">
                    <div>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        <strong>Location permission denied:</strong> Please allow location access in your browser to see accurate distances and get personalized results.
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 opacity-90 mt-1 pr-24">
                        Settings → Site settings → Location → Allow
                      </p>
                    </div>

                    <button
                      onClick={handleLocationRequest}
                      className="absolute bottom-0 right-0 text-sm underline hover:no-underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                    >
                      Try again
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

      {/* Main Content */}
      <main className={`${isMobile ? 'fixed top-[68px] bottom-16 left-0 right-0 overflow-hidden' : ''} ${locationError && locationPromptDismissed && isMobile ? 'top-32' : ''}`}>
        {/* Desktop Filters */}
        {!isMobile && (
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="bg-transparent backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <FilterBar
                filters={filters}
                onFiltersChange={updateFilters}
                onSearch={updateSearchQuery}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {isMobile ? (
          // Mobile view logic
          mobileViewMode === 'map' ? (
            <div className="relative h-full">
              <MapView
                filteredPandals={filteredPandals}
                userLocation={userLocation}
                selectedPandal={selectedPandal}
                isMobile={isMobile}
                onPandalClick={handlePandalClick}
                onViewDetails={handleViewDetails}
                onGetDirections={handleGetDirections}
              />
            </div>
          ) : (
            <MobileListView
              filters={filters}
              onFiltersChange={updateFilters}
              searchQuery={searchQuery}
              onSearchChange={updateSearchQuery}
              filteredPandals={filteredPandals}
              visiblePandals={mobileVisiblePandals}
              visibleCount={mobileVisibleCount}
              totalCount={filteredPandals.length}
              onPandalClick={handlePandalClick}
              onViewDetails={handleViewDetails}
              onGetDirections={handleGetDirections}
              onLoadMore={loadMoreMobile}
              loadMoreRef={mobileLoadMoreRef}
              onSwitchToMap={handleSwitchToMap}
            />
          )
        ) : (
          // Desktop view logic (unchanged)
          viewMode === 'map' ? (
            <div className="relative">
              <div className="bg-transparent overflow-hidden md:mx-4 mb-4">
                <MapView
                  filteredPandals={filteredPandals}
                  userLocation={userLocation}
                  selectedPandal={selectedPandal}
                  isMobile={isMobile}
                  onPandalClick={handlePandalClick}
                  onViewDetails={handleViewDetails}
                  onGetDirections={handleGetDirections}
                />
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-4 relative z-5">
              <div className="bg-transparent backdrop-blur-sm rounded-xl p-4 sm:p-6">
                <GridListView
                  viewMode={viewMode}
                  visiblePandals={desktopVisiblePandals}
                  totalCount={filteredPandals.length}
                  visibleCount={desktopVisibleCount}
                  hasMore={desktopHasMore}
                  loadMoreRef={desktopLoadMoreRef}
                  onGetDirections={handleGetDirections}
                  onViewDetails={handleViewDetails}
                  onLoadMore={loadMoreDesktop}
                />
              </div>
            </div>
          )
        )}

        {/* Desktop Stats */}
        {!isMobile && (
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="bg-transparent rounded-xl p-4 sm:p-6">
              <StatsSection
                filteredPandals={filteredPandals}
                userLocation={userLocation}
              />
            </div>
          </div>
        )}
      </main>

      {/* Details Modal */}
      {showDetails && selectedPandal && (
        <div className="relative z-50">
          <PandalDetails
            pandal={selectedPandal}
            userLocation={userLocation}
            onClose={handleCloseDetails}
          />
        </div>
      )}

    </div>
  );
}