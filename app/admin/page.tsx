'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import { databaseService } from '@/lib/database';
import { Pandal } from '@/lib/types';
// import { ID, storage } from '@/lib/appwrite'; // COMMENTED OUT - Appwrite storage
import Image from 'next/image';

// Area detection utility
const detectArea = (address: string): Pandal['area'] => {
    const lowerAddress = address.toLowerCase();

    const areaKeywords = {
        north_kolkata: ['shyambazar', 'kumartuli', 'shobhabazar', 'bagbazar', 'north kolkata', 'hatibagan', 'chitpur', 'jorasanko', 'beadon street'],
        south_kolkata: ['ballygunge', 'gariahat', 'jadavpur', 'tollygunge', 'south kolkata', 'kalighat', 'alipore', 'bhawanipore', 'rashbehari', 'kasba', 'khidirpur'],
        central_kolkata: ['park street', 'college street', 'bow barracks', 'central kolkata', 'esplanade', 'dalhousie', 'dharmatala', 'chowringhee'],
        salt_lake: ['salt lake', 'bidhannagar', 'sector', 'city centre', 'salt lake city'],
        new_town: ['new town', 'action area', 'eco park', 'rajarhat', 'newtown'],
        howrah: ['howrah', 'shibpur', 'santragachi', 'liluah', 'belur'],
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

const defaultPandal: Partial<Pandal> = {
    name: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    rating: 0,
    area: 'other',
    category: 'traditional',
    crowd_level: 'medium',
};

const AREA_OPTIONS = [
    { value: 'north_kolkata', label: 'North Kolkata', icon: '🏛️' },
    { value: 'south_kolkata', label: 'South Kolkata', icon: '🌆' },
    { value: 'central_kolkata', label: 'Central Kolkata', icon: '🏢' },
    { value: 'salt_lake', label: 'Salt Lake', icon: '🏙️' },
    { value: 'new_town', label: 'New Town', icon: '🌃' },
    { value: 'howrah', label: 'Howrah', icon: '🌉' },
    { value: 'kalyani', label: 'Kalyani', icon: '🔱' },
    { value: 'dumdum', label: 'Dum Dum', icon: '✨' },
    { value: 'other', label: 'Other', icon: '📍' }
];

const CATEGORY_OPTIONS = [
    { value: 'traditional', label: 'Traditional' },
    { value: 'modern', label: 'Modern' },
    { value: 'theme-based', label: 'Theme-based' }
];

const CROWD_LEVEL_OPTIONS = [
    { value: 'low', label: 'Less Crowded', icon: '🟠' },
    { value: 'medium', label: 'Moderate Crowd', icon: '🔵' },
    { value: 'medium-high', label: 'Popular & Crowded', icon: '🟡' },
    { value: 'high', label: 'Very Popular', icon: '🟢' }
];

// Simple UUID generator for temporary use
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export default function AdminPage() {
    const { user, logout } = useAuth();
    const [form, setForm] = useState<Partial<Pandal>>(defaultPandal);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(''); // For manual URL input
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [autoDetectArea, setAutoDetectArea] = useState(true);
    const [imageInputMode, setImageInputMode] = useState<'url' | 'file'>('url'); // Toggle between URL and file upload

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...form,
            [name]: ['latitude', 'longitude', 'rating'].includes(name)
                ? Number(value)
                : value,
        };

        // Auto-detect area when address changes
        if (name === 'address' && autoDetectArea && value) {
            updatedForm.area = detectArea(value);
        }

        setForm(updatedForm);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMultiSelect = (name: string, value: string, checked: boolean) => {
        setForm(prev => {
            const currentArray = prev[name as keyof Partial<Pandal>] as string[] || [];
            if (checked) {
                return {
                    ...prev,
                    [name]: [...currentArray, value]
                };
            } else {
                return {
                    ...prev,
                    [name]: currentArray.filter(item => item !== value)
                };
            }
        });
    };

    const validateForm = () => {
        if (!form.name || !form.description || !form.address) {
            setError('Please fill in all required fields (Name, Description, Address)');
            return false;
        }
        if (!form.latitude || !form.longitude) {
            setError('Please provide valid latitude and longitude coordinates');
            return false;
        }
        if (form.rating && (form.rating < 0 || form.rating > 5)) {
            setError('Rating must be between 0 and 5');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            let finalImageId: string | undefined;
            let finalImageUrl: string | undefined;

            // Handle image based on input mode
            if (imageInputMode === 'url' && imageUrl.trim()) {
                // Use direct URL
                finalImageUrl = imageUrl.trim();
                finalImageId = generateUUID(); // Generate a temporary ID for reference
            }

            /* COMMENTED OUT - Appwrite storage upload
            else if (imageInputMode === 'file' && imageFile) {
                // Upload file to storage service
                const fileId = ID.unique();
                const uploadRes = await storage.createFile(
                    process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
                    fileId,
                    imageFile
                );
                finalImageId = uploadRes.$id;
                finalImageUrl = storage.getFileView(
                    process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
                    fileId
                ).toString();
            }
            */

            // For now, if file upload is selected, show an informational message
            else if (imageInputMode === 'file' && imageFile) {
                setError('File upload temporarily disabled. Please use image URL instead or upload to an image hosting service and paste the URL.');
                setLoading(false);
                return;
            }

            await databaseService.createPandal({
                ...form,
                imageId: finalImageId,
                imageUrl: finalImageUrl,
            } as Omit<Pandal, '$id' | 'created_at' | 'updated_at'>);

            setSuccess(true);
            setForm(defaultPandal);
            setImageFile(null);
            setImagePreview(null);
            setImageUrl('');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'Failed to create pandal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute adminOnly={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                            <p className="text-gray-400">Welcome back, {user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Log Out
                        </button>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg mb-6 animate-pulse shadow-lg border border-green-500">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Pandal created successfully!
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg mb-6 shadow-lg border border-red-500">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                            <h2 className="text-2xl font-bold text-white">Create New Pandal</h2>
                            <p className="text-blue-100 mt-1">Add pandal information and details</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Pandal Name *
                                    </label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter pandal name"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe the pandal, its theme, special features..."
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors resize-none"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Full address with area name"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Include area names like "Ballygunge", "Salt Lake", "New Town" for better area detection
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Latitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={form.latitude}
                                        onChange={handleChange}
                                        placeholder="22.5726"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Longitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={form.longitude}
                                        onChange={handleChange}
                                        placeholder="88.3639"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Area Selection with Auto-detect */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Area
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={autoDetectArea}
                                                onChange={(e) => setAutoDetectArea(e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <span className="text-xs text-gray-400">Auto-detect from address</span>
                                        </label>
                                    </div>
                                    <select
                                        name="area"
                                        value={form.area}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-colors"
                                    >
                                        {AREA_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value} className="bg-gray-700">
                                                {option.icon} {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {autoDetectArea && form.address && (
                                        <p className="text-xs text-green-400 mt-1">
                                            Auto-detected: {AREA_OPTIONS.find(opt => opt.value === form.area)?.label}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-colors"
                                    >
                                        {CATEGORY_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value} className="bg-gray-700">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Crowd Level
                                    </label>
                                    <select
                                        name="crowd_level"
                                        value={form.crowd_level}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-colors"
                                    >
                                        {CROWD_LEVEL_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value} className="bg-gray-700">
                                                {option.icon} {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Rating (0-5)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        name="rating"
                                        value={form.rating}
                                        onChange={handleChange}
                                        placeholder="4.5"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Image Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Pandal Image
                                </label>

                                {/* Image Input Mode Toggle */}
                                <div className="flex space-x-4 mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="imageMode"
                                            value="url"
                                            checked={imageInputMode === 'url'}
                                            onChange={(e) => setImageInputMode('url')}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-300">Image URL</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="imageMode"
                                            value="file"
                                            checked={imageInputMode === 'file'}
                                            onChange={(e) => setImageInputMode('file')}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-300">File Upload (Temporarily Disabled)</span>
                                    </label>
                                </div>

                                {imageInputMode === 'url' ? (
                                    /* URL Input */
                                    <div>
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors mb-4"
                                        />
                                        {imageUrl && (
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                                                <img
                                                    src={imageUrl}
                                                    alt="Preview"
                                                    className="max-h-48 mx-auto rounded-lg shadow-lg border border-gray-600"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* File Upload */
                                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-gray-700/50">
                                        {imagePreview ? (
                                            <div className="space-y-4">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-48 mx-auto rounded-lg shadow-lg border border-gray-600"
                                                />
                                                <div className="flex justify-center space-x-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImageFile(null);
                                                            setImagePreview(null);
                                                        }}
                                                        className="text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 text-sm px-4 py-2 rounded-md border border-red-600 hover:border-red-500 transition-colors"
                                                    >
                                                        Remove Image
                                                    </button>
                                                    <label className="text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 text-sm px-4 py-2 rounded-md border border-blue-600 hover:border-blue-500 cursor-pointer transition-colors">
                                                        Change Image
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block">
                                                <div>
                                                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-400">
                                                        File upload temporarily disabled
                                                    </p>
                                                    <p className="text-xs text-gray-500">Please use image URL option instead</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    disabled
                                                />
                                            </label>
                                        )}
                                        <p className="text-xs text-yellow-400 mt-2">
                                            Note: Upload your image to imgur.com, cloudinary.com, or similar service and paste the URL above
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg font-medium text-lg transition-all transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Creating Pandal...</span>
                                        </div>
                                    ) : (
                                        'Create Pandal'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}