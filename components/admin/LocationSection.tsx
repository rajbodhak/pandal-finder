import { Pandal } from '@/lib/types';
import { AREA_OPTIONS } from '@/app/admin/constants/formOptions';

interface LocationSectionProps {
    form: Partial<Pandal>;
    autoDetectArea: boolean;
    onAutoDetectChange: (checked: boolean) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function LocationSection({
    form,
    autoDetectArea,
    onAutoDetectChange,
    onChange
}: LocationSectionProps) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude *
                </label>
                <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={onChange}
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
                    onChange={onChange}
                    placeholder="88.3639"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                    required
                />
            </div>

            <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Area
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={autoDetectArea}
                            onChange={(e) => onAutoDetectChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-xs text-gray-400">Auto-detect from address</span>
                    </label>
                </div>
                <select
                    name="area"
                    value={form.area}
                    onChange={onChange}
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
        </>
    );
}