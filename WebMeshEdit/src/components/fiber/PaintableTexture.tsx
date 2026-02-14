import { useMemo, useCallback, useRef } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";

export const usePaintableTexture = (defaultSize = 1024) => {
    const lastUV = useRef<{ x: number; y: number } | null>(null);
    
    // Tworzymy canvas tylko raz
    const canvas = useMemo(() => {
        const canva = document.createElement('canvas');
        canva.width = defaultSize;
        canva.height = defaultSize;
        return canva;
    }, [defaultSize]);

    const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);

    const initCanvas = useCallback((baseImage: HTMLImageElement | HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;

            ctx.save();
            ctx.scale(1, -1); 
            ctx.drawImage(baseImage, 0, 0, canvas.width, -canvas.height); 
            ctx.restore();

            texture.needsUpdate = true;
        }
    }, [canvas, texture]);

    const paint = useCallback((
        e: ThreeEvent<PointerEvent>, 
        color = 'red', 
        brushSize = 30, 
        patternImage?: HTMLImageElement | null
    ) => {
        if (!e.uv) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const x = e.uv.x * w;
        const y = (1 - e.uv.y) * h;

        if (lastUV.current) {
            const dx = e.uv.x - lastUV.current.x;
            const dy = e.uv.y - lastUV.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0.1) lastUV.current = null;
        }

        // --- GŁÓWNA ZMIANA: Obsługa tekstury ---
        if (patternImage) {
            // Tworzymy powtarzający się wzór z obrazka
            const pattern = ctx.createPattern(patternImage, 'repeat');
            ctx.strokeStyle = pattern || color;
            ctx.fillStyle = pattern || color;
        } else {
            // Zwykły kolor, jeśli nie ma tekstury
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
        }

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        if (lastUV.current) {
            ctx.moveTo(lastUV.current.x * w, (1 - lastUV.current.y) * h);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        lastUV.current = { x: e.uv.x, y: e.uv.y };
        texture.needsUpdate = true;
    }, [canvas, texture]);

    const stopPainting = useCallback(() => {
        lastUV.current = null;
    }, []);

    const clear = useCallback(() => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            texture.needsUpdate = true;
        }
    }, [canvas, texture]);

    return { texture, paint, stopPainting, clear, initCanvas };
}