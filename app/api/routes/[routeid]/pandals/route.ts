import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';

// Import routes
import northKolkataRoutesData from '@/data/routes/north-kolkata.json';
import southKolkataRoutesData from '@/data/routes/south-kolkata.json';
import centralKolkataRouteData from '@/data/routes/central-kolkata.json';
import kalyaniRouteData from '@/data/routes/kalyani.json';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ routeId: string }> }
) {
    try {
        const { routeId } = await params;

        // Combine all routes
        const allRoutesData = [
            ...(northKolkataRoutesData.routes || []),
            ...(southKolkataRoutesData.routes || []),
            ...(centralKolkataRouteData.routes || []),
            ...(kalyaniRouteData.routes || [])
        ];

        // Find the requested route
        const selectedRoute = allRoutesData.find((r: any) => r.id === routeId);

        if (!selectedRoute) {
            console.error('❌ Route not found:', routeId);
            return NextResponse.json(
                {
                    error: 'Route not found',
                    requestedId: routeId,
                    availableRoutes: allRoutesData.map((r: any) => r.id)
                },
                { status: 404 }
            );
        }

        // Get slugs from pandalSequence
        const slugs = selectedRoute.pandalSequence;

        if (!slugs || slugs.length === 0) {
            console.warn('⚠️ Route has no pandals');
            return NextResponse.json({
                route: selectedRoute,
                pandals: [],
                total: 0
            });
        }

        // Fetch all pandals with matching slugs
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

        // Return pandals in the same order as route sequence
        const orderedPandals = slugs
            .map((slug: string) => {
                const pandal = pandalMap.get(slug);
                if (!pandal) {
                    console.warn('⚠️ Pandal not found for slug:', slug);
                }
                return pandal;
            })
            .filter(Boolean);

        return NextResponse.json({
            route: selectedRoute,
            pandals: orderedPandals,
            total: orderedPandals.length
        });
    } catch (error) {
        console.error('Error in route API:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch route pandals',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}