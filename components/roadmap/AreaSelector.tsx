import { AreaConfig } from "@/lib/types";
import { ChevronRight } from "lucide-react";

export const AreaSelector: React.FC<{
    areas: AreaConfig[];
    onSelectArea: (area: AreaConfig) => void;
}> = ({ areas, onSelectArea }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Choose Your Exploration Area</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {areas.map((area) => (
                    <div
                        key={area.id}
                        onClick={() => onSelectArea(area)}
                        className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow border border-gray-200 hover:border-orange-300"
                    >
                        <h3 className="text-xl font-semibold text-orange-600 mb-2">
                            {area.displayName}
                        </h3>
                        <p className="text-gray-600 mb-3">{area.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                {area.startingPoints.length} starting points
                            </span>
                            <ChevronRight className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};