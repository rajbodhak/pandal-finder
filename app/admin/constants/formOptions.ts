import { Pandal } from '@/lib/types';

export const defaultPandal: Partial<Pandal> = {
    name: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    rating: 0,
    area: 'other',
    category: 'traditional',
    crowd_level: 'medium',
};

export const AREA_OPTIONS = [
    { value: 'north_kolkata', label: 'North Kolkata', icon: '🏛️' },
    { value: 'south_kolkata', label: 'South Kolkata', icon: '🌆' },
    { value: 'central_kolkata', label: 'Central Kolkata', icon: '🏢' },
    { value: 'salt_lake', label: 'Salt Lake', icon: '🏙️' },
    { value: 'new_town', label: 'New Town', icon: '🌃' },
    { value: 'howrah', label: 'Howrah', icon: '🌉' },
    { value: 'kalyani', label: 'Kalyani', icon: '🔱' },
    { value: 'dumdum', label: 'Dum Dum', icon: '✨' },
    { value: 'other', label: 'Other', icon: '📍' }
];

export const CATEGORY_OPTIONS = [
    { value: 'traditional', label: 'Traditional' },
    { value: 'modern', label: 'Modern' },
    { value: 'theme-based', label: 'Theme-based' }
];

export const CROWD_LEVEL_OPTIONS = [
    { value: 'low', label: 'Less Crowded', icon: '🟠' },
    { value: 'medium', label: 'Moderate Crowd', icon: '🔵' },
    { value: 'medium-high', label: 'Popular & Crowded', icon: '🟡' },
    { value: 'high', label: 'Very Popular', icon: '🟢' }
];