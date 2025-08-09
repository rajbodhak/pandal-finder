import { Models } from 'appwrite';

export interface PageViewDocument extends Models.Document {
    pageId: string;
    totalViews: number;
    dailyViews: string[]; // Array of dates in 'YYYY-MM-DD' format
    lastViewAt: string; // ISO datetime string
    createdAt: string; // ISO datetime string  
    updatedAt: string; // ISO datetime string
}

export interface PageViewStats {
    totalViews: number;
    todayViews: number;
    weekViews: number;
    monthViews: number;
    lastViewAt: Date | null;
}

export interface ViewTrackingResponse {
    success: boolean;
    stats?: PageViewStats;
    error?: string;
}

// Helper type for daily view tracking
export interface DailyViewEntry {
    date: string; // 'YYYY-MM-DD'
    count: number;
}

// Configuration for view tracking
export interface ViewTrackingConfig {
    maxDailyViewsHistory: number; // Maximum number of days to keep in dailyViews array
    enableRealTimeUpdates: boolean;
    trackUniqueViewsOnly: boolean; // If true, only track unique views per session
}