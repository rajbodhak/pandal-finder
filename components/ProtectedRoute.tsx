import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
    children: ReactNode;
    adminOnly?: boolean;
};

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Check if user is logged in
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Please log in to access this page.</div>
            </div>
        );
    }

    // Check admin access if required
    if (adminOnly && !isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-center">
                    <h2 className="text-xl mb-2">Unauthorized Access</h2>
                    <p>You don't have permission to access this admin page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}