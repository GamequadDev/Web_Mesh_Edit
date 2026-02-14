import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";


interface RotationProps
{
    speed: number;
}


export const useRotation = ({speed} : RotationProps) => {
    
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((_state, delta) => {
        if (speed > 0) {
            meshRef.current.rotation.y += delta * speed;
            //meshRef.current.rotation.x += delta * (speed / 3);
        }
    });


    return meshRef
}