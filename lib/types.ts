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
    category?: 'traditional' | 'modern' | 'theme-based';
    established_year?: number;
    organizer?: string;
    visiting_hours?: string;
    special_features?: string[];
    crowd_level?: 'low' | 'medium' | 'high';
    accessibility_features?: string[];
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
    category?: string;
    maxDistance?: number; // in km
    minRating?: number;
    crowdLevel?: string[];
}