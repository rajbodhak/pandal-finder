import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';

export async function GET(
    request: NextRequest,
    { params }: { params: { area: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '25');
        const minRating = searchParams.get('minRating');
        const crowdLevels = searchParams.get('crowdLevels')?.split(',');

        const queries = [
            Query.equal('area', params.area),
            Query.orderDesc('rating'),
            Query.limit(limit)
        ];

        // Add optional filters
        if (minRating) {
            queries.push(Query.greaterThan('rating', parseFloat(minRating)));
        }

        if (crowdLevels && crowdLevels.length > 0) {
            queries.push(Query.equal('crowd_level', crowdLevels));
        }

        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            queries
        );

        return NextResponse.json({
            documents: response.documents,
            total: response.total
        });
    } catch (error) {
        console.error('Error fetching pandals by area:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pandals' },
            { status: 500 }
        );
    }
}