import { useMemo, useCallback, useRef } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";



export const usePaintableTexture = (size = 1024) => {

    const lastUV = useRef<{ x: number; y: number } | null>(null);
    const canvas = useMemo(() => document.createElement('canvas'), []);

    {/* Canva 

    const canvas = useMemo(() => {
        const canva = document.createElement('canvas');
        canva.width = size;
        canva.height = size;
        const ctx = canva.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
        }
        return canva;
    }, [size]);*/}

    const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);

    const initCanvas = useCallback((baseImage: HTMLImageElement | HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // 1. Dopasuj rozmiar canvasu do oryginalnej tekstury, aby uniknąć rozciągania
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;

            // 2. Napraw problem "Flip Y"
            ctx.save();
            ctx.scale(1, -1); // Odwracamy skalę w osi Y
            ctx.drawImage(baseImage, 0, 0, canvas.width, -canvas.height); // Rysujemy "do góry"
            ctx.restore();

            texture.needsUpdate = true;
        }
    }, [canvas, texture]);

    const paint = useCallback((e: ThreeEvent<PointerEvent>, color = 'red', brushSize = 30) => {
        if (!e.uv) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const x = e.uv.x * size;
        const y = (1 - e.uv.y) * size;

        if (lastUV.current) {
            const dx = e.uv.x - lastUV.current.x;
            const dy = e.uv.y - lastUV.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0.1) {
                lastUV.current = null;
            }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        if (lastUV.current) {
            ctx.moveTo(lastUV.current.x * size, (1 - lastUV.current.y) * size);
        } else {
            ctx.moveTo(x, y);
        }
        ctx.lineTo(x, y);
        ctx.stroke();

        lastUV.current = { x: e.uv.x, y: e.uv.y };
        texture.needsUpdate = true;
    }, [canvas, size, texture]);

    const stopPainting = useCallback(() => {
        lastUV.current = null;
    }, []);

    const clear = useCallback(() => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            texture.needsUpdate = true;
        }
    }, [canvas, size, texture]);

    return { texture, paint, stopPainting, clear, initCanvas};
}