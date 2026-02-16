import React from 'react';

interface UploaderProps {
    onModelUpload: (modelUrl: string) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onModelUpload }) => {

    /*
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
                alert("File mus be .glb lub .gltf");
                return;
            }

            const url = URL.createObjectURL(file);
            onModelUpload(url);
        }
    };*/

    return (
        <label className="flex items-center justify-between px-3 py-2 bg-element-bg hover:bg-hover-bg text-txt-main border border-ui-border rounded cursor-pointer transition-all active:bg-brand group">
            <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-brand group-active:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <div className=' flex flex-col'>           
                <span className="text-[11px] font-bold uppercase tracking-wider">Upload model</span>
                <span className="text-[9px] font-italic uppercase tracking-wider">.glb or .gltf file support only</span>
                </div>
            </div>
            <input type="file" className="hidden" accept=".glb,.gltf" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onModelUpload(URL.createObjectURL(file));
            }} />
        </label>
    );
}