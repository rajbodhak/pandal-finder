import { Pandal } from '@/lib/types';
import { CATEGORY_OPTIONS, CROWD_LEVEL_OPTIONS } from '@/app/admin/constants/formOptions';

interface CategorySectionProps {
    form: Partial<Pandal>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function CategorySection({ form, onChange }: CategorySectionProps) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                </label>
                <select
                    name="category"
                    value={form.category}
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
                    placeholder="4.5"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                />
            </div>
        </>
    );
}