import { Scene } from "@/components/fiber/Scene";
import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import { Uploader } from "@/components/ui/Uploader";
import React, {useState} from "react";
import { Toolbar } from "@/components/ui/Toolbar";
import type { BrushSettings } from "@/types/Brush";
import { MeshSettings } from "@/components/ui/MeshSettings";


function App() {

  // Background color
  const colorBackground: string = "#373e4a";

  // Model url
  const [modelUrl, setModelUrl] = useState<string>("./models/marble_bust.glb");
  
  const [brush, setBrush] = useState<BrushSettings>({
    color: '#ff0000',
    size: 10,
    mode: 'orbit'
  });

const [isRotating, setIsRotating] = useState(true);
const [rotationSpeed, setRotationSpeed] = useState(0.3);


  return (
    <div className="min-h-screen flex flex-col bg-amber-50 overflow-x-hidden  text-center">

      <Navbar />

      <div className="flex flex-row md:flex-row flex-1">

          {/* Render 3D */}
          <main className="p-2 bg-blue-900 flex-1 border-r">
                <Scene bgColor={colorBackground} modelUrl={modelUrl} brush={brush} isRotating={isRotating} rotationSpeed={rotationSpeed}/>
                <Toolbar brush={brush} setBrush={setBrush}/>
          </main>

          {/* Right Content */}
          <div className="bg-gray-200 p-10 md:w-1/5">
            Prawy
            <Uploader onModelUpload={(url) => setModelUrl(url)}/>
            <MeshSettings 
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                rotationSpeed={rotationSpeed}
                setRotationSpeed={setRotationSpeed}
            />
          </div>
      </div>

      <Footer/>

    </div>
  )
}

export default App;