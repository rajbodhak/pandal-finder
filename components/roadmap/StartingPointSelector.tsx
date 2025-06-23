import { AreaConfig, StartingPoint } from "@/lib/types";
import { ChevronRight } from "lucide-react";

export const StartingPointSelector: React.FC<{
    area: AreaConfig;
    onSelectStartingPoint: (startingPoint: StartingPoint) => void;
    onBack: () => void;
}> = ({ area, onSelectStartingPoint, onBack }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="text-orange-600 hover:text-orange-700"
                >
                    ← Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    Choose Starting Point for {area.displayName}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {area.startingPoints.map((point) => (
                    <div
                        key={point.id}
                        onClick={() => onSelectStartingPoint(point)}
                        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow border border-gray-200 hover:border-orange-300"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    {point.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">{point.description}</p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${point.type === 'metro' ? 'bg-blue-100 text-blue-800' :
                                        point.type === 'railway' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {point.type.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
