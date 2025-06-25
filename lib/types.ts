export interface Pandal {
    $id: string;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    rating?: number;
    imageUrl?: string;
    imageId?: string;
    area: 'north_kolkata' | 'south_kolkata' | 'central_kolkata' | 'salt_lake' | 'new_town' | 'howrah' | 'other';
    category?: 'traditional' | 'modern' | 'theme-based';
    special_features?: string[];
    crowd_level?: 'low' | 'medium' | 'high';
    created_at?: string;
    updated_at?: string;
}

export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

export interface PandalWithDistance extends Pandal {
    distance?: number; // in kilometers
}

export interface FilterOptions {
    sortBy: 'distance' | 'rating' | 'popular' | 'name';
    area?: string[];        // North/South Kolkata etc.
    category?: string;
    maxDistance?: number; // in km
    minRating?: number;
    crowdLevel?: string[];
}

export interface RoadmapPandal extends Pandal {
    sequence: number;
    walkingTimeFromPrevious: number; // in minutes
    distanceFromPrevious: number; // in meters
    highlights: string[]; // ["Best Theme", "Traditional Architecture", etc.]
    priority: 'must_visit' | 'recommended' | 'optional';
    estimatedVisitTime: number; // in minutes
    bestVisitTime: 'morning' | 'afternoon' | 'evening' | 'night';
    tips?: string; // "Less crowded before 6 PM"
}

// Area configuration
export interface AreaConfig {
    id: string;
    name: string;
    displayName: string; // "North Kolkata"
    description: string;
    startingPoints: StartingPoint[];
    estimatedAreas: string[]; // Sub-areas like ["Shyambazar", "Kumartuli", "Bagbazar"]
}

export interface StartingPoint {
    id: string;
    name: string;
    type: 'metro' | 'railway' | 'bus_stop' | 'landmark';
    latitude: number;
    longitude: number;
    description?: string; // "Girish Park Metro Station"
}

// Route structure
// export interface PandalRoute {
//     id: string;
//     areaId: string;
//     startingPointId: string;
//     name: string; // "North Kolkata from Girish Park"
//     description: string;
//     totalDistance: number; // in km
//     totalWalkingTime: number; // in minutes
//     estimatedDuration: string; // "4-5 hours including visits"
//     difficulty: 'easy' | 'moderate' | 'challenging';
//     bestTimeToStart: string; // "Morning (9 AM)"
//     pandals: RoadmapPandal[];
//     tips: string[];
//     created_at: string;
//     updated_at: string;
// }

// --------------------------------------------------------------------------------------------------

export interface RouteSegment {
    fromPandalId: string;
    toPandalId: string;
    distance: number; // in meters
    estimatedTime: number; // in minutes
    transportMode: 'walk' | 'bus' | 'metro' | 'auto' | 'taxi' | 'ferry';
    transportDetails?: {
        busNumber?: string; // "45, 46A"
        metroLine?: string; // "Blue Line"
        busStops?: string[]; // ["Shyambazar", "Bagbazar"]
        ferryRoute?: string; // "Howrah to Babu Ghat"
        walkingRoute?: string; // "Via Park Street"
    };
    cost?: number; // in rupees
    notes?: string; // "Crowded during evening"
    alternativeRoutes?: RouteSegment[]; // backup options
}

export interface ManualRoute {
    id: string;
    name: string; // "North Kolkata from Howrah Station"
    description: string;
    areaId: string;
    startingPoint: StartingPoint;
    difficulty: 'easy' | 'moderate' | 'challenging';
    estimatedTotalTime: string; // "4-5 hours"
    bestTimeToStart: string; // "9:00 AM"

    // Sequential pandal order
    pandalSequence: string[]; // Array of pandal IDs in order

    // Route segments between pandals
    routeSegments: RouteSegment[];

    // Additional metadata
    totalWalkingDistance: number;
    totalCost: number;
    tips: string[];
    warnings?: string[]; // "Avoid during rush hour"

    startingConnection?: StartingPointConnection;

    created_at: string;
    updated_at: string;
}

export interface StartingPointConnection {
    startingPointId: string;
    firstPandalId: string;
    connection: RouteSegment;
}

// For displaying in UI
// export interface RouteStepDisplay {
//     type: 'starting_point' | 'pandal' | 'transport';
//     pandal?: Pandal;
//     startingPoint?: StartingPoint;
//     transportSegment?: RouteSegment;
//     sequence?: number;
// }