import { Scene } from "@/components/fiber/Scene.tsx";
import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";

function App() {

  const colorBackground: string = "#373e4a";

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 overflow-x-hidden  text-center">

      <Navbar />

      <div className="flex flex-row md:flex-row flex-1">

          {/* Render 3D */}
          <main className="p-2 bg-blue-900 flex-1 border-r">
                <Scene bgColor={colorBackground} modelUrl=" " />
          </main>

          {/* Right Content */}
          <div className="bg-gray-200 p-10 md:w-1/5">
            Right Content
          </div>
      </div>

      <Footer/>

    </div>
  )
}

export default App
