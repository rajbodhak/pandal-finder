import Image from 'next/image';

interface ImageUploadSectionProps {
    imageInputMode: 'url' | 'file';
    imageUrl: string;
    imagePreview: string | null;
    onModeChange: (mode: 'url' | 'file') => void;
    onUrlChange: (url: string) => void;
    onFileChange: (file: File | null) => void;
}

export default function ImageUploadSection({
    imageInputMode,
    imageUrl,
    imagePreview,
    onModeChange,
    onUrlChange,
    onFileChange
}: ImageUploadSectionProps) {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file);
        }
    };

    return (
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
                        onChange={() => onModeChange('url')}
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
                        onChange={() => onModeChange('file')}
                        className="mr-2"
                    />
                    <span className="text-gray-300">File Upload</span>
                </label>
            </div>

            {imageInputMode === 'url' ? (
                /* URL Input */
                <div>
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => onUrlChange(e.target.value)}
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
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-48 mx-auto rounded-lg shadow-lg border border-gray-600"
                            />
                            <div className="flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => onFileChange(null)}
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
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        Supports JPG, PNG, WebP (Max 10MB)
                    </p>
                </div>
            )}
        </div>
    );
}