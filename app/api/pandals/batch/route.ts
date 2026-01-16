// app/api/pandals/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slugs } = body;

        if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
            return NextResponse.json(
                { error: 'slugs array is required' },
                { status: 400 }
            );
        }

        // Fetch all pandals with matching slugs in one query
        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('slug', slugs),
                Query.limit(100)
            ]
        );

        // Create a map for quick lookup
        const pandalMap = new Map(
            response.documents.map(doc => [doc.slug, doc])
        );

        // Return pandals in the same order as requested slugs
        const orderedPandals = slugs.map(slug => pandalMap.get(slug)).filter(Boolean);

        return NextResponse.json({
            documents: orderedPandals,
            total: orderedPandals.length,
            requested: slugs.length
        });
    } catch (error) {
        console.error('Error batch fetching pandals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pandals' },
            { status: 500 }
        );
    }
}