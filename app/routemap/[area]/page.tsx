import { Metadata } from 'next';
import { Suspense } from 'react';
import AreaStartingPointContent from './AreaStartingPointContent';

export const metadata: Metadata = {
    title: 'Select Starting Point - Route Planner',
    description: 'Choose your starting point for the pandal route',
};

export default async function AreaStartingPointPage({
    params,
}: {
    params: Promise<{ area: string }>;
}) {
    const { area } = await params;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AreaStartingPointContent areaSlug={area} />
        </Suspense>
    );
}