import { Suspense } from 'react';
import RouteMapContent from './RouteMapContent';

export default function RouteMapPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouteMapContent />
        </Suspense>
    );
}