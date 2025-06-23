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
    created_at: string;
    updated_at: string;
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
export interface PandalRoute {
    id: string;
    areaId: string;
    startingPointId: string;
    name: string; // "North Kolkata from Girish Park"
    description: string;
    totalDistance: number; // in km
    totalWalkingTime: number; // in minutes
    estimatedDuration: string; // "4-5 hours including visits"
    difficulty: 'easy' | 'moderate' | 'challenging';
    bestTimeToStart: string; // "Morning (9 AM)"
    pandals: RoadmapPandal[];
    tips: string[];
    created_at: string;
    updated_at: string;
}

// Filter options for roadmap
export interface RoadmapFilters {
    area: string;
    startingPoint: string;
    maxWalkingTime?: number;
    difficulty?: 'easy' | 'moderate' | 'challenging';
    priorityLevel?: 'must_visit' | 'recommended' | 'all';
}