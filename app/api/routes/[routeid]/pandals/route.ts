// app/api/routes/[routeId]/pandals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_ID, Query } from '@/lib/appwrite-server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: { routeId: string } }
) {
    try {
        // Load route JSON from data/routes
        const routeFiles = [
            'north-kolkata.json',
            'south-kolkata.json',
            'kalyani.json',
            'central-kolkata.json'
        ];

        let routeData = null;
        let selectedRoute = null;

        // Find the route in JSON files
        for (const filename of routeFiles) {
            try {
                const filepath = path.join(process.cwd(), 'data', 'routes', filename);
                const content = fs.readFileSync(filepath, 'utf-8');
                const data = JSON.parse(content);

                if (data.routes) {
                    const route = data.routes.find((r: any) => r.id === params.routeId);
                    if (route) {
                        selectedRoute = route;
                        break;
                    }
                }
            } catch (err) {
                // File not found or invalid JSON, continue
                continue;
            }
        }

        if (!selectedRoute) {
            return NextResponse.json(
                { error: 'Route not found' },
                { status: 404 }
            );
        }

        // Get slugs from pandalSequence
        const slugs = selectedRoute.pandalSequence;

        if (!slugs || slugs.length === 0) {
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
            .map((slug: string) => pandalMap.get(slug))
            .filter(Boolean);

        return NextResponse.json({
            route: selectedRoute,
            pandals: orderedPandals,
            total: orderedPandals.length
        });
    } catch (error) {
        console.error('Error fetching route pandals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch route pandals' },
            { status: 500 }
        );
    }
}