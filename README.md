# Architectural Presentation — Setup Guide

## Quick Start

```bash
npm install
npm start        # dev server at localhost:3000
npm run build    # production build
```

---

## Replacing the Placeholder with Your SketchUp Model

### Step 1 — Export from SketchUp to .glb

**Option A — SketchUp Extension (easiest)**
1. Install "glTF Export" from Extension Warehouse (by Centaur)
2. File → Export → 3D Model → `.glb`

**Option B — Via Blender (recommended for quality)**
1. Export from SketchUp as `.dae` (Collada) or `.obj`
2. Import into Blender → clean up geometry
3. File → Export → glTF 2.0 → Binary (.glb)

### Step 2 — Optimize (critical for performance)

```bash
npm install -g gltf-pipeline
gltf-pipeline -i your-model.glb -o model.glb --draco.compressionLevel 7
```
Target: under 200,000 faces for smooth 60fps scroll.

### Step 3 — Swap into the app

1. Copy `model.glb` into the `public/` folder
2. In `src/components/ArchitectureModel.jsx`, replace `PlaceholderBuilding` with:

```jsx
import { useGLTF } from '@react-three/drei';

function PlaceholderBuilding() {
  const { scene } = useGLTF('/model.glb');
  scene.scale.set(0.01, 0.01, 0.01); // SketchUp units are mm
  return <primitive object={scene} />;
}

useGLTF.preload('/model.glb');
```

---

## Adjusting the Camera Path

Edit `CAMERA_PATH` in `ArchitectureModel.jsx`. Each keyframe: `{ pos: [x,y,z], target: [x,y,z] }`.  
The scroll distributes evenly across all keyframes. Add as many as you need.

Tip: temporarily add `<OrbitControls />` in `SceneContainer.jsx` to explore positions, then `console.log(camera.position)`.

---

## Customizing Text Sections

Edit the `sections` array in `OverlayUI.jsx`:
```jsx
{
  label: 'A-01 / SITE',
  heading: 'Your\nHeading',
  body: 'Description text.',
  align: 'left',   // 'left' | 'right' | 'center'
  offset: '10vh',  // vertical offset for rhythm
}
```

---

## App Architecture

```
src/
├── SmoothScroll.jsx      # Lenis smooth scroll + GSAP ticker sync
├── SceneContainer.jsx    # Fixed R3F Canvas (z-index 0)
├── ArchitectureModel.jsx # 3D model + ScrollTrigger camera animation
└── OverlayUI.jsx         # HTML text panels (z-index 10, scrolls over canvas)
```

The canvas is `position: fixed`. HTML overlay scrolls over it. GSAP ScrollTrigger scrubs the camera through keyframes as the user scrolls.

---

## Deployment

```bash
npm run build
# Drop build/ folder into Netlify, or: npx vercel
```
