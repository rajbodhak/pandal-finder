import { Pandal } from '@/lib/types';

export const detectArea = (address: string): Pandal['area'] => {
    const lowerAddress = address.toLowerCase();

    const areaKeywords = {
        north_kolkata: [
            'shyambazar', 'kumartuli', 'shobhabazar', 'bagbazar',
            'north kolkata', 'hatibagan', 'chitpur', 'jorasanko',
            'beadon street'
        ],
        south_kolkata: [
            'ballygunge', 'gariahat', 'jadavpur', 'tollygunge',
            'south kolkata', 'kalighat', 'alipore', 'bhawanipore',
            'rashbehari', 'kasba', 'khidirpur'
        ],
        central_kolkata: [
            'park street', 'college street', 'bow barracks',
            'central kolkata', 'esplanade', 'dalhousie',
            'dharmatala', 'chowringhee'
        ],
        salt_lake: [
            'salt lake', 'bidhannagar', 'sector',
            'city centre', 'salt lake city'
        ],
        new_town: [
            'new town', 'action area', 'eco park',
            'rajarhat', 'newtown'
        ],
        howrah: [
            'howrah', 'shibpur', 'santragachi', 'liluah', 'belur'
        ],
        kalyani: ['kalyani'],
        dumdum: ['dum dum', 'dumdum']
    };

    for (const [area, keywords] of Object.entries(areaKeywords)) {
        if (keywords.some(keyword => lowerAddress.includes(keyword))) {
            return area as Pandal['area'];
        }
    }

    return 'other';
};