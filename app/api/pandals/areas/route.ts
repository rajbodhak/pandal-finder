import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const areasParam = searchParams.get('areas');

        if (!areasParam) {
            return NextResponse.json(
                { error: 'Areas parameter is required' },
                { status: 400 }
            );
        }

        const areas = areasParam.split(',');
        const limit = parseInt(searchParams.get('limit') || '50');

        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('area', areas),
                Query.orderDesc('rating'),
                Query.limit(limit)
            ]
        );

        return NextResponse.json({
            documents: response.documents,
            total: response.total
        });
    } catch (error) {
        console.error('Error fetching pandals by areas:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pandals' },
            { status: 500 }
        );
    }
}