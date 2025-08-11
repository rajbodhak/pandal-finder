import { Suspense } from 'react';
import RouteMapContent from './RouteMapContent';
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Route Planner - Plan Your Perfect Pandal Hopping Journey',
    description: 'Custom routes to visit multiple Durga Puja pandals in Kolkata. Optimize your pandal hopping with GPS navigation and real-time updates.',
    keywords: [
        'kolkata durga puja guide',
        'kolkata best durga puja pandals',
        'durga puja guide kolkata',
        'north kolkata pandals',
        'south kolkata pandals',
        'central kolkata pandals',
        'north kolkata durga puja pandals',
        'south kolkata durga puja pandals',
        'central kolkata durga puja pandals',
        'pandal route planner',
        'durga puja route',
        'pandal hopping route',
        'kolkata pandal navigation',
        'custom pandal route',
        'durga puja itinerary'
    ],
    openGraph: {
        title: 'DuggaKhoj Route Planner - Custom Pandal Routes',
        description: 'Plan the perfect route to visit multiple pandals efficiently. Save time and never miss your favorite pandals.',
        url: 'https://duggakhoj.site/routemap',
    },
}

export default function RouteMapPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouteMapContent />
        </Suspense>
    );
}