import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "@/components/fiber/Mesh";
import { Environment, ContactShadows, Stage, OrbitControls, Center } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, SSAO, SMAA } from "@react-three/postprocessing";
import { GLTFExporter } from 'three-stdlib';
import type { BrushSettings } from "@/types/Brush";

export interface SceneProps {
    bgColor: string;
    modelUrl: string;
    brush: BrushSettings;
    rotationSpeed: number;
    exportTrigger: number;
}

export const Scene: React.FC<SceneProps> = ({ bgColor, modelUrl, brush, rotationSpeed, exportTrigger }) => {
    const [ready, setReady] = useState(false);
    const groupRef = useRef<THREE.Group>(null!);

    // Eksport wywoływany przez zmianę licznika
    useEffect(() => {
        if (exportTrigger > 0 && groupRef.current) {
            handleExport();
        }
    }, [exportTrigger]);

    const handleExport = async () => {
        if (!groupRef.current) return;

        const exporter = new GLTFExporter();
        const clone = groupRef.current.clone(true);
        const nodesToRemove: THREE.Object3D[] = [];
        
        // ZMIANA 2: Tablica na obietnice (Promises) ładowania obrazków
        const texturePromises: Promise<void>[] = [];

        clone.traverse((node: any) => {
            if (node.isLight || node.isHelper) {
                nodesToRemove.push(node);
                return;
            }

            if (node.isMesh) {
                const oldMat = node.material as THREE.MeshStandardMaterial;
                const safeMaterial = new THREE.MeshStandardMaterial({
                    color: oldMat.color,
                    roughness: oldMat.roughness, // Pobiera błysk z ekranu
                    metalness: oldMat.metalness, // Pobiera metaliczność z ekranu
                    normalMap: oldMat.normalMap, // Zapisuje ewentualne nierówności
                });

                if (oldMat.map && oldMat.map.image) {
                    try {
                        let dataUrl = "";
                        const sourceImage = oldMat.map.image;
                        
                        // WYCIĄGAMY WARTOŚĆ TUTAJ, zanim wejdziemy w Promise
                        const originalFlipY = oldMat.map.flipY; 

                        if (sourceImage instanceof HTMLCanvasElement) {
                            dataUrl = sourceImage.toDataURL("image/png");
                        } else if (sourceImage instanceof HTMLImageElement) {
                            const tempCanvas = document.createElement("canvas");
                            tempCanvas.width = sourceImage.width;
                            tempCanvas.height = sourceImage.height;
                            const ctx = tempCanvas.getContext("2d");
                            ctx?.drawImage(sourceImage, 0, 0);
                            dataUrl = tempCanvas.toDataURL("image/png");
                        }

                        if (dataUrl) {
                            const imagePromise = new Promise<void>((resolve) => {
                                const newImg = new Image();
                                newImg.onload = () => {
                                    const newTexture = new THREE.Texture(newImg);
                                    newTexture.needsUpdate = true;
                                    
                                    // UŻYWAMY ZAPISANEJ WARTOŚCI
                                    newTexture.flipY = originalFlipY; 
                                    
                                    safeMaterial.map = newTexture;
                                    resolve();
                                };
                                newImg.onerror = () => {
                                    console.warn("Nie udało się załadować obrazka do eksportu.");
                                    resolve();
                                };
                                newImg.src = dataUrl;
                            });

                            texturePromises.push(imagePromise);
                        }
                    } catch (e) {
                        console.warn("Nie udało się odczytać mapy.", e);
                    }
                }

                node.material = safeMaterial;
            }
        });

        // Usuwamy śmieci
        nodesToRemove.forEach(node => node.parent?.remove(node));

        // ZMIANA 4: Zatrzymujemy kod i czekamy, aż wszystkie obrazki się załadują!
        await Promise.all(texturePromises);

        // ZMIANA 5: Dopiero teraz odpalamy eksportera
        exporter.parse(
            clone,
            (result) => {
                if (result instanceof ArrayBuffer) {
                    const blob = new Blob([result], { type: 'application/octet-stream' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'moj_model_pomalowany.glb';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            },
            (error) => console.error('Błąd eksportu GLTF:', error),
            { binary: true }
        );
    };

    useEffect(() => {
        setReady(false);
        const timer = setTimeout(() => setReady(true), 150);
        return () => clearTimeout(timer);
    }, [modelUrl]);

    return (
        <div className="relative w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 3], fov: 40 }}
                shadows
                gl={{ 
                    antialias: true, 
                    preserveDrawingBuffer: true, // Niezbędne do odczytu danych canvasa
                    toneMapping: THREE.ACESFilmicToneMapping, 
                    outputColorSpace: THREE.SRGBColorSpace 
                }}
                style={{ position: 'absolute' }}
            >
                <color attach="background" args={[bgColor]} />
                
                {/* Wszystko wewnątrz tej grupy zostanie wyeksportowane */}
                <group key={modelUrl} >
                    <Suspense fallback={null}>
                        <Environment preset="sunset" />
                        <Stage adjustCamera={false} intensity={0.5}>
                            <Center top>
                                <group ref={groupRef}>
                                <Mesh 
                                    speed={rotationSpeed} 
                                    modelUrl={modelUrl} 
                                    brush={brush} 
                                />
                                </group>
                            </Center>
                        </Stage>
                        <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
                    </Suspense>
                </group>

                {ready && (
                    <OrbitControls
                        maxDistance={6}
                        makeDefault
                        enabled={brush.mode === 'orbit'}
                    />
                )}

                {/* NAPRAWA: Dodano normalPass do EffectComposer */}
                <EffectComposer enableNormalPass={true}>
                    <SSAO 
                        intensity={1.5} 
                        radius={0.4} 
                        luminanceInfluence={0.5} 
                        color={new THREE.Color('black')} 
                    />
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
                    <SMAA />
                </EffectComposer>

            </Canvas>
        </div>
    );
};