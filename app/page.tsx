// app/page.tsx
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Grid, List } from 'lucide-react';
import dynamic from 'next/dynamic';

// Components
import { PandalCard } from '@/components/PandalCard';
import { FilterBar } from '@/components/FilterBar';
import { PandalDetails } from '@/components/PandalDetails';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
// Dynamic imports to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent').then(mod => ({ default: mod.MapComponent })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />
});

// Hooks and utilities
import { useGeolocation } from '@/hooks/useGeoLocation';
import { usePandals } from '@/hooks/usePandals';
import { FilterOptions, PandalWithDistance } from '@/lib/types';
import { generateRouteUrl } from '@/lib/utils';

export default function PandalFinderPage() {
  // State management
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'distance',
    category: '',
    maxDistance: undefined,
    minRating: undefined,
    crowdLevel: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPandal, setSelectedPandal] = useState<PandalWithDistance | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map');
  const [isMobile, setIsMobile] = useState(false);

  // Custom hooks
  const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const { pandals, loading: pandalsLoading, error: pandalsError, refetch } = usePandals(userLocation, filters);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter pandals based on search query
  const filteredPandals = useMemo(() => {
    if (!searchQuery.trim()) return pandals;

    const query = searchQuery.toLowerCase();
    return pandals.filter(pandal =>
      pandal.name.toLowerCase().includes(query) ||
      pandal.address.toLowerCase().includes(query) ||
      pandal.description.toLowerCase().includes(query) ||
      pandal.organizer?.toLowerCase().includes(query)
    );
  }, [pandals, searchQuery]);

  // Event handlers
  const handlePandalClick = (pandal: PandalWithDistance) => {
    setSelectedPandal(pandal);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleViewDetails = (pandal: PandalWithDistance) => {
    setSelectedPandal(pandal);
    setShowDetails(true);
  };

  const handleGetDirections = (pandal: PandalWithDistance) => {
    if (!userLocation) {
      alert('Location permission required for directions');
      return;
    }

    const url = generateRouteUrl(userLocation, {
      latitude: pandal.latitude,
      longitude: pandal.longitude
    });
    window.open(url, '_blank');
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPandal(null);
  };

  // Loading states
  if (locationLoading || pandalsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Finding pandals near you..." />
        </div>
      </div>
    );
  }

  // Error states
  if (pandalsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={pandalsError} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 text-white p-2 rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Durga Puja Pandal Finder</h1>
                <p className="text-sm text-gray-600">
                  {filteredPandals.length} pandals found
                  {userLocation && ' near you'}
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'map'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Location Error Warning */}
      {locationError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="container mx-auto px-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Location access denied:</strong> {locationError}.
                  Distance calculation and directions may not work properly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Content based on view mode */}
        {viewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-96 lg:h-[600px]">
                  <MapComponent
                    pandals={filteredPandals}
                    userLocation={userLocation}
                    onPandalClick={handlePandalClick}
                    selectedPandal={selectedPandal}
                  />
                </div>
              </div>
            </div>

            {/* Selected Pandal Info (Desktop) */}
            <div className="lg:col-span-1">
              {selectedPandal ? (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <PandalCard
                    pandal={selectedPandal}
                    onGetDirections={handleGetDirections}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Click on a pandal marker to see details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grid/List View */
          <div className={`
            ${viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }
          `}>
            {filteredPandals.length > 0 ? (
              filteredPandals.map(pandal => (
                <div key={pandal.$id} className={viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}>
                  <PandalCard
                    pandal={pandal}
                    onGetDirections={handleGetDirections}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pandals found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms to find more pandals.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{filteredPandals.length}</div>
            <div className="text-sm text-gray-600">Total Pandals</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {filteredPandals.filter(p => (p.rating ?? 0) >= 4.5).length} TODO:
            </div>
            <div className="text-sm text-gray-600">Highly Rated</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {userLocation ? filteredPandals.filter(p => p.distance && p.distance <= 5).length : '-'}
            </div>
            <div className="text-sm text-gray-600">Within 5km</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {filteredPandals.filter(p => p.crowd_level === 'low').length}
            </div>
            <div className="text-sm text-gray-600">Low Crowd</div>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetails && selectedPandal && (
        <PandalDetails
          pandal={selectedPandal}
          userLocation={userLocation}
          onClose={handleCloseDetails}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>Durga Puja Pandal Finder</strong> - Discover the best pandals in your area
            </p>
            <p className="text-sm">
              Built with Next.js, TypeScript, Tailwind CSS, Leaflet.js & Appwrite
            </p>
            <div className="mt-4 flex justify-center items-center gap-4 text-sm">
              <span>🙏 শুভ দুর্গা পূজা</span>
              <span>•</span>
              <span>Made with ❤️ for the community</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// // Optional: Add keyboard shortcuts
// export const useKeyboar