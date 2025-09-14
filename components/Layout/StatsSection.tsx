'use client';
import React from 'react';
import { PandalWithDistance, UserLocation } from '@/lib/types';
import { MapPin, Star, Navigation, Users } from 'lucide-react';

interface StatsSectionProps {
    filteredPandals: PandalWithDistance[];
    userLocation: UserLocation | null;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ filteredPandals, userLocation }) => {
    const stats = [
        {
            value: filteredPandals.length,
            label: 'Total Pandals',
            icon: MapPin,
            gradient: 'from-orange-500 to-pink-500',
            bgGradient: 'from-orange-50 to-pink-50',
            darkBgGradient: 'dark:from-orange-950/30 dark:to-pink-950/30',
            textColor: 'text-orange-600 dark:text-orange-400'
        },
        {
            value: filteredPandals.filter(p => (p.rating ?? 0) >= 4.5).length,
            label: 'Highly Rated',
            icon: Star,
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50',
            darkBgGradient: 'dark:from-emerald-950/30 dark:to-teal-950/30',
            textColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            value: userLocation ? filteredPandals.filter(p => p.distance && p.distance <= 5).length : '-',
            label: 'Within 5km',
            icon: Navigation,
            gradient: 'from-blue-500 to-indigo-500',
            bgGradient: 'from-blue-50 to-indigo-50',
            darkBgGradient: 'dark:from-blue-950/30 dark:to-indigo-950/30',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            value: filteredPandals.filter(p => p.crowd_level === 'low').length,
            label: 'Low Crowd',
            icon: Users,
            gradient: 'from-purple-500 to-violet-500',
            bgGradient: 'from-purple-50 to-violet-50',
            darkBgGradient: 'dark:from-purple-950/30 dark:to-violet-950/30',
            textColor: 'text-purple-600 dark:text-purple-400'
        }
    ];

    return (
        <div className="container mx-auto px-4 mt-8 md:mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} ${stat.darkBgGradient} backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 dark:border-gray-700/20`}
                        >
                            {/* Animated background gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-6 h-6" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className={`text-3xl font-bold ${stat.textColor} mb-1 group-hover:scale-105 transition-transform duration-300`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {stat.label}
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-500" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};