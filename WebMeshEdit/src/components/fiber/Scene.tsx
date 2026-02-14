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

    const handleExport = () => {
        if (!groupRef.current) return;

        const exporter = new GLTFExporter();
        const clone = groupRef.current.clone(true);
        const nodesToRemove: THREE.Object3D[] = [];

        clone.traverse((node: any) => {
            // 1. Zbieramy światła i pomocniki
            if (node.isLight || node.isHelper) {
                nodesToRemove.push(node);
                return; // Skok do następnego elementu
            }

            // 2. Obsługa siatki (Mesh) i wymuszenie "prawdziwego" obrazka
            if (node.isMesh) {
                const oldMat = node.material as THREE.MeshStandardMaterial;

                // Czysty materiał bazowy
                const safeMaterial = new THREE.MeshStandardMaterial({
                    color: oldMat.color,
                    roughness: 1,
                    metalness: 0
                });

                // Jeśli mamy teksturę malowaną (CanvasTexture lub Texture)
                if (oldMat.map && oldMat.map.image) {
                    try {
                        let dataUrl = "";
                        const sourceImage = oldMat.map.image;

                        // Konwersja zawartości tekstury na twardy link base64
                        if (sourceImage instanceof HTMLCanvasElement) {
                            // To jest Twój przypadek - malowany canvas
                            dataUrl = sourceImage.toDataURL("image/png");
                        } else if (sourceImage instanceof HTMLImageElement) {
                            // Jeśli to zwykły obrazek
                            const tempCanvas = document.createElement("canvas");
                            tempCanvas.width = sourceImage.width;
                            tempCanvas.height = sourceImage.height;
                            const ctx = tempCanvas.getContext("2d");
                            ctx?.drawImage(sourceImage, 0, 0);
                            dataUrl = tempCanvas.toDataURL("image/png");
                        }

                        // Jeśli mamy dane, tworzymy "głupią" teksturę obrazkową
                        if (dataUrl) {
                            const newImg = new Image();
                            newImg.src = dataUrl;
                            const newTexture = new THREE.Texture(newImg);
                            newTexture.needsUpdate = true;
                            // Ważne: kopiujemy też ustawienia układu UV, żeby malowanie pasowało
                            newTexture.flipY = oldMat.map.flipY; 
                            
                            safeMaterial.map = newTexture;
                        }
                    } catch (e) {
                        console.warn("Nie udało się odczytać mapy, eksportuję bez tekstury.", e);
                    }
                }

                node.material = safeMaterial;
            }
        });

        // 3. Usuwamy śmieci
        nodesToRemove.forEach(node => node.parent?.remove(node));

        // 4. Parsowanie
        exporter.parse(
            clone,
            (result) => {
                if (result instanceof ArrayBuffer) {
                    const blob = new Blob([result], { type: 'application/octet-stream' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'moj_model_pomalowany.glb';
                    document.body.appendChild(link); // Dla bezpieczeństwa w niektórych przeglądarkach
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