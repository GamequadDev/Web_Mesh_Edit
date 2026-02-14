import { useRef, useState, useMemo, useEffect } from 'react';
import { useRotation } from "@/components/fiber/RotationMesh";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { usePaintableTexture } from "@/components/fiber/PaintableTexture";
import type { BrushSettings } from "@/types/Brush";

interface MeshProps
{
    isRotating: boolean;
    speed: number;
    modelUrl: string;
    brush: BrushSettings;
}

export const Mesh = ({isRotating = true, speed = 1, modelUrl="./models/marble_bust.glb", brush}: MeshProps) => {

    const { nodes, materials } = useGLTF(modelUrl) as any;
    const textureRef = useRef<THREE.Texture>(null!);

    const canvas = useMemo(() => document.createElement('canvas'), []);


    const { texture, paint, stopPainting, initCanvas } = usePaintableTexture();
    const rotationRef = useRotation({isRotating,speed});

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
                        //material={node.material}
                        position={node.position}
                        scale={node.scale}

                        onPointerEnter={() => {
                            if (brush.mode === 'paint') document.body.style.cursor = 'crosshair';
                        }}

                        onPointerDown={(e) => {
                            if (brush.mode !== 'paint') return;

                            e.stopPropagation();
                            paint(e, brush.color, brush.size);
                        }}

                        onPointerMove={(e) => {
                            if (brush.mode === 'paint' && e.buttons === 1) {
                                e.stopPropagation();
                                paint(e, brush.color, brush.size);
                            }
                        }}

                        onPointerLeave={() => {
                            document.body.style.cursor = 'auto';
                            stopPainting();
                        }}

                        onPointerUp={stopPainting}
                        onPointerOut={stopPainting}
                    >

                    {/* Material PBR */}

                    <meshStandardMaterial map={texture} 
                    roughness={origMat.roughness}
                    normalMap={origMat.normalMap}
                    transparent={origMat.transparent}
                    envMapIntensity={origMat.envMapIntensity || 1}
                    />
                    </mesh>
                );
            }
        return null;
        })}
    </group>
    );
}

useGLTF.preload("./models/marble_bust.glb");