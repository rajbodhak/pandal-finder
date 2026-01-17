import RouteMapHeader from '@/components/routemap/RouteMapHeader';

export default function RouteMapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <RouteMapHeader />
            <div className="pt-16"> {/* Add padding to account for fixed header */}
                {children}
            </div>
        </>
    );
}