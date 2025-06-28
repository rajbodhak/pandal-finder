'use client';
import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, Check, ChevronDown } from 'lucide-react';
import { Listbox } from '@headlessui/react';
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
    searchQuery,
}) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const sortOptions = [
        { value: 'distance', label: 'Nearest First' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'name', label: 'Alphabetical' },
    ];

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        { value: 'traditional', label: 'Traditional' },
        { value: 'modern', label: 'Modern' },
        { value: 'theme-based', label: 'Theme Based' },
    ];

    const areaOptions = [
        { value: 'north_kolkata', label: 'North Kolkata' },
        { value: 'south_kolkata', label: 'South Kolkata' },
        { value: 'central_kolkata', label: 'Central Kolkata' },
        { value: 'salt_lake', label: 'Salt Lake' },
        { value: 'new_town', label: 'New Town' },
        { value: 'howrah', label: 'Howrah' },
        { value: 'other', label: 'Other Areas' },
    ];

    const crowdLevelOptions = [
        { value: 'low', label: 'Low Crowd' },
        { value: 'medium', label: 'Medium Crowd' },
        { value: 'high', label: 'High Crowd' },
    ];

    const clearFilters = () => {
        onFiltersChange({
            sortBy: 'distance',
            area: [],
            category: '',
            maxDistance: undefined,
            minRating: undefined,
            crowdLevel: [],
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 mb-4 relative">
            {/* Main Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 dark:text-orange-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search pandals..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-white/20 dark:border-gray-700/20 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 dark:focus:border-orange-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-orange-400/70 dark:placeholder-orange-300/70 transition-all shadow-lg"
                    />
                </div>

                {/* Sort Dropdown (Headless UI) */}
                <div className="w-full sm:w-auto relative">
                    <Listbox
                        value={filters.sortBy}
                        onChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
                    >
                        <div className="relative">
                            <Listbox.Button className="relative w-full sm:min-w-[180px] cursor-pointer rounded-xl border border-white/20 dark:border-gray-700/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-2 pl-4 pr-10 text-left text-sm text-gray-900 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 transition-all">
                                {
                                    sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Sort by'
                                }
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                                </span>
                            </Listbox.Button>

                            {/* Fixed dropdown positioning and z-index */}
                            <div className="absolute left-0 right-0 z-[100]">
                                <Listbox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 backdrop-blur-lg py-1 text-sm shadow-2xl ring-1 ring-black/5 dark:ring-white/10 border border-gray-200 dark:border-gray-700 focus:outline-none">
                                    {sortOptions.map((option) => (
                                        <Listbox.Option
                                            key={option.value}
                                            value={option.value}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 transition-all ${active ? 'bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/50 dark:to-pink-950/50 text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`${selected ? 'font-semibold text-orange-600 dark:text-orange-400' : 'font-normal'}`}>
                                                        {option.label}
                                                    </span>
                                                    {selected && (
                                                        <span className="absolute left-3 inset-y-0 flex items-center text-orange-600 dark:text-orange-400">
                                                            <Check className="w-4 h-4" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </div>
                    </Listbox>
                </div>

                {/* Advanced Filters Toggle */}
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all transform hover:scale-105 shadow-lg ${showAdvancedFilters
                        ? 'bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-950/70 dark:to-pink-950/70 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300'
                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/50 dark:hover:to-pink-950/50 rounded-xl border border-red-200 dark:border-red-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all transform hover:scale-105 shadow-lg"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="mt-4 pt-4 border-t border-white/20 dark:border-gray-700/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Area</label>
                            <div className="space-y-2 max-h-32 overflow-y-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20">
                                {areaOptions.map((option) => (
                                    <label key={option.value} className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/30 dark:hover:to-pink-950/30 rounded-lg p-1 transition-all">
                                        <input
                                            type="checkbox"
                                            checked={filters.area?.includes(option.value) || false}
                                            onChange={(e) => {
                                                const current = filters.area || [];
                                                const newVal = e.target.checked
                                                    ? [...current, option.value]
                                                    : current.filter((a) => a !== option.value);
                                                onFiltersChange({ ...filters, area: newVal });
                                            }}
                                            className="rounded text-orange-600 focus:ring-orange-500 border-orange-300 dark:border-orange-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) =>
                                    onFiltersChange({ ...filters, category: e.target.value || undefined })
                                }
                                className="w-full px-3 py-2 border border-white/20 dark:border-gray-700/20 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 dark:focus:border-orange-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white shadow-lg transition-all"
                            >
                                {categoryOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Max Distance */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Max Distance ({filters.maxDistance ? `${filters.maxDistance}km` : 'Any'})
                            </label>
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20">
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    step="1"
                                    value={filters.maxDistance || 50}
                                    onChange={(e) =>
                                        onFiltersChange({
                                            ...filters,
                                            maxDistance:
                                                e.target.value === '50' ? undefined : Number(e.target.value),
                                        })
                                    }
                                    className="w-full accent-orange-600 dark:accent-orange-500"
                                />
                            </div>
                        </div>

                        {/* Min Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Min Rating ({filters.minRating ? `${filters.minRating}+` : 'Any'})
                            </label>
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20">
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={filters.minRating || 0}
                                    onChange={(e) =>
                                        onFiltersChange({
                                            ...filters,
                                            minRating:
                                                e.target.value === '0' ? undefined : Number(e.target.value),
                                        })
                                    }
                                    className="w-full accent-orange-600 dark:accent-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Crowd Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Crowd Level</label>
                            <div className="space-y-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20">
                                {crowdLevelOptions.map((option) => (
                                    <label key={option.value} className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/30 dark:hover:to-pink-950/30 rounded-lg p-1 transition-all">
                                        <input
                                            type="checkbox"
                                            checked={filters.crowdLevel?.includes(option.value) || false}
                                            onChange={(e) => {
                                                const current = filters.crowdLevel || [];
                                                const newVal = e.target.checked
                                                    ? [...current, option.value]
                                                    : current.filter((a) => a !== option.value);
                                                onFiltersChange({ ...filters, crowdLevel: newVal });
                                            }}
                                            className="rounded text-orange-600 focus:ring-orange-500 border-orange-300 dark:border-orange-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
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