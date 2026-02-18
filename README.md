# <img src="public/Img1.png" width="1900" height="900" valign="middle"> GLB Painter

## Live Demo https://glbpainterdeploy.vercel.app/

**GLB Painter** is a modern, browser-based 3D graphics editor for painting 3D models in real-time.

## 🚀 Features

* **Real-time Texture Painting**: Utilizes CanvasTexture technology to apply colors and patterns directly onto 3D model meshes.
* **GLB/GLTF Model Importing**: A system for loading custom files from the user's local storage.
* **Project Export**: Allows downloading the modified model as a `.glb` file, preserving all applied texture changes.
* **Mesh Controls**: Rotation speed adjustment.
* **Texture Brushes**: Ability to use images as painting patterns (e.g., grass, stone, rust).

---

## ⚠️ Important: UV Mapping

The quality and precision of painting within the application are directly dependent on the model's UV mapping structure. Please note the following:
* **Broken UVs**: If a model has incorrect or overlapping UV islands, painting may cause visual artifacts in unexpected areas of the model.
* **Distortions**: Uneven UV mapping can lead to stretching of applied textures or brush strokes.
* **Missing UV Maps**: Models without defined UV coordinates will not support the painting functionality.

---

## 🛠️ Tech

Projekt został zbudowany przy użyciu:

* **Framework**: [React 19](https://react.dev/)
* **Library**: [React Three Fiber](https://r3f.docs.pmnd.rs/), [Three.js](https://threejs.org/)
* **UI Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Programing Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Setup

1.  **Docker compose**:
    ```bash
    docker compose up --build
    ```
