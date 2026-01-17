'use client';

import { useRouter } from 'next/navigation';
import { AreaSelector } from '@/components/routemap/AreaSelector';
import { KOLKATA_AREAS } from '@/components/routemap/AreaConfig';
import { AreaConfig } from '@/lib/types';

export default function RouteMapHome() {
    const router = useRouter();

    const handleAreaSelect = (area: AreaConfig) => {
        // Convert area ID to URL-friendly slug
        const areaSlug = area.id.replace(/_/g, '-');
        router.push(`/routemap/${areaSlug}`);
    };

    return (
        <>
            <AreaSelector
                areas={KOLKATA_AREAS}
                onSelectArea={handleAreaSelect}
            />
        </>
    );
}