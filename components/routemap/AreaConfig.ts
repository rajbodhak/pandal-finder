// AreaConfig.ts
import { AreaConfig } from '@/lib/types';

export const KOLKATA_AREAS: AreaConfig[] = [
    {
        id: 'north_kolkata',
        name: 'north_kolkata',
        displayName: 'North Kolkata',
        description: 'Traditional pandals in heritage areas like Kumartuli, Bagbazar, Shyambazar',
        estimatedAreas: ['Kumartuli', 'Bagbazar', 'Shyambazar', 'College Street', 'Sovabazar'],
        startingPoints: [
            {
                id: 'howrah_station',
                name: 'Howrah Railway Station',
                type: 'railway',
                description: 'Main railway terminus - good connection to all North Kolkata areas'
            },
            {
                id: 'shyambazar_metro',
                name: 'Shyambazar Metro Station',
                type: 'metro',
                description: 'Metro station in heart of North Kolkata'
            }
        ]
    },
    {
        id: 'south_kolkata',
        name: 'south_kolkata',
        displayName: 'South Kolkata',
        description: 'Modern and theme-based pandals in areas like Park Street, Ballygunge, Jadavpur',
        estimatedAreas: ['Park Street', 'Ballygunge', 'Jadavpur', 'Gariahat', 'Rashbehari'],
        startingPoints: [
            {
                id: "ballygunge_station",
                name: "Ballygunge Railway Station",
                type: "railway",
                description: "Starting point for South Kolkata pandals"
            }

        ]
    },
    {
        id: 'central_kolkata',
        name: 'central_kolkata',
        displayName: 'Central Kolkata',
        description: 'Mix of traditional and modern pandals around Central to North Kolkata',
        estimatedAreas: ['Esplanade', 'Maidan', 'Dharmatala', 'BBD Bagh'],
        startingPoints: [
            {
                id: 'sealdah_junction',
                name: 'Sealdah Railway Station',
                type: 'railway',
                description: 'Central to North Kolkata Pandals exploring'
            }
        ]
    }
];