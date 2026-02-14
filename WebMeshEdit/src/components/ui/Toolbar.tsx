import React, { type ChangeEvent } from 'react';
import type { BrushSettings } from "@/types/Brush";

interface ToolbarProps {
  brush: BrushSettings;
  setBrush: React.Dispatch<React.SetStateAction<BrushSettings>>;
}

// Lista dostępnych tekstur (upewnij się, że masz te pliki w folderze public/textures/)
const TEXTURES = [
  { name: 'Trawa', url: '/textures/grass.jpg' },
  { name: 'Kamień', url: '/textures/stone.jpg' },
  { name: 'Rdza', url: '/textures/rust.jpg' },
  { name: 'Drewno', url: '/textures/wood.jpg' }
];

export const Toolbar: React.FC<ToolbarProps> = ({ brush, setBrush }) => {
  
  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setBrush(prev => ({ ...prev, size: newSize }));
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 pointer-events-auto">
      
      {/* Type change */}
      <div className="flex bg-gray-200/50 p-1 rounded-xl">
        <button 
          onClick={() => setBrush(prev => ({ ...prev, mode: 'orbit' }))}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${brush.mode === 'orbit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Obracaj
        </button>
        <button 
          onClick={() => setBrush(prev => ({ ...prev, mode: 'paint' }))}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${brush.mode === 'paint' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Maluj
        </button>
      </div>

      {/* Paint settings */}
      {brush.mode === 'paint' && (
        <>
          <div className="h-8 w-[1px] bg-gray-300" /> {/* Seperator */}

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase text-center -mb-1">Kolory</span>
            <div className="flex gap-2">
              {['#ff0000', '#00ff00', '#3b82f6', '#000000'].map(color => (
                <button
                  key={color}
                  // WAŻNE: Resetujemy textureUrl na null, aby wymusić użycie koloru
                  onClick={() => setBrush(prev => ({ ...prev, color, textureUrl: null }))}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${brush.color === color && !brush.textureUrl ? 'scale-125 border-gray-400' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="h-8 w-[1px] bg-gray-300" /> {/* Seperator */}

          {/* Texture select */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase text-center -mb-1">Tekstury</span>
            <div className="flex gap-2">
              {TEXTURES.map(tex => (
                <button
                  key={tex.name}
                  // Ustawiamy textureUrl na wybrany obrazek
                  onClick={() => setBrush(prev => ({ ...prev, textureUrl: tex.url }))}
                  className={`w-6 h-6 rounded-full border-2 transition-all bg-gray-200 ${brush.textureUrl === tex.url ? 'scale-125 border-gray-400' : 'border-transparent'}`}
                  style={{ 
                    backgroundImage: `url(${tex.url})`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title={tex.name}
                />
              ))}
            </div>
          </div>

          <div className="h-8 w-[1px] bg-gray-300" /> {/* Seperator */}

          {/* Size painter */}
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Rozmiar</span>
                <span className="text-[10px] font-mono text-gray-600 font-bold">{brush.size}px</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={brush.size}
              onChange={handleSizeChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </>
      )}
    </div>
  );
};