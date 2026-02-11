import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { RotationMesh } from "./RotationMesh";
import { Environment, ContactShadows} from "@react-three/drei";
import * as THREE from "three";
import {EffectComposer, Bloom, SSAO, SMAA} from "@react-three/postprocessing";



interface SceneProps {
    bgColor: string;
    modelUrl: string;

}


export const Scene: React.FC<SceneProps> = ({bgColor, modelUrl }) => {

    return (
        <div className="relative w-full h-full">
        <Canvas
                shadows
                style={{ position: 'absolute' }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        >
            <color attach="background" args={[bgColor]}/>

            <Suspense fallback={null}>   
                <Environment preset="sunset" />
                <RotationMesh isRotating={true} speed={1} />

                {/* Soft Shadow under mesh*/}
                <ContactShadows
                position={[0,-1,0]}
                opacity={0.6}
                scale={10}
                blur={2.5}
                far={4}
                />
            </Suspense>

            {/* Postproces */}
            <EffectComposer enableNormalPass>
                <SSAO intensity={1.5} radius={0.4} luminanceInfluence={0.5} color={new THREE.Color('black')}/>
                <Bloom luminanveThreshold={1} nipmapBlur intensity={0.5}/>
                <SMAA />
            </EffectComposer>

        </Canvas>
        </div>
    );
};

export default Scene;