import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";


interface RotationMeshProps
{
    isRotating: boolean;
    speed: number;
}


export const RotationMesh = ({isRotating, speed} : RotationMeshProps) => {
    
    const meshRef = useRef<THREE.Mesh>(null!);

    //Rotation per frame

    useFrame((_state, delta) => {
        if (isRotating) {
            meshRef.current.rotation.y += delta * speed;
            meshRef.current.rotation.x += delta * (speed / 3);
        }
    });


    return (
        <mesh position={[0,0,0]}  ref={meshRef}>
                <boxGeometry args={[1,1,1]} />     
                <meshStandardMaterial color="red" />
        </mesh>
    )

}