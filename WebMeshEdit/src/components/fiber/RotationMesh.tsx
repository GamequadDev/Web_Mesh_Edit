import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";


interface RotationProps
{
    isRotating: boolean;
    speed: number;
}


export const useRotation = ({isRotating, speed} : RotationProps) => {
    
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((_state, delta) => {
        if (isRotating) {
            meshRef.current.rotation.y += delta * speed;
            //meshRef.current.rotation.x += delta * (speed / 3);
        }
    });


    return meshRef
}