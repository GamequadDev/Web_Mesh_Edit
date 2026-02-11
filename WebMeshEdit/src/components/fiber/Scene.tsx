import { Canvas } from "@react-three/fiber";
import { div } from "three/tsl";



interface SceneProps {
    bgColor: string;
    modelUrl: string;

}


export const Scene: React.FC<SceneProps> = ({bgColor, modelUrl }) => {

    return (
        <div className="relative w-full h-full">
        <Canvas shadows style={{ position: 'absolute' }}>
            <color attach="background" args={[bgColor]}/>

            {/* Setup Simple Light */}

            <directionalLight
                position={[5,5,5]}
                intensity={2}
                castShadow 
            />


            {/* Simple Box Object */}

            <mesh position={[0,0,0]}>
                <boxGeometry args={[1,1,1]} />
                <meshStandardMaterial color="red" />
            </mesh>

        </Canvas>
        </div>
    );
};

export default Scene;