import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "@/components/fiber/Mesh";
import { Environment, ContactShadows, Stage, OrbitControls, Center} from "@react-three/drei";
import * as THREE from "three";
import {EffectComposer, Bloom, SSAO, SMAA} from "@react-three/postprocessing";

export interface BrushSettings {
  mode: 'orbit' | 'paint';
  color: string;
  size: number;
}

interface SceneProps {
    bgColor: string;
    modelUrl: string;
    brush: BrushSettings;
    isRotating: boolean; 
    rotationSpeed: number;
}


export const Scene: React.FC<SceneProps> = ({bgColor, modelUrl, brush, isRotating, rotationSpeed}) => {


    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(false);
        const timer = setTimeout(() => setReady(true), 150); // Zwiększamy lekko do 150ms
        return () => clearTimeout(timer);
    }, [modelUrl]);

    return (
        <div className="relative w-full h-full">
        <Canvas
                camera={{ position: [0, 0, 3], fov: 40 }}
                shadows
                style={{ position: 'absolute' }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        >
            <color attach="background" args={[bgColor]}/>
            <group key={modelUrl}>


                    <Suspense fallback={null}>
                        <Environment preset="sunset" />
                        {/* Soft Shadow under mesh*/}
                        <Stage adjustCamera={false} intensity={0.5}>
                            <Center top>
                                <Mesh 
                                isRotating={isRotating} 
                                speed={rotationSpeed}
                                modelUrl={modelUrl}
                                brush={brush} />
                            </Center>
                        </Stage>
                        {/* Soft Shadow under mesh*/}
                        <ContactShadows
                            position={[0, -1, 0]}
                            opacity={0.6}
                            scale={10}
                            blur={2.5}
                            far={4}
                        />
                    </Suspense>

                    {/* Camera  */}
                    {ready && (
                        <OrbitControls
                            maxDistance={6}
                            makeDefault
                            enabled={brush.mode === 'orbit'}
                        />
                    )}
                </group>


                {/* Postproces */}
                <EffectComposer enableNormalPass>
                    <SSAO intensity={1.5} radius={0.4} luminanceInfluence={0.5} color={new THREE.Color('black')} />
                    <Bloom luminanveThreshold={1} nipmapBlur intensity={0.5} />
                    <SMAA />
                </EffectComposer>

            </Canvas>
        </div>
    );
};

export default Scene;