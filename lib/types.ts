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