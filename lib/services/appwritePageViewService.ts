import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type {
    PageViewDocument,
    PageViewStats,
    ViewTrackingResponse
} from '@/lib/pageViews';

export class AppwritePageViewService {
    private static instance: AppwritePageViewService;
    private readonly DATABASE_ID: string;
    private readonly COLLECTION_ID: string;

    private constructor() {
        this.DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
        this.COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_VIEWS_COLLECTION_ID || '';

        if (!this.DATABASE_ID || !this.COLLECTION_ID) {
            console.warn('Appwrite database or collection ID not configured for page views');
        }
    }

    public static getInstance(): AppwritePageViewService {
        if (!AppwritePageViewService.instance) {
            AppwritePageViewService.instance = new AppwritePageViewService();
        }
        return AppwritePageViewService.instance;
    }

    // Get today's date in YYYY-MM-DD format
    private getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    }

    // Parse daily views string array into structured data
    private parseDailyViews(dailyViews: string[]): Map<string, number> {
        const viewMap = new Map<string, number>();

        dailyViews.forEach(entry => {
            try {
                const [date, countStr] = entry.split(':');
                const count = parseInt(countStr, 10);
                if (!isNaN(count)) {
                    viewMap.set(date, count);
                }
            } catch (error) {
                console.warn('Invalid daily view entry:', entry);
            }
        });

        return viewMap;
    }

    // Convert daily views map back to string array
    private serializeDailyViews(viewMap: Map<string, number>): string[] {
        return Array.from(viewMap.entries())
            .map(([date, count]) => `${date}:${count}`)
            .slice(-365); // Keep last 365 days
    }

    // Calculate stats from daily views
    private calculateStats(
        totalViews: number,
        dailyViews: string[],
        lastViewAt: string
    ): PageViewStats {
        const viewMap = this.parseDailyViews(dailyViews);
        const today = this.getTodayString();
        const todayViews = viewMap.get(today) || 0;

        // Calculate week views (last 7 days)
        let weekViews = 0;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Calculate month views (last 30 days)  
        let monthViews = 0;
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);

        viewMap.forEach((count, dateStr) => {
            const date = new Date(dateStr);
            if (date >= weekAgo) {
                weekViews += count;
            }
            if (date >= monthAgo) {
                monthViews += count;
            }
        });

        return {
            totalViews,
            todayViews,
            weekViews,
            monthViews,
            lastViewAt: lastViewAt ? new Date(lastViewAt) : null
        };
    }

    // Track a page view
    public async trackPageView(pageId: string): Promise<ViewTrackingResponse> {
        try {
            if (!this.DATABASE_ID || !this.COLLECTION_ID) {
                return {
                    success: false,
                    error: 'Appwrite configuration missing'
                };
            }

            const today = this.getTodayString();
            const now = new Date().toISOString();

            // Try to get existing document
            let document: PageViewDocument | null = null;

            try {
                const response = await databases.getDocument(
                    this.DATABASE_ID,
                    this.COLLECTION_ID,
                    pageId
                );
                document = response as unknown as PageViewDocument;
            } catch (error: any) {
                // Document doesn't exist, we'll create it
                if (error.code !== 404) {
                    throw error;
                }
            }

            if (document) {
                // Update existing document
                const viewMap = this.parseDailyViews(document.dailyViews);
                const currentTodayViews = viewMap.get(today) || 0;
                viewMap.set(today, currentTodayViews + 1);

                const updatedDocument = await databases.updateDocument(
                    this.DATABASE_ID,
                    this.COLLECTION_ID,
                    pageId,
                    {
                        totalViews: document.totalViews + 1,
                        dailyViews: this.serializeDailyViews(viewMap),
                        lastViewAt: now,
                        updatedAt: now
                    }
                ) as unknown as PageViewDocument;

                const stats = this.calculateStats(
                    updatedDocument.totalViews,
                    updatedDocument.dailyViews,
                    updatedDocument.lastViewAt
                );

                return { success: true, stats };

            } else {
                // Create new document
                const viewMap = new Map<string, number>();
                viewMap.set(today, 1);

                const newDocument = await databases.createDocument(
                    this.DATABASE_ID,
                    this.COLLECTION_ID,
                    pageId,
                    {
                        pageId,
                        totalViews: 1,
                        dailyViews: this.serializeDailyViews(viewMap),
                        lastViewAt: now,
                        createdAt: now,
                        updatedAt: now
                    }
                ) as unknown as PageViewDocument;

                const stats = this.calculateStats(
                    newDocument.totalViews,
                    newDocument.dailyViews,
                    newDocument.lastViewAt
                );

                return { success: true, stats };
            }

        } catch (error) {
            console.error('Failed to track page view:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Get page view stats without incrementing
    public async getPageViewStats(pageId: string): Promise<ViewTrackingResponse> {
        try {
            if (!this.DATABASE_ID || !this.COLLECTION_ID) {
                return {
                    success: false,
                    error: 'Appwrite configuration missing'
                };
            }

            const response = await databases.getDocument(
                this.DATABASE_ID,
                this.COLLECTION_ID,
                pageId
            );

            const document = response as unknown as PageViewDocument;
            const stats = this.calculateStats(
                document.totalViews,
                document.dailyViews,
                document.lastViewAt
            );

            return { success: true, stats };

        } catch (error: any) {
            if (error.code === 404) {
                // No views yet, return zero stats
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

            console.error('Failed to get page view stats:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Get stats for multiple pages
    public async getMultiplePageStats(pageIds: string[]): Promise<Record<string, PageViewStats>> {
        try {
            if (!this.DATABASE_ID || !this.COLLECTION_ID) {
                console.error('Appwrite configuration missing');
                return {};
            }

            const response = await databases.listDocuments(
                this.DATABASE_ID,
                this.COLLECTION_ID,
                [Query.equal('pageId', pageIds)]
            );

            const results: Record<string, PageViewStats> = {};

            // Initialize all pages with zero stats
            pageIds.forEach(pageId => {
                results[pageId] = {
                    totalViews: 0,
                    todayViews: 0,
                    weekViews: 0,
                    monthViews: 0,
                    lastViewAt: null
                };
            });

            // Update with actual data
            response.documents.forEach(doc => {
                const document = doc as unknown as PageViewDocument;
                results[document.pageId] = this.calculateStats(
                    document.totalViews,
                    document.dailyViews,
                    document.lastViewAt
                );
            });

            return results;

        } catch (error) {
            console.error('Failed to get multiple page stats:', error);
            return {};
        }
    }

    // Get top viewed pages
    public async getTopViewedPages(limit: number = 10): Promise<PageViewDocument[]> {
        try {
            if (!this.DATABASE_ID || !this.COLLECTION_ID) {
                return [];
            }

            const response = await databases.listDocuments(
                this.DATABASE_ID,
                this.COLLECTION_ID,
                [
                    Query.orderDesc('totalViews'),
                    Query.limit(limit)
                ]
            );

            return response.documents as unknown as PageViewDocument[];

        } catch (error) {
            console.error('Failed to get top viewed pages:', error);
            return [];
        }
    }
}

// Export singleton instance
export const pageViewService = AppwritePageViewService.getInstance();