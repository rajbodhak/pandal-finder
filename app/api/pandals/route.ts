import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query, ID } from '@/lib/appwrite-server';

// GET - List all pandals
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '100');

        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.orderDesc('rating'),
                Query.limit(limit)
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

// POST - Create new pandal
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const document = await serverDatabases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(), // Auto-generate ID
            {
                ...body,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        );

        return NextResponse.json(document, { status: 201 });
    } catch (error) {
        console.error('Error creating pandal:', error);
        return NextResponse.json(
            { error: 'Failed to create pandal' },
            { status: 500 }
        );
    }
}