import { pageViewService as appwriteService } from './appwritePageViewService';
import type { PageViewStats, ViewTrackingResponse } from '@/lib/pageViews';

interface LocalPageViewData {
    totalViews: number;
    dailyViews: Record<string, number>;
    lastViewAt: string;
    createdAt: string;
}

export class HybridPageViewService {
    private static instance: HybridPageViewService;
    private readonly STORAGE_PREFIX = 'pageviews_';
    private useAppwrite = true;

    private constructor() { }

    public static getInstance(): HybridPageViewService {
        if (!HybridPageViewService.instance) {
            HybridPageViewService.instance = new HybridPageViewService();
        }
        return HybridPageViewService.instance;
    }


    // Check if localStorage is available
    private isLocalStorageAvailable(): boolean {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    //Get Todays Date String
    private getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    }

    // Get local storage data for a page
    private getLocalData(pageId: string): LocalPageViewData | null {
        if (!this.isLocalStorageAvailable()) return null;

        try {
            const data = localStorage.getItem(`${this.STORAGE_PREFIX}${pageId}`);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    //Save data to local storage
    private saveLocalData(pageId: string, data: LocalPageViewData): boolean {
        if (!this.isLocalStorageAvailable()) return false;

        try {
            localStorage.setItem(`${this.STORAGE_PREFIX}${pageId}`, JSON.stringify(data));
            return true;
        } catch {
            return false;
        }
    }

    // Calculate Stats from local data
    private calculateLocalStats(data: LocalPageViewData): PageViewStats {
        const today = this.getTodayString();
        const todayViews = data.dailyViews[today] || 0;

        // Calculate week and month views
        let weekViews = 0;
        let monthViews = 0;
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        Object.entries(data.dailyViews).forEach(([dateStr, count]) => {
            const date = new Date(dateStr);
            if (date >= weekAgo) weekViews += count;
            if (date >= monthAgo) monthViews += count;
        });

        return {
            totalViews: data.totalViews,
            todayViews,
            weekViews,
            monthViews,
            lastViewAt: data.lastViewAt ? new Date(data.lastViewAt) : null
        };
    }

    //Track page view with Appwrite primary, localStorage fallback
    public async trackPageView(pageId: string): Promise<ViewTrackingResponse> {
        // Try Appwrite first
        if (this.useAppwrite) {
            try {
                const result = await appwriteService.trackPageView(pageId);
                if (result.success) {
                    return result;
                }

                // If Appwrite fails, fall back to localStorage for this session
                console.warn('Appwrite tracking failed, falling back to localStorage:', result.error);
                this.useAppwrite = false;
            } catch (error) {
                console.warn('Appwrite service unavailable, using localStorage fallback');
                this.useAppwrite = false;
            }
        }

        // localStorage fallback
        return this.trackPageViewLocally(pageId);
    }

    //Track page view locally

    private trackPageViewLocally(pageId: string): ViewTrackingResponse {
        try {
            const today = this.getTodayString();
            const now = new Date().toISOString();

            let data = this.getLocalData(pageId);

            if (!data) {
                // Create new local data
                data = {
                    totalViews: 1,
                    dailyViews: { [today]: 1 },
                    lastViewAt: now,
                    createdAt: now
                };
            } else {
                // Update existing data
                data.totalViews += 1;
                data.dailyViews[today] = (data.dailyViews[today] || 0) + 1;
                data.lastViewAt = now;

                // Clean up old daily views (keep last 90 days)
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - 90);
                const cutoffString = cutoffDate.toISOString().split('T')[0];

                Object.keys(data.dailyViews).forEach(date => {
                    if (date < cutoffString) {
                        delete data?.dailyViews[date];
                    }
                });
            }

            const saved = this.saveLocalData(pageId, data);

            if (saved) {
                const stats = this.calculateLocalStats(data);
                return { success: true, stats };
            } else {
                return { success: false, error: 'Failed to save to localStorage' };
            }

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }


    // Get page view stats

    public async getPageViewStats(pageId: string): Promise<ViewTrackingResponse> {
        // Try Appwrite first
        if (this.useAppwrite) {
            try {
                const result = await appwriteService.getPageViewStats(pageId);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.warn('Appwrite stats unavailable, using localStorage');
                this.useAppwrite = false;
            }
        }

        // localStorage fallback
        const data = this.getLocalData(pageId);
        if (data) {
            const stats = this.calculateLocalStats(data);
            return { success: true, stats };
        }

        // No data found anywhere
        return {
            success: true,
            stats: {
                totalViews: 0,
                todayViews: 0,
                weekViews: 0,
                monthViews: 0,
                lastViewAt: null
            }
        };
    }

    // Sync local data to Appwrite when connection is restored

    public async syncLocalDataToAppwrite(): Promise<{ success: boolean; syncedPages: number }> {
        if (!this.isLocalStorageAvailable()) {
            return { success: false, syncedPages: 0 };
        }

        let syncedPages = 0;

        try {
            // Get all local page view data
            const localPages: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.STORAGE_PREFIX)) {
                    const pageId = key.replace(this.STORAGE_PREFIX, '');
                    localPages.push(pageId);
                }
            }

            // Sync each page
            for (const pageId of localPages) {
                const localData = this.getLocalData(pageId);
                if (!localData) continue;

                try {
                    // Get current Appwrite data
                    const appwriteResult = await appwriteService.getPageViewStats(pageId);

                    if (appwriteResult.success && appwriteResult.stats) {
                        // Merge data: take the higher total views
                        const localStats = this.calculateLocalStats(localData);

                        if (localStats.totalViews > appwriteResult.stats.totalViews) {
                            // Local data is ahead, sync multiple views
                            const viewsToSync = localStats.totalViews - appwriteResult.stats.totalViews;

                            for (let i = 0; i < viewsToSync; i++) {
                                await appwriteService.trackPageView(pageId);
                            }
                        }
                    } else {
                        // No Appwrite data, sync all local views
                        for (let i = 0; i < localData.totalViews; i++) {
                            await appwriteService.trackPageView(pageId);
                        }
                    }

                    syncedPages++;

                    // Clear local data after successful sync
                    localStorage.removeItem(`${this.STORAGE_PREFIX}${pageId}`);

                } catch (error) {
                    console.error(`Failed to sync page ${pageId}:`, error);
                }
            }

            // Re-enable Appwrite after successful sync
            this.useAppwrite = true;

            return { success: true, syncedPages };

        } catch (error) {
            console.error('Failed to sync local data:', error);
            return { success: false, syncedPages };
        }
    }

    /**
     * Get service status
     */
    public getServiceStatus(): {
        appwriteEnabled: boolean;
        localStorageAvailable: boolean;
        hasLocalData: boolean;
        localDataCount: number;
    } {
        const hasLocalStorage = this.isLocalStorageAvailable();
        let localDataCount = 0;

        if (hasLocalStorage) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.STORAGE_PREFIX)) {
                    localDataCount++;
                }
            }
        }

        return {
            appwriteEnabled: this.useAppwrite,
            localStorageAvailable: hasLocalStorage,
            hasLocalData: localDataCount > 0,
            localDataCount
        };
    }
}

// Export singleton instance
export const hybridPageViewService = HybridPageViewService.getInstance();