'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';

type User = {
    $id: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const user = await account.get();
            setUser(user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await account.deleteSessions();
            setUser(null);
            // Redirect to login page after logout
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            setUser(null);
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const isAdmin = user?.$id === process.env.NEXT_PUBLIC_ADMIN_USER_ID!;

    return (
        <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);