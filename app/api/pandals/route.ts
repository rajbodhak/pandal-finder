import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';

export async function GET(request: NextRequest) {
    try {
        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.orderDesc('created_at'),
                Query.limit(1000)
            ]
        );

        return NextResponse.json({
            documents: response.documents,
            total: response.total
        });
    } catch (error) {
        console.error('Error fetching pandals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pandals' },
            { status: 500 }
        );
    }
}