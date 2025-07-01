// ManualRouteService.ts
import { ManualRoute, Pandal } from '@/lib/types';

import northKolkataRoutesData from '@/data/routes/north-kolkata.json'

export class ManualRouteService {
    private static routes: ManualRoute[] = [];
    private static isLoaded = false;

    // Load routes from data
    static async loadRoutes(): Promise<void> {
        if (this.isLoaded) return;

        try {

            this.routes = [
                ...northKolkataRoutesData.routes as ManualRoute[],
                // Add other area routes here when you have them
                // ...southKolkataRoutes.routes as ManualRoute[],
                // ...centralKolkataRoutes.routes as ManualRoute[],
            ];

            this.isLoaded = true;

        } catch (error) {
            console.error('Error loading routes:', error);
        }
    }

    // Get routes by area
    static getRoutesByArea(areaId: string): ManualRoute[] {
        return this.routes.filter(route => route.areaId === areaId);
    }

    // Get route by ID
    static getRouteById(routeId: string): ManualRoute | null {
        return this.routes.find(route => route.id === routeId) || null;
    }

    // Get routes by starting point
    static getRoutesByStartingPoint(startingPointId: string): ManualRoute[] {
        return this.routes.filter(route => route.startingPoint.id === startingPointId);
    }

    // Build display data for a route
    static buildRouteDisplay(route: ManualRoute, pandals: Pandal[]): {
        steps: any[];
        totalDistance: number;
        totalTime: number;
        totalCost: number;
    } {
        const steps = [];
        let totalDistance = 0;
        let totalTime = 0;
        let totalCost = 0;

        // Add starting point
        steps.push({
            type: 'starting_point',
            startingPoint: route.startingPoint,
            sequence: 0
        });

        // Add starting connection
        if (route.startingConnection) {
            steps.push({
                type: 'transport',
                transportSegment: route.startingConnection.connection
            });
            totalDistance += route.startingConnection.connection.distance;
            totalTime += route.startingConnection.connection.estimatedTime;
            totalCost += route.startingConnection.connection.cost || 0;
        }

        // Add pandals and segments
        route.pandalSequence.forEach((pandalId, index) => {
            const pandal = pandals.find(p => p.$id === pandalId);
            if (pandal) {
                steps.push({
                    type: 'pandal',
                    pandal,
                    sequence: index + 1
                });

                // Add route segment to next pandal
                const segment = route.routeSegments.find(s => s.fromPandalId === pandalId);
                if (segment) {
                    steps.push({
                        type: 'transport',
                        transportSegment: segment
                    });
                    totalDistance += segment.distance;
                    totalTime += segment.estimatedTime;
                    totalCost += segment.cost || 0;
                }
            }
        });

        return {
            steps,
            totalDistance,
            totalTime,
            totalCost
        };
    }

    // Validate route data
    static validateRoute(route: ManualRoute): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check if all pandals in sequence exist
        if (!route.pandalSequence || route.pandalSequence.length === 0) {
            errors.push('Route must have at least one pandal');
        }

        // Check if route segments match pandal sequence
        const expectedSegments = route.pandalSequence.length - 1;
        if (route.routeSegments.length !== expectedSegments) {
            errors.push(`Expected ${expectedSegments} route segments, got ${route.routeSegments.length}`);
        }

        // Validate segment connections
        for (let i = 0; i < route.routeSegments.length; i++) {
            const segment = route.routeSegments[i];
            const fromPandal = route.pandalSequence[i];
            const toPandal = route.pandalSequence[i + 1];

            if (segment.fromPandalId !== fromPandal) {
                errors.push(`Segment ${i} fromPandalId doesn't match sequence`);
            }
            if (segment.toPandalId !== toPandal) {
                errors.push(`Segment ${i} toPandalId doesn't match sequence`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Create a new manual route
    static createRoute(routeData: Omit<ManualRoute, 'id' | 'created_at' | 'updated_at'>): ManualRoute {
        const route: ManualRoute = {
            ...routeData,
            id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Validate before saving
        const validation = this.validateRoute(route);
        if (!validation.isValid) {
            throw new Error(`Route validation failed: ${validation.errors.join(', ')}`);
        }

        this.routes.push(route);
        return route;
    }

    // Update existing route
    static updateRoute(routeId: string, updates: Partial<ManualRoute>): ManualRoute | null {
        const routeIndex = this.routes.findIndex(r => r.id === routeId);
        if (routeIndex === -1) return null;

        const updatedRoute = {
            ...this.routes[routeIndex],
            ...updates,
            updated_at: new Date().toISOString()
        };

        // Validate updated route
        const validation = this.validateRoute(updatedRoute);
        if (!validation.isValid) {
            throw new Error(`Route validation failed: ${validation.errors.join(', ')}`);
        }

        this.routes[routeIndex] = updatedRoute;
        return updatedRoute;
    }

    // Delete route
    static deleteRoute(routeId: string): boolean {
        const routeIndex = this.routes.findIndex(r => r.id === routeId);
        if (routeIndex === -1) return false;

        this.routes.splice(routeIndex, 1);
        return true;
    }

    // Export routes to JSON (for backup/sharing)
    static exportRoutes(): string {
        return JSON.stringify({
            routes: this.routes,
            exportedAt: new Date().toISOString()
        }, null, 2);
    }

    // Import routes from JSON
    static importRoutes(jsonData: string): { success: boolean; imported: number; errors: string[] } {
        try {
            const data = JSON.parse(jsonData);
            const errors: string[] = [];
            let imported = 0;

            for (const routeData of data.routes) {
                try {
                    const validation = this.validateRoute(routeData);
                    if (validation.isValid) {
                        const existingIndex = this.routes.findIndex(r => r.id === routeData.id);
                        if (existingIndex >= 0) {
                            this.routes[existingIndex] = routeData;
                        } else {
                            this.routes.push(routeData);
                        }
                        imported++;
                    } else {
                        errors.push(`Route ${routeData.id}: ${validation.errors.join(', ')}`);
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    errors.push(`Route ${routeData.id}: ${message}`);
                }
            }

            return { success: errors.length === 0, imported, errors };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return { success: false, imported: 0, errors: [message] };
        }
    }

    // Debug method to check loaded routes
    static getDebugInfo(): { routeCount: number; areas: string[]; startingPoints: string[] } {
        const areas = [...new Set(this.routes.map(r => r.areaId))];
        const startingPoints = [...new Set(this.routes.map(r => r.startingPoint.id))];

        return {
            routeCount: this.routes.length,
            areas,
            startingPoints
        };
    }
}