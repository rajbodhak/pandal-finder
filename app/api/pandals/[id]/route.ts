import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID } from '@/lib/appwrite-server';

// GET - Fetch single pandal
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const pandal = await serverDatabases.getDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id
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

// PUT - Update pandal
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedDocument = await serverDatabases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id,
            {
                ...body,
                updated_at: new Date().toISOString()
            }
        );

        return NextResponse.json(updatedDocument);
    } catch (error) {
        console.error('Error updating pandal:', error);
        return NextResponse.json(
            { error: 'Failed to update pandal' },
            { status: 500 }
        );
    }
}

// DELETE - Delete pandal
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await serverDatabases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting pandal:', error);
        return NextResponse.json(
            { error: 'Failed to delete pandal' },
            { status: 500 }
        );
    }
}