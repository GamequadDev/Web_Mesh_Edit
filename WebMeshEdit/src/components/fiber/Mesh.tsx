import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePaintableTexture } from "@/components/fiber/PaintableTexture"; 
import { useRotation } from "@/components/fiber/RotationMesh"; 
import type { BrushSettings } from "@/types/Brush";

interface MeshProps {
    modelUrl: string;
    brush: BrushSettings;
    speed: number;
}

export const Mesh = ({ modelUrl, brush, speed }: MeshProps) => {
    const { nodes, materials } = useGLTF(modelUrl) as any;
    const { texture, paint, stopPainting, initCanvas } = usePaintableTexture();
    const rotationRef = useRotation({ speed });

    // NOWE: Stan przechowujący wczytany obrazek tekstury
    const [brushPattern, setBrushPattern] = useState<HTMLImageElement | null>(null);

    // NOWE: Reakcja na zmianę wybranej tekstury w pędzlu
    useEffect(() => {
        if (brush.textureUrl) {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Zapobiega błędom CORS przy eksporcie!
            img.src = brush.textureUrl;
            img.onload = () => setBrushPattern(img);
        } else {
            setBrushPattern(null);
        }
    }, [brush.textureUrl]);

    // ... (Twój obecny useEffect z initCanvas zostaje tutaj bez zmian) ...
    useEffect(() => {
        const materialNames = Object.keys(materials);
        if (materialNames.length > 0) {
            const mainMaterial = materials[materialNames[0]];
            if (mainMaterial.map && mainMaterial.map.image) {
                initCanvas(mainMaterial.map.image);
            }
        }
    }, [materials, initCanvas]);

    return (
        <group dispose={null} ref={rotationRef}>
            {Object.values(nodes).map((node: any, index) => {
                if (node.isMesh) {
                    const origMat = node.material as THREE.MeshStandardMaterial;

                    return (
                        <mesh
                            key={index}
                            geometry={node.geometry}
                            position={node.position}
                            scale={node.scale}
                            onPointerEnter={() => {
                                if (brush.mode === 'paint') document.body.style.cursor = 'crosshair';
                            }}
                            onPointerLeave={() => {
                                document.body.style.cursor = 'auto';
                                stopPainting();
                            }}
                            onPointerDown={(e) => {
                                if (brush.mode !== 'paint') return;
                                e.stopPropagation();
                                // PRZEKAZUJEMY brushPattern jako 4 argument!
                                paint(e, brush.color, brush.size, brushPattern);
                            }}
                            onPointerMove={(e) => {
                                if (brush.mode === 'paint' && e.buttons === 1) { 
                                    e.stopPropagation();
                                    // PRZEKAZUJEMY brushPattern jako 4 argument!
                                    paint(e, brush.color, brush.size, brushPattern);
                                }
                            }}
                            onPointerUp={stopPainting}
                            onPointerOut={stopPainting}
                        >
                            <meshStandardMaterial 
                                map={texture} 
                                roughness={origMat.roughness || 0.5}
                                normalMap={origMat.normalMap}
                            />
                        </mesh>
                    );
                }
                return null;
            })}
        </group>
    );
};