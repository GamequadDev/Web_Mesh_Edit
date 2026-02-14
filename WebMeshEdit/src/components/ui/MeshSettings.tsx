interface MeshSettingsProps {
    isRotating: boolean;
    setIsRotating: (val: boolean) => void;
    rotationSpeed: number;
    setRotationSpeed: (val: number) => void;
}

export const MeshSettings = ({
    isRotating,
    setIsRotating,
    rotationSpeed,
    setRotationSpeed
}: MeshSettingsProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600">Auto Rotacja</span>
                <input
                    type="checkbox"
                    checked={isRotating}
                    onChange={(e) => setIsRotating(e.target.checked)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm space-y-2">
                <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Prędkość</label>
                    <span className="text-[10px] font-mono text-blue-600">{rotationSpeed.toFixed(1)}</span>
                </div>
                <input
                    type="range"
                    min="0" max="2" step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                />
            </div>
        </div>
    );
}