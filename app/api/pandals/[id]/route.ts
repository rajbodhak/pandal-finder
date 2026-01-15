import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID } from '@/lib/appwrite-server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const pandal = await serverDatabases.getDocument(
            DATABASE_ID,
            COLLECTION_ID,
            params.id
        );

        return NextResponse.json(pandal);
    } catch (error) {
        console.error('Error fetching pandal:', error);
        return NextResponse.json(
            { error: 'Pandal not found' },
            { status: 404 }
        );
    }
}