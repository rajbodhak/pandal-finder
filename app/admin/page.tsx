'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import { databaseService } from '@/lib/database';
import { Pandal } from '@/lib/types';
import AdminHeader from '@/components/admin/AdminHeader';
import NotificationBanner from '@/components/admin/NotificationBanner';
import BasicInfoSection from '@/components/admin/BasicInfoSection';
import LocationSection from '@/components/admin/LocationSection';
import CategorySection from '@/components/admin/CategorySection';
import ImageUploadSection from '@/components/admin/ImageUploadSection';
import { defaultPandal } from '@/app/admin/constants/formOptions';
import { detectArea } from '@/app/admin/utils/areaDetection';
import { validateForm } from '@/app/admin/utils/formValidation';
import { uploadImageFile, handleImageUrl } from '@/app/admin/utils/imageHandlers';

export default function AdminPage() {
    const { user, logout } = useAuth();
    const [form, setForm] = useState<Partial<Pandal>>(defaultPandal);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [autoDetectArea, setAutoDetectArea] = useState(true);
    const [imageInputMode, setImageInputMode] = useState<'url' | 'file'>('url');

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

    const handleFileChange = (file: File | null) => {
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateForm(form);
        if (!validation.valid) {
            setError(validation.error || 'Validation failed');
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
                const imageData = handleImageUrl(imageUrl);
                finalImageId = imageData.imageId;
                finalImageUrl = imageData.imageUrl;
            } else if (imageInputMode === 'file' && imageFile) {
                const imageData = await uploadImageFile(imageFile);
                finalImageId = imageData.imageId;
                finalImageUrl = imageData.imageUrl;
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
                    <AdminHeader userEmail={user?.email} onLogout={logout} />

                    <NotificationBanner success={success} error={error} />

                    {/* Form Card */}
                    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                            <h2 className="text-2xl font-bold text-white">Create New Pandal</h2>
                            <p className="text-blue-100 mt-1">Add pandal information and details</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BasicInfoSection form={form} onChange={handleChange} />

                                <LocationSection
                                    form={form}
                                    autoDetectArea={autoDetectArea}
                                    onAutoDetectChange={setAutoDetectArea}
                                    onChange={handleChange}
                                />

                                <CategorySection form={form} onChange={handleChange} />
                            </div>

                            <ImageUploadSection
                                imageInputMode={imageInputMode}
                                imageUrl={imageUrl}
                                imagePreview={imagePreview}
                                onModeChange={setImageInputMode}
                                onUrlChange={setImageUrl}
                                onFileChange={handleFileChange}
                            />

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