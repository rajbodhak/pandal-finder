import { AreaConfig } from "@/lib/types";

export const KOLKATA_AREAS: AreaConfig[] = [
    {
        id: 'north_kolkata',
        name: 'north_kolkata',
        displayName: 'North Kolkata',
        description: 'Traditional heart of Durga Puja with heritage pandals',
        estimatedAreas: ['Shyambazar', 'Kumartuli', 'Bagbazar', 'Sovabazar'],
        startingPoints: [
            {
                id: 'girish_park',
                name: 'Girish Park',
                type: 'metro',
                latitude: 22.5858,
                longitude: 88.3639,
                description: 'Girish Park Metro Station - Line 1'
            },
            {
                id: 'shyambazar',
                name: 'Shyambazar',
                type: 'metro',
                latitude: 22.5959,
                longitude: 88.3731,
                description: 'Shyambazar Metro Station - Line 1'
            },
            {
                id: 'sealdah',
                name: 'Sealdah',
                type: 'railway',
                latitude: 22.5675,
                longitude: 88.3700,
                description: 'Sealdah Railway Station'
            }
        ]
    },
    {
        id: 'south_kolkata',
        name: 'south_kolkata',
        displayName: 'South Kolkata',
        description: 'Modern themed pandals with creative designs',
        estimatedAreas: ['Behala', 'Jadavpur', 'Garia', 'Tollygunge'],
        startingPoints: [
            {
                id: 'jadavpur',
                name: 'Jadavpur',
                type: 'metro',
                latitude: 22.4985,
                longitude: 88.3712,
                description: 'Jadavpur Metro Station - Line 1'
            },
            {
                id: 'tollygunge',
                name: 'Tollygunge',
                type: 'metro',
                latitude: 22.4625,
                longitude: 88.3712,
                description: 'Tollygunge Metro Station - Line 1'
            },
            {
                id: 'garia',
                name: 'Garia',
                type: 'metro',
                latitude: 22.4694,
                longitude: 88.3917,
                description: 'Garia Metro Station - Line 1'
            }
        ]
    },
    {
        id: 'central_kolkata',
        name: 'central_kolkata',
        displayName: 'Central Kolkata',
        description: 'Mix of traditional and modern pandals in the city center',
        estimatedAreas: ['Park Street', 'Esplanade', 'Bowbazar', 'College Street'],
        startingPoints: [
            {
                id: 'esplanade',
                name: 'Esplanade',
                type: 'metro',
                latitude: 22.5697,
                longitude: 88.3467,
                description: 'Esplanade Metro Station - Line 1'
            },
            {
                id: 'park_street',
                name: 'Park Street',
                type: 'metro',
                latitude: 22.5448,
                longitude: 88.3564,
                description: 'Park Street Metro Station - Line 1'
            },
            {
                id: 'howrah_station',
                name: 'Howrah Station',
                type: 'railway',
                latitude: 22.5804,
                longitude: 88.3299,
                description: 'Howrah Railway Station'
            }
        ]
    },
    {
        id: 'salt_lake',
        name: 'salt_lake',
        displayName: 'Salt Lake',
        description: 'Well-organized pandals with modern themes',
        estimatedAreas: ['Sector V', 'Tank 1-12', 'Bidhannagar'],
        startingPoints: [
            {
                id: 'salt_lake_sector_v',
                name: 'Salt Lake Sector V',
                type: 'metro',
                latitude: 22.5726,
                longitude: 88.4150,
                description: 'Salt Lake Sector V Metro Station - Line 1'
            },
            {
                id: 'bidhannagar',
                name: 'Bidhannagar',
                type: 'metro',
                latitude: 22.5726,
                longitude: 88.4329,
                description: 'Bidhannagar Metro Station - Line 1'
            }
        ]
    },
    {
        id: 'new_town',
        name: 'new_town',
        displayName: 'New Town',
        description: 'Contemporary pandals with innovative designs',
        estimatedAreas: ['Action Area I', 'Action Area II', 'Action Area III'],
        startingPoints: [
            {
                id: 'new_town',
                name: 'New Town',
                type: 'metro',
                latitude: 22.5958,
                longitude: 88.4615,
                description: 'New Town Metro Station - Line 1'
            }
        ]
    }
];