import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { FilterOptions } from '@/lib/types';

interface FilterBarProps {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    onSearch: (query: string) => void;
    searchQuery: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    onFiltersChange,
    onSearch,
    searchQuery
}) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const sortOptions = [
        { value: 'distance', label: 'Nearest First' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'name', label: 'Alphabetical' }
    ];

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        { value: 'traditional', label: 'Traditional' },
        { value: 'modern', label: 'Modern' },
        { value: 'theme-based', label: 'Theme Based' }
    ];

    const areaOptions = [
        { value: 'north_kolkata', label: 'North Kolkata' },
        { value: 'south_kolkata', label: 'South Kolkata' },
        { value: 'central_kolkata', label: 'Central Kolkata' },
        { value: 'salt_lake', label: 'Salt Lake' },
        { value: 'new_town', label: 'New Town' },
        { value: 'howrah', label: 'Howrah' },
        { value: 'other', label: 'Other Areas' }
    ];

    const crowdLevelOptions = [
        { value: 'low', label: 'Low Crowd' },
        { value: 'medium', label: 'Medium Crowd' },
        { value: 'high', label: 'High Crowd' }
    ];

    const clearFilters = () => {
        onFiltersChange({
            sortBy: 'distance',
            area: [],
            category: '',
            maxDistance: undefined,
            minRating: undefined,
            crowdLevel: []
        });
        onSearch('');
    };

    const hasActiveFilters =
        filters.area?.length ||
        filters.category ||
        filters.maxDistance ||
        filters.minRating ||
        filters.crowdLevel?.length ||
        searchQuery;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            {/* Main Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search pandals..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Sort Dropdown */}
                <select
                    value={filters.sortBy}
                    onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })}
                    className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Advanced Filters Toggle */}
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showAdvancedFilters
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Area Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {areaOptions.map(option => (
                                    <label key={option.value} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.area?.includes(option.value) || false}
                                            onChange={(e) => {
                                                const currentAreas = filters.area || [];
                                                const newAreas = e.target.checked
                                                    ? [...currentAreas, option.value]
                                                    : currentAreas.filter(area => area !== option.value);
                                                onFiltersChange({ ...filters, area: newAreas });
                                            }}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Max Distance */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Distance ({filters.maxDistance ? `${filters.maxDistance}km` : 'Any'})
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                value={filters.maxDistance || 50}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    maxDistance: e.target.value === '50' ? undefined : Number(e.target.value)
                                })}
                                className="w-full accent-blue-600"
                            />
                        </div>

                        {/* Min Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Rating ({filters.minRating ? `${filters.minRating}+` : 'Any'})
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="0.5"
                                value={filters.minRating || 0}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    minRating: e.target.value === '0' ? undefined : Number(e.target.value)
                                })}
                                className="w-full accent-blue-600"
                            />
                        </div>
                    </div>

                    {/* Second Row for Crowd Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Crowd Level</label>
                            <div className="space-y-2">
                                {crowdLevelOptions.map(option => (
                                    <label key={option.value} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.crowdLevel?.includes(option.value) || false}
                                            onChange={(e) => {
                                                const currentLevels = filters.crowdLevel || [];
                                                const newLevels = e.target.checked
                                                    ? [...currentLevels, option.value]
                                                    : currentLevels.filter(level => level !== option.value);
                                                onFiltersChange({ ...filters, crowdLevel: newLevels });
                                            }}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};