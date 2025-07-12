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
        <div className="bg-transparent rounded-xl border border-gray-200 dark:border-gray-700 p-3 md:p-4 relative">
            {/* Main Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="hidden md:block flex-1 relative text-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 w-4 h-4 z-10" />
                    <input
                        type="text"
                        placeholder="Search pandals..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all shadow-sm hover:shadow-md"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="w-full sm:w-auto relative">
                    <Listbox
                        value={filters.sortBy}
                        onChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
                    >
                        <div className="relative">
                            <Listbox.Button className="relative w-full sm:min-w-[180px] cursor-pointer rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-4 pr-10 text-left text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all">
                                {
                                    sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Sort by'
                                }
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                </span>
                            </Listbox.Button>

                            <div className="absolute left-0 right-0">
                                <Listbox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-sm shadow-xl ring-1 ring-black/5 dark:ring-white/10 border border-gray-200 dark:border-gray-700 focus:outline-none">
                                    {sortOptions.map((option) => (
                                        <Listbox.Option
                                            key={option.value}
                                            value={option.value}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 transition-all ${active ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:scale-102 shadow-sm text-sm ${showAdvancedFilters
                        ? 'bg-orange-100 dark:bg-orange-950/70 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-gray-800 transition-all hover:scale-105 shadow-sm text-sm"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="mt-3 md:mt-4 pt-2 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Area</label>
                            <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                {areaOptions.map((option) => (
                                    <label key={option.value} className="flex items-center cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg p-1 transition-all">
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
                                            className="rounded text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600"
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