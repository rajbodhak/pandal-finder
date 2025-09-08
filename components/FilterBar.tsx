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
        { value: 'name', label: 'Alphabetical' },
    ];

    const areaOptions = [
        { value: 'north_kolkata', label: 'North Kolkata' },
        { value: 'south_kolkata', label: 'South Kolkata' },
        { value: 'central_kolkata', label: 'Central Kolkata' },
        { value: 'kalyani', label: 'Kalyani' }
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
        <div className="bg-transparent rounded-lg border border-gray-200 dark:border-gray-700 p-2 md:p-3 relative">
            {/* Main Filter Row */}
            <div className="flex gap-2">
                {/* Search Bar */}
                <div className="hidden md:flex flex-1 relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 w-3 h-3 z-10" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="flex-1 md:flex-1 relative">
                    <Listbox
                        value={filters.sortBy}
                        onChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
                    >
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-1.5 pl-2 pr-6 text-left text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all">
                                <span className="truncate">
                                    {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Sort by'}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                                    <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                                </span>
                            </Listbox.Button>

                            <div className="absolute left-0 right-0 z-10">
                                <Listbox.Options className="mt-1 max-h-48 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-xs shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-gray-200 dark:border-gray-700 focus:outline-none">
                                    {sortOptions.map((option) => (
                                        <Listbox.Option
                                            key={option.value}
                                            value={option.value}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-1.5 pl-7 pr-2 transition-all ${active ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`truncate ${selected ? 'font-semibold text-orange-600 dark:text-orange-400' : 'font-normal'}`}>
                                                        {option.label}
                                                    </span>
                                                    {selected && (
                                                        <span className="absolute left-2 inset-y-0 flex items-center text-orange-600 dark:text-orange-400">
                                                            <Check className="w-3 h-3" />
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
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all text-xs ${showAdvancedFilters
                        ? 'bg-orange-100 dark:bg-orange-950/70 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                        }`}
                >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span className="hidden sm:inline">Filters</span>
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-2 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-gray-800 transition-all text-xs"
                    >
                        <X className="w-3 h-3" />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Area */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Area</label>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                                <div className="grid grid-cols-2 gap-1">
                                    {areaOptions.map((option) => (
                                        <label key={option.value} className="flex items-center cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded p-1 transition-all">
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
                                                className="rounded text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600 w-3 h-3"
                                            />
                                            <span className="ml-1.5 text-xs text-gray-700 dark:text-gray-300">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};