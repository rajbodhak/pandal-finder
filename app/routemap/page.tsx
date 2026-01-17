import { Metadata } from 'next';
import RouteMapHome from './RouteMapHome';
import RouteMapHeader from '@/components/routemap/RouteMapHeader';
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
        'pandal route planner',
        'durga puja route',
        'pandal hopping route',
        'kolkata pandal navigation',
    ],
    openGraph: {
        title: 'DuggaKhoj Route Planner - Custom Pandal Routes',
        description: 'Plan the perfect route to visit multiple pandals efficiently.',
        url: 'https://duggakhoj.site/routemap',
    },
};

export default function RouteMapPage() {
    return <RouteMapHome />;
}