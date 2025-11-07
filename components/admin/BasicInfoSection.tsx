import { Pandal } from '@/lib/types';

interface BasicInfoSectionProps {
    form: Partial<Pandal>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function BasicInfoSection({ form, onChange }: BasicInfoSectionProps) {
    return (
        <>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pandal Name *
                </label>
                <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
                    placeholder="Full address with area name"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Include area names like "Ballygunge", "Salt Lake", "New Town" for better area detection
                </p>
            </div>
        </>
    );
}