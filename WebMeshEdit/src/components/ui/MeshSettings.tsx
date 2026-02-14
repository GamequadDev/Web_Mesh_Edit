interface MeshSettingsProps {
    rotationSpeed: number;
    setRotationSpeed: (val: number) => void;
    onExport: () => void;
}

export const MeshSettings = ({
    rotationSpeed,
    setRotationSpeed,
    onExport
}: MeshSettingsProps) => {
    return (
        <div className="space-y-4">

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

            <button
                onClick={onExport}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <span>💾</span> Pobierz Model (.glb)
            </button>

        </div>
    );
}