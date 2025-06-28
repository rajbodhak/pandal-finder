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
  // ALL HOOKS MUST BE AT THE TOP - NEVER CONDITIONALLY CALLED

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

  // CONDITIONAL RENDERING (after all hooks are called)

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner
            message={
              locationLoading
                ? "Getting your location..."
                : "Finding pandals near you..."
            }
          />
        </div>
      </div>
    );
  }

  if (shouldShowLocationPrompt) {
    return (
      <LocationPermissionPrompt
        onRequestLocation={handleLocationRequest}
        onContinueWithoutLocation={handleContinueWithoutLocation}
      />
    );
  }

  // Error states - only show if we have pandals error and no pandals
  if (pandalsError && !allPandals.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={pandalsError} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
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

      {/* IMPROVED: Better error messaging */}
      {locationError && locationPromptDismissed && (
        <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 relative z-10 ${isMobile ? 'mt-16' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Location access limited:</strong> Distance calculations may not be accurate.
                    <button
                      onClick={handleLocationRequest}
                      className="ml-2 underline hover:no-underline"
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
        <div className={`bg-red-50 border-l-4 border-red-400 p-4 relative z-10 ${isMobile ? 'mt-16' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Unable to load pandals:</strong> {pandalsError}
                  <button
                    onClick={refetch}
                    className="ml-2 underline hover:no-underline"
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
      <main className={`${isMobile ? 'pt-16' : ''} ${locationError && locationPromptDismissed && isMobile ? 'pt-32' : ''}`}>
        {/* Desktop Filters */}
        {!isMobile && (
          <div className="container mx-auto px-4 py-6 relative z-10">
            <FilterBar
              filters={filters}
              onFiltersChange={updateFilters}
              onSearch={updateSearchQuery}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Content based on view mode */}
        {isMobile || viewMode === 'map' ? (
          <MapView
            filteredPandals={filteredPandals}
            userLocation={userLocation}
            selectedPandal={selectedPandal}
            isMobile={isMobile}
            onPandalClick={handlePandalClick}
            onViewDetails={handleViewDetails}
            onGetDirections={handleGetDirections}
          />
        ) : (
          <GridListView
            viewMode={viewMode}
            visiblePandals={desktopVisiblePandals}
            totalCount={filteredPandals.length}
            visibleCount={desktopVisibleCount}
            loadMoreRef={desktopLoadMoreRef}
            onGetDirections={handleGetDirections}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Desktop Stats */}
        {!isMobile && (
          <StatsSection
            filteredPandals={filteredPandals}
            userLocation={userLocation}
          />
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

      {/* Desktop Footer */}
      {!isMobile && (
        <footer className="bg-white border-t border-gray-200 mt-12 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                <strong>Durga Puja Pandal Finder</strong> - Discover the best pandals in your area
              </p>
              <p className="text-sm">
                Built with ❤️ By Raj
              </p>
              <div className="mt-4 flex justify-center items-center gap-4 text-sm">
                <span>🙏 শুভ দুর্গা পূজা</span>
                <span>•</span>
                <span>Made with ❤️ for the community</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}