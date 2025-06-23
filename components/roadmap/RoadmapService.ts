import { StartingPoint, RoadmapPandal, Pandal } from "@/lib/types";

export class RoadmapService {

    // Haversine formula to calculate walking distance
    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    // Estimate walking time (assuming 4 km/h average walking speed in crowds)
    static calculateWalkingTime(distanceInKm: number): number {
        const walkingSpeedKmh = 3; // Slower due to crowds
        return Math.round((distanceInKm / walkingSpeedKmh) * 60); // in minutes
    }

    // Generate route from starting point through pandals
    static generateRoute(
        startingPoint: StartingPoint,
        pandals: Pandal[]
    ): RoadmapPandal[] {
        if (pandals.length === 0) return [];

        // Sort pandals by distance from starting point for optimal route
        const sortedPandals = [...pandals].sort((a, b) => {
            const distanceA = this.calculateDistance(
                startingPoint.latitude, startingPoint.longitude, a.latitude, a.longitude
            );
            const distanceB = this.calculateDistance(
                startingPoint.latitude, startingPoint.longitude, b.latitude, b.longitude
            );
            return distanceA - distanceB;
        });

        // Create route with walking times and distances
        return sortedPandals.map((pandal, index) => {
            let walkingTime = 0;
            let distance = 0;

            if (index === 0) {
                // First pandal - calculate from starting point
                distance = this.calculateDistance(
                    startingPoint.latitude, startingPoint.longitude,
                    pandal.latitude, pandal.longitude
                ) * 1000; // convert to meters
                walkingTime = this.calculateWalkingTime(distance / 1000);
            } else {
                // Subsequent pandals - calculate from previous pandal
                const prevPandal = sortedPandals[index - 1];
                distance = this.calculateDistance(
                    prevPandal.latitude, prevPandal.longitude,
                    pandal.latitude, pandal.longitude
                ) * 1000; // convert to meters
                walkingTime = this.calculateWalkingTime(distance / 1000);
            }

            return {
                ...pandal,
                sequence: index + 1,
                walkingTimeFromPrevious: walkingTime,
                distanceFromPrevious: Math.round(distance),
                highlights: this.generateHighlights(pandal),
                priority: this.determinePriority(pandal),
                estimatedVisitTime: this.estimateVisitTime(pandal),
                bestVisitTime: this.determineBestVisitTime(pandal),
                tips: this.generateTips(pandal)
            } as RoadmapPandal;
        });
    }

    // Generate highlights based on pandal features
    private static generateHighlights(pandal: Pandal): string[] {
        const highlights: string[] = [];

        if (pandal.rating && pandal.rating >= 4.5) {
            highlights.push("Top Rated");
        }

        if (pandal.category === 'traditional') {
            highlights.push("Traditional Theme");
        } else if (pandal.category === 'modern') {
            highlights.push("Modern Design");
        } else if (pandal.category === 'theme-based') {
            highlights.push("Unique Theme");
        }

        if (pandal.special_features) {
            highlights.push(...pandal.special_features.slice(0, 2));
        }

        if (pandal.crowd_level === 'low') {
            highlights.push("Less Crowded");
        }

        return highlights.slice(0, 3); // Limit to 3 highlights
    }

    // Determine priority based on rating and features
    private static determinePriority(pandal: Pandal): 'must_visit' | 'recommended' | 'optional' {
        if (pandal.rating && pandal.rating >= 4.5) return 'must_visit';
        if (pandal.rating && pandal.rating >= 4.0) return 'recommended';
        return 'optional';
    }

    // Estimate visit time based on pandal characteristics
    private static estimateVisitTime(pandal: Pandal): number {
        let baseTime = 15; // Base 15 minutes

        if (pandal.special_features && pandal.special_features.length > 2) {
            baseTime += 10; // More features = more time
        }

        if (pandal.crowd_level === 'high') {
            baseTime += 15; // High crowd = more waiting time
        } else if (pandal.crowd_level === 'medium') {
            baseTime += 5;
        }

        return baseTime;
    }

    // Determine best visit time
    private static determineBestVisitTime(pandal: Pandal): 'morning' | 'afternoon' | 'evening' | 'night' {
        if (pandal.crowd_level === 'high') return 'morning'; // Less crowded in morning
        if (pandal.special_features?.includes('lighting')) return 'evening';
        return 'afternoon';
    }

    // Generate tips for visiting the pandal
    private static generateTips(pandal: Pandal): string {
        const tips: string[] = [];

        if (pandal.crowd_level === 'high') {
            tips.push("Visit early morning or late evening to avoid crowds");
        }

        if (pandal.special_features?.includes('food')) {
            tips.push("Try the local food stalls nearby");
        }

        if (pandal.category === 'traditional') {
            tips.push("Great for photography with traditional architecture");
        }

        return tips[0] || "Enjoy the festive atmosphere!";
    }

    // Calculate total route statistics
    static calculateRouteStats(route: RoadmapPandal[]): {
        totalDistance: number;
        totalWalkingTime: number;
        totalVisitTime: number;
        estimatedDuration: string;
    } {
        const totalWalkingTime = route.reduce((sum, pandal) => sum + pandal.walkingTimeFromPrevious, 0);
        const totalVisitTime = route.reduce((sum, pandal) => sum + pandal.estimatedVisitTime, 0);
        const totalDistance = route.reduce((sum, pandal) => sum + pandal.distanceFromPrevious, 0) / 1000; // km

        const totalTimeMinutes = totalWalkingTime + totalVisitTime;
        const hours = Math.floor(totalTimeMinutes / 60);
        const minutes = totalTimeMinutes % 60;

        const estimatedDuration = hours > 0 ?
            `${hours}h ${minutes}m` :
            `${minutes} minutes`;

        return {
            totalDistance: Math.round(totalDistance * 100) / 100,
            totalWalkingTime,
            totalVisitTime,
            estimatedDuration
        };
    }
}