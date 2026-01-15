import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                { error: 'Search query is required' },
                { status: 400 }
            );
        }

        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.or([
                    Query.search('name', query),
                    Query.search('description', query),
                    Query.search('address', query)
                ])
            ]
        );

        return NextResponse.json({
            documents: response.documents,
            total: response.total
        });
    } catch (error) {
        console.error('Error searching pandals:', error);
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        );
    }
}