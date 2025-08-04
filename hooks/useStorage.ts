// hooks/useStorage.ts
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/lib/storage';

interface UserProgress {
    visitedPandals: Set<string>;
    completedRoutes: string[];
    routeProgress: Record<string, {
        completedSteps: Set<string>;
        startedAt: number;
        lastUpdated: number;
    }>;
    stats: {
        totalPandalsVisited: number;
        totalRoutesCompleted: number;
        favoriteArea: string | null;
        longestStreak: number;
        currentStreak: number;
        lastVisitDate: number;
    };
    preferences: {
        favoriteTransportMode: string;
        preferredVisitTime: 'morning' | 'afternoon' | 'evening';
        crowdTolerance: 'low' | 'medium' | 'high';
    };
}

interface StorageStats {
    isAvailable: boolean;
    usedSpace: number;
    estimatedSize: string;
    itemCount: number;
    expiryDate: string;
}

export const useStorage = () => {
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [storageStats, setStorageStats] = useState<StorageStats | null>(null);

    // Initialize and load user progress
    useEffect(() => {
        try {
            const progress = storageService.getUserProgress();
            setUserProgress(progress);
            setStorageStats(storageService.getStorageStats());
        } catch (error) {
            console.error('Failed to load user progress:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Mark pandal as visited
    const markPandalVisited = useCallback((pandalId: string, area?: string) => {
        const success = storageService.markPandalVisited(pandalId, area);
        if (success) {
            const updatedProgress = storageService.getUserProgress();
            setUserProgress(updatedProgress);
            setStorageStats(storageService.getStorageStats());
        }
        return success;
    }, []);

    // Unmark pandal as visited
    const unmarkPandalVisited = useCallback((pandalId: string) => {
        const success = storageService.unmarkPandalVisited(pandalId);
        if (success) {
            const updatedProgress = storageService.getUserProgress();
            setUserProgress(updatedProgress);
            setStorageStats(storageService.getStorageStats());
        }
        return success;
    }, []);

    // Update route progress
    const updateRouteProgress = useCallback((routeId: string, completedSteps: Set<string>) => {
        const success = storageService.updateRouteProgress(routeId, completedSteps);
        if (success) {
            const updatedProgress = storageService.getUserProgress();
            setUserProgress(updatedProgress);
        }
        return success;
    }, []);

    // Mark route as completed
    const markRouteCompleted = useCallback((routeId: string) => {
        const success = storageService.markRouteCompleted(routeId);
        if (success) {
            const updatedProgress = storageService.getUserProgress();
            setUserProgress(updatedProgress);
            setStorageStats(storageService.getStorageStats());
        }
        return success;
    }, []);

    // Update user preferences
    const updatePreferences = useCallback((preferences: Partial<UserProgress['preferences']>) => {
        if (!userProgress) return false;

        const success = storageService.updateUserProgress({
            preferences: { ...userProgress.preferences, ...preferences }
        });

        if (success) {
            const updatedProgress = storageService.getUserProgress();
            setUserProgress(updatedProgress);
        }
        return success;
    }, [userProgress]);

    // Check if pandal is visited
    const isPandalVisited = useCallback((pandalId: string): boolean => {
        return userProgress?.visitedPandals.has(pandalId) ?? false;
    }, [userProgress]);

    // Check if route is completed
    const isRouteCompleted = useCallback((routeId: string): boolean => {
        return userProgress?.completedRoutes.includes(routeId) ?? false;
    }, [userProgress]);

    // Get route progress
    const getRouteProgress = useCallback((routeId: string) => {
        return userProgress?.routeProgress[routeId] ?? null;
    }, [userProgress]);

    // Get completion percentage for a route
    const getRouteCompletionPercentage = useCallback((routeId: string, totalSteps: number): number => {
        const progress = getRouteProgress(routeId);
        if (!progress) return 0;
        return Math.round((progress.completedSteps.size / totalSteps) * 100);
    }, [getRouteProgress]);

    // Clear all data
    const clearAllData = useCallback(() => {
        const success = storageService.clearAllData();
        if (success) {
            const freshProgress = storageService.getUserProgress();
            setUserProgress(freshProgress);
            setStorageStats(storageService.getStorageStats());
        }
        return success;
    }, []);

    // Export data
    const exportData = useCallback(() => {
        return storageService.exportUserData();
    }, []);

    // Import data
    const importData = useCallback((jsonData: string) => {
        const success = storageService.importUserData(jsonData);
        if (success) {
            const updatedProgress = storageService.getUserProgress();
            setUserProgress(updatedProgress);
            setStorageStats(storageService.getStorageStats());
        }
        return success;
    }, []);

    // Extend expiry
    const extendExpiry = useCallback((additionalDays: number = 30) => {
        const success = storageService.extendExpiry(additionalDays);
        if (success) {
            setStorageStats(storageService.getStorageStats());
        }
        return success;
    }, []);

    // Get visit streak info
    const getStreakInfo = useCallback(() => {
        if (!userProgress) return { current: 0, longest: 0, lastVisit: null };

        return {
            current: userProgress.stats.currentStreak,
            longest: userProgress.stats.longestStreak,
            lastVisit: userProgress.stats.lastVisitDate ? new Date(userProgress.stats.lastVisitDate) : null
        };
    }, [userProgress]);

    // Get favorite area
    const getFavoriteArea = useCallback(() => {
        return userProgress?.stats.favoriteArea ?? null;
    }, [userProgress]);

    // Get visiting stats
    const getVisitingStats = useCallback(() => {
        if (!userProgress) return null;

        return {
            totalPandalsVisited: userProgress.stats.totalPandalsVisited,
            totalRoutesCompleted: userProgress.stats.totalRoutesCompleted,
            favoriteArea: userProgress.stats.favoriteArea,
            currentStreak: userProgress.stats.currentStreak,
            longestStreak: userProgress.stats.longestStreak,
            lastVisitDate: userProgress.stats.lastVisitDate ? new Date(userProgress.stats.lastVisitDate) : null
        };
    }, [userProgress]);

    return {
        // Data
        userProgress,
        storageStats,
        isLoading,

        // Pandal methods
        markPandalVisited,
        isPandalVisited,

        // Route methods
        updateRouteProgress,
        markRouteCompleted,
        unmarkPandalVisited,
        isRouteCompleted,
        getRouteProgress,
        getRouteCompletionPercentage,

        // Preferences
        updatePreferences,

        // Stats and info
        getStreakInfo,
        getFavoriteArea,
        getVisitingStats,

        // Data management
        clearAllData,
        exportData,
        importData,
        extendExpiry
    };
};