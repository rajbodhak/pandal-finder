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
                id: 'sealdaho_station',
                name: 'Sealdah Railway Station',
                type: 'railway',
                description: 'Major railway station in North Kolkata'
            },
            // {
            //     id: 'girish_park_metro',
            //     name: 'Girish Park Metro Station',
            //     type: 'metro',
            //     description: 'Metro station close to heritage pandals'
            // },
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
            },
            {
                id: 'jadavpur_station',
                name: 'Jadavpur Railway Station',
                type: 'railway',
                description: 'Good for Jadavpur and nearby areas'
            }
        ]
    },
    {
        id: 'central_kolkata',
        name: 'central_kolkata',
        displayName: 'Central Kolkata',
        description: 'Mix of traditional and modern pandals around Esplanade, Maidan area',
        estimatedAreas: ['Esplanade', 'Maidan', 'Dharmatala', 'BBD Bagh'],
        startingPoints: [
            {
                id: 'esplanade_metro',
                name: 'Esplanade Metro Station',
                type: 'metro',
                description: 'Central hub for exploring central Kolkata'
            },
            {
                id: 'howrah_bridge',
                name: 'Howrah Bridge Area',
                type: 'landmark',
                description: 'Iconic landmark with nearby pandals'
            }
        ]
    }
];