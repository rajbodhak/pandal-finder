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

// Hooks
import { useGeolocation } from '@/hooks/useGeoLocation';
import { usePandals } from '@/hooks/usePandals';
import { useResponsive } from '@/hooks/useResponsive';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePandalFilters } from '@/hooks/usePandalFilters';
import { usePandalSelection } from '@/hooks/usePandalSelection';
import { useMobileState } from '@/hooks/useMobileState';

export default function PandalFinderPage() {

  // View state
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map');
  const [hasUserDeclinedLocation, setHasUserDeclinedLocation] = useState(false);
  const [locationPromptDismissed, setLocationPromptDismissed] = useState(false);

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
    handleCloseDetails
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
    hasMore: mobileHasMore
  } = useInfiniteScroll({
    totalItems: filteredPandals.length,
    initialCount: 10,
    increment: 8,
    resetDeps: [filters, searchQuery]
  });

  // Desktop infinite scroll
  const {
    visibleCount: desktopVisibleCount,
    loadMore: loadMoreDesktop,
    loadMoreRef: desktopLoadMoreRef,
    hasMore: desktopHasMore
  } = useInfiniteScroll({
    totalItems: filteredPandals.length,
    initialCount: 12,
    increment: 12,
    resetDeps: [filters, searchQuery]
  });

  // Memoized visible pandals with better dependency tracking
  const mobileVisiblePandals = useMemo(() => {
    return filteredPandals.slice(0, mobileVisibleCount);
  }, [filteredPandals, mobileVisibleCount]);

  const desktopVisiblePandals = useMemo(() => {
    return filteredPandals.slice(0, desktopVisibleCount);
  }, [filteredPandals, desktopVisibleCount]);

  // ALL CALLBACKS DEFINED HERE - BEFORE ANY CONDITIONAL LOGIC

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

  // ALL EFFECTS DEFINED HERE

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      closeSidebar();
    }
  }, [isMobile, closeSidebar]);

  // IMPROVED: More controlled location request
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

  // COMPUTED VALUES (after all hooks)

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
          onToggleSearch={toggleMobileSearch}
          showSearch={showMobileSearch}
          searchQuery={searchQuery}
          onSearchChange={updateSearchQuery}
          filteredPandals={filteredPandals}
          onSearchSelect={handleSearchSelect}
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
          filters={filters}
          onFiltersChange={updateFilters}
          searchQuery={searchQuery}
          onSearchChange={updateSearchQuery}
          filteredPandals={filteredPandals}
          visiblePandals={mobileVisiblePandals}
          visibleCount={mobileVisibleCount}
          totalCount={filteredPandals.length}
          onPandalClick={handlePandalClick}
          onLoadMore={loadMoreMobile}
          loadMoreRef={mobileLoadMoreRef}
        />
      )}

      {/* IMPROVED: Better error messaging with theme */}
      {locationError && locationPromptDismissed && (
        <div className={`bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/50 dark:to-pink-950/50 border-l-4 border-orange-400 dark:border-orange-600 p-4 relative z-10 ${isMobile ? 'mt-16' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <strong>Location access limited:</strong> Distance calculations may not be accurate.
                    <button
                      onClick={handleLocationRequest}
                      className="ml-2 underline hover:no-underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pandals loading error (non-blocking) */}
      {shouldShowPandalsError && (
        <div className={`bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border-l-4 border-red-400 dark:border-red-600 p-4 relative z-10 ${isMobile ? 'mt-16' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Unable to load pandals:</strong> {pandalsError}
                  <button
                    onClick={refetch}
                    className="ml-2 underline hover:no-underline text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Retry
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${isMobile ? 'fixed top-16 bottom-16 left-0 right-0 overflow-hidden' : ''} ${locationError && locationPromptDismissed && isMobile ? 'top-32' : ''}`}>
        {/* Desktop Filters */}
        {!isMobile && (
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
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
        {isMobile || viewMode === 'map' ? (
          <div className={`relative ${isMobile ? 'h-full' : ''}`}>
            <div className={`bg-trasparent overflow-hidden ${isMobile ? 'h-full' : 'md:mx-4 mb-4'
              }`}>
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
          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-white/80 dark:bg-transparent backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <GridListView
                viewMode={viewMode}
                visiblePandals={desktopVisiblePandals}
                totalCount={filteredPandals.length}
                visibleCount={desktopVisibleCount}
                loadMoreRef={desktopLoadMoreRef}
                onGetDirections={handleGetDirections}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>
        )}

        {/* Desktop Stats */}
        {!isMobile && (
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="bg-white/80 dark:bg-transparent backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
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

      {/* Footer - Now shows on both mobile and desktop */}
      <footer className={`bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-white/20 dark:border-gray-700/20 transition-all ${isMobile
        ? 'fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center px-4 z-20'
        : 'mt-12 relative z-10'
        }`}>
        <div className={`${isMobile ? 'text-center' : 'container mx-auto px-4 py-8'}`}>
          {isMobile ? (
            <div className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                © 2024 Durga Puja Pandal Finder
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Made with ❤️ for the community by <span className="font-semibold text-orange-600 dark:text-orange-400">Raj</span>
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                <strong className="text-gray-800 dark:text-white">Durga Puja Pandal Finder</strong> - Discover the best pandals in your area
              </p>
              <p className="text-sm">
                Built with ❤️ By <span className="font-semibold text-orange-600 dark:text-orange-400">Raj</span>
              </p>
              <div className="mt-4 flex justify-center items-center gap-4 text-sm">
                <span className="text-orange-600 dark:text-orange-400">🙏 শুভ দুর্গা পূজা</span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span>Made with ❤️ for the community</span>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}