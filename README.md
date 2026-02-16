# <img src="public/Img1.png" width="1900" height="900" valign="middle"> GLB Painter

**GLB Painter** is a modern, browser-based 3D graphics editor that allows paint a 3d model in real-time.

## 🚀 Features

* **Real-time Texture Painting**: Utilizes CanvasTexture technology to apply colors and patterns directly onto 3D model meshes.
* **GLB/GLTF Model Importing**: A system for loading custom files from the user's local storage.
* **Project Export**: Allows downloading the modified model as a `.glb` file, preserving all applied texture changes.
* **Mesh Controls**: Rotation speed adjustment.
* **Texture Brushes**: Ability to use images as painting patterns (e.g., grass, stone, rust).

---

## 🛠️ Tech

Projekt został zbudowany przy użyciu:

* **Framework**: [React 19](https://react.dev/)
* **Silnik 3D**: [React Three Fiber](https://r3f.docs.pmnd.rs/) & [Three.js](https://threejs.org/)
* **UI Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Programing Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Installation and Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run in development mode**:
    ```bash
    npm run dev
    ```
3.  **Build for production**:
    ```bash
    npm run build
    ```