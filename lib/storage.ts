interface StorageItem<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

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

export class BrowserStorageService {
    private static instance: BrowserStorageService;
    private readonly STORAGE_PREFIX = 'pandal_visit_';
    private readonly DEFAULT_EXPIRY_DAYS = 30;
    private readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;
    private cleanupTimer: NodeJS.Timeout | null = null;

    private constructor() {
        // Only initialize browser-specific features when in browser
        if (typeof window !== 'undefined') {
            this.initializeAutoCleanup();
            this.migrateOldData();
        }
    }

    public static getInstance(): BrowserStorageService {
        if (!BrowserStorageService.instance) {
            BrowserStorageService.instance = new BrowserStorageService();
        }
        return BrowserStorageService.instance;
    }

    /**
     * Check if browser storage is available
     */
    private isStorageAvailable(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    /**
    * Initialize automatic cleanup process
    */
    private initializeAutoCleanup(): void {
        // Skip cleanup initialization if we're not in a browser environment
        if (typeof window === 'undefined' || !this.isStorageAvailable()) {
            return;
        }

        // Initial cleanup
        this.cleanupExpiredData();

        // Set up periodic cleanup
        this.cleanupTimer = setInterval(() => {
            this.cleanupExpiredData();
        }, this.CLEANUP_INTERVAL);
    }

    /**
    * Migrate any existing data to new format
    */
    private migrateOldData(): void {
        // Skip migration if we're not in a browser environment
        if (typeof window === 'undefined' || !this.isStorageAvailable()) {
            return;
        }

        try {
            // Check for old format data and migrate if needed
            const oldProgress = localStorage.getItem('pandalProgress');
            if (oldProgress && !this.getItem<UserProgress>('userProgress')) {
                const parsed = JSON.parse(oldProgress);
                this.initializeUserProgress(parsed);
                localStorage.removeItem('pandalProgress');
            }
        } catch (error) {
            console.warn('Failed to migrate old data:', error);
        }
    }

    /**
     * Set item with automatic expiration
     */
    private setItem<T>(key: string, data: T, expiryDays: number = this.DEFAULT_EXPIRY_DAYS): boolean {
        if (!this.isStorageAvailable()) return false;

        try {
            const now = Date.now();
            const expiresAt = now + (expiryDays * 24 * 60 * 60 * 1000);

            const storageItem: StorageItem<T> = {
                data,
                timestamp: now,
                expiresAt
            };

            localStorage.setItem(
                `${this.STORAGE_PREFIX}${key}`,
                JSON.stringify(storageItem, this.replacer)
            );
            return true;
        } catch (error) {
            console.error('Failed to save to storage:', error);
            return false;
        }
    }

    /**
     * Get item and check expiration
     */
    private getItem<T>(key: string): T | null {
        if (!this.isStorageAvailable()) return null;

        try {
            const item = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
            if (!item) return null;

            const storageItem: StorageItem<T> = JSON.parse(item, this.reviver);

            // Check if expired
            if (Date.now() > storageItem.expiresAt) {
                this.removeItem(key);
                return null;
            }

            return storageItem.data;
        } catch (error) {
            console.error('Failed to read from storage:', error);
            return null;
        }
    }

    /**
     * Remove specific item
     */
    private removeItem(key: string): void {
        if (!this.isStorageAvailable()) return;
        localStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);
    }

    /**
     * Custom JSON replacer to handle Sets and other special objects
     */
    private replacer(key: string, value: any): any {
        if (value instanceof Set) {
            return {
                __type: 'Set',
                __data: Array.from(value)
            };
        }
        return value;
    }

    /**
     * Custom JSON reviver to restore Sets and other special objects
     */
    private reviver(key: string, value: any): any {
        if (value && value.__type === 'Set') {
            return new Set(value.__data);
        }
        return value;
    }

    /**
     * Clean up expired data
     */
    private cleanupExpiredData(): void {
        if (!this.isStorageAvailable()) return;

        try {
            const now = Date.now();
            const keysToRemove: string[] = [];

            // Check all storage keys with our prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.STORAGE_PREFIX)) {
                    try {
                        const item = localStorage.getItem(key);
                        if (item) {
                            const storageItem: StorageItem<any> = JSON.parse(item);
                            if (now > storageItem.expiresAt) {
                                keysToRemove.push(key);
                            }
                        }
                    } catch {
                        // If parsing fails, remove the corrupted item
                        keysToRemove.push(key);
                    }
                }
            }

            // Remove expired items
            keysToRemove.forEach(key => localStorage.removeItem(key));

            if (keysToRemove.length > 0) {
            }
        } catch (error) {
            console.error('Failed to cleanup expired data:', error);
        }
    }

    /**
     * Initialize user progress if it doesn't exist
     */
    public initializeUserProgress(existingData?: Partial<UserProgress>): UserProgress {
        const defaultProgress: UserProgress = {
            visitedPandals: new Set<string>(),
            completedRoutes: [],
            routeProgress: {},
            stats: {
                totalPandalsVisited: 0,
                totalRoutesCompleted: 0,
                favoriteArea: null,
                longestStreak: 0,
                currentStreak: 0,
                lastVisitDate: 0
            },
            preferences: {
                favoriteTransportMode: 'walk',
                preferredVisitTime: 'evening',
                crowdTolerance: 'medium'
            }
        };

        // Merge with existing data if provided
        const progress = existingData ? { ...defaultProgress, ...existingData } : defaultProgress;

        // Ensure Sets are properly initialized
        if (!(progress.visitedPandals instanceof Set)) {
            progress.visitedPandals = new Set(progress.visitedPandals || []);
        }

        // Ensure route progress has proper Sets
        Object.keys(progress.routeProgress).forEach(routeId => {
            if (!(progress.routeProgress[routeId].completedSteps instanceof Set)) {
                progress.routeProgress[routeId].completedSteps = new Set(progress.routeProgress[routeId].completedSteps || []);
            }
        });

        this.setItem('userProgress', progress);
        return progress;
    }

    /**
     * Get user progress
     */
    public getUserProgress(): UserProgress {
        const progress = this.getItem<UserProgress>('userProgress');
        return progress || this.initializeUserProgress();
    }

    /**
     * Update user progress
     */
    public updateUserProgress(updates: Partial<UserProgress>): boolean {
        const currentProgress = this.getUserProgress();
        const updatedProgress = { ...currentProgress, ...updates };
        return this.setItem('userProgress', updatedProgress);
    }

    /**
     * Mark pandal as visited
     */
    public markPandalVisited(pandalId: string, area?: string): boolean {
        const progress = this.getUserProgress();

        if (!progress.visitedPandals.has(pandalId)) {
            progress.visitedPandals.add(pandalId);
            progress.stats.totalPandalsVisited++;
            progress.stats.lastVisitDate = Date.now();

            // Update streak
            const today = new Date().toDateString();
            const lastVisit = new Date(progress.stats.lastVisitDate).toDateString();

            if (today === lastVisit) {
                progress.stats.currentStreak++;
            } else {
                progress.stats.currentStreak = 1;
            }

            progress.stats.longestStreak = Math.max(
                progress.stats.longestStreak,
                progress.stats.currentStreak
            );

            // Update favorite area
            if (area && !progress.stats.favoriteArea) {
                progress.stats.favoriteArea = area;
            }

            return this.setItem('userProgress', progress);
        }

        return true;
    }

    /**
     * Unmark pandal as visited (remove from visited list)
    */
    public unmarkPandalVisited(pandalId: string): boolean {
        const progress = this.getUserProgress();

        if (progress.visitedPandals.has(pandalId)) {
            progress.visitedPandals.delete(pandalId);
            progress.stats.totalPandalsVisited = Math.max(0, progress.stats.totalPandalsVisited - 1);

            return this.setItem('userProgress', progress);
        }

        return true;
    }

    /**
     * Update route progress
     */
    public updateRouteProgress(routeId: string, completedSteps: Set<string>): boolean {
        const progress = this.getUserProgress();
        const now = Date.now();

        if (!progress.routeProgress[routeId]) {
            progress.routeProgress[routeId] = {
                completedSteps: new Set(),
                startedAt: now,
                lastUpdated: now
            };
        }

        progress.routeProgress[routeId].completedSteps = completedSteps;
        progress.routeProgress[routeId].lastUpdated = now;

        return this.setItem('userProgress', progress);
    }

    /**
     * Mark route as completed
     */
    public markRouteCompleted(routeId: string): boolean {
        const progress = this.getUserProgress();

        if (!progress.completedRoutes.includes(routeId)) {
            progress.completedRoutes.push(routeId);
            progress.stats.totalRoutesCompleted++;
        }

        return this.setItem('userProgress', progress);
    }

    /**
     * Clear all stored data
     */
    public clearAllData(): boolean {
        if (!this.isStorageAvailable()) return false;

        try {
            const keysToRemove: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.STORAGE_PREFIX)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }

    /**
     * Export user data (for backup/transfer)
     */
    public exportUserData(): string | null {
        try {
            const progress = this.getUserProgress();
            return JSON.stringify(progress, this.replacer, 2);
        } catch (error) {
            console.error('Failed to export user data:', error);
            return null;
        }
    }

    /**
     * Import user data (from backup)
     */
    public importUserData(jsonData: string): boolean {
        try {
            const data = JSON.parse(jsonData, this.reviver);
            return this.setItem('userProgress', data);
        } catch (error) {
            console.error('Failed to import user data:', error);
            return false;
        }
    }

    /**
     * Cleanup on destroy
     */
    public destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }
}

// Export singleton instance
let storageService: BrowserStorageService;

if (typeof window !== 'undefined') {
    storageService = BrowserStorageService.getInstance();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        storageService.destroy();
    });
}

export { storageService };