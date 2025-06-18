'use client';
import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ID } from '@/lib/appwrite';
import Link from 'next/link';

const SignupPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    if (user) {
        router.push('/');
        return null;
    }

    const validateForm = () => {
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create account
            await account.create(ID.unique(), email, password);

            // Auto login after successful signup
            await account.createEmailPasswordSession(email, password);

            // Force a page reload to update the auth context
            window.location.href = '/';
        } catch (error: any) {
            setError(error.message || 'Signup failed. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h2>

                {error && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password (min 8 characters)"
                            required
                            disabled={loading}
                            minLength={8}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded font-medium transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;