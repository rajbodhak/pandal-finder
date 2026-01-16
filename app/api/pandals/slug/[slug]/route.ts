import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('slug', params.slug),
                Query.limit(1)
            ]
        );

        if (response.documents.length === 0) {
            return NextResponse.json(
                { error: 'Pandal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(response.documents[0]);
    } catch (error) {
        console.error('Error fetching pandal by slug:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pandal' },
            { status: 500 }
        );
    }
}