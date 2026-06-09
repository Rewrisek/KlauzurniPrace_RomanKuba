import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// Placeholder building geometry
// Replace this entire component body with:
//   const { scene } = useGLTF('/model.glb')
//   return <primitive object={scene} />
// once you have your converted GLB.
// ─────────────────────────────────────────────
function PlaceholderBuilding() {
  const concreteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C8BFB0'),
    roughness: 0.85,
    metalness: 0.05,
  }), []);

  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2A3A4A'),
    roughness: 0.05,
    metalness: 0.8,
    transparent: true,
    opacity: 0.6,
  }), []);

  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#4A5568'),
    roughness: 0.3,
    metalness: 0.9,
  }), []);

  return (
    <group>
      {/* Main volume - primary concrete block */}
      <mesh material={concreteMat} position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 3, 3]} />
      </mesh>

      {/* Secondary volume - elevated pavilion */}
      <mesh material={concreteMat} position={[1.5, 3.5, 0]} castShadow>
        <boxGeometry args={[3, 1, 2.8]} />
      </mesh>

      {/* Cantilever slab */}
      <mesh material={concreteMat} position={[-2.5, 2.95, 0]} castShadow>
        <boxGeometry args={[1, 0.1, 3]} />
      </mesh>

      {/* Ground floor glazing strip - front */}
      <mesh material={glassMat} position={[0, 0.5, 1.52]}>
        <boxGeometry args={[5.8, 1, 0.05]} />
      </mesh>

      {/* Upper glazing - left wing */}
      <mesh material={glassMat} position={[-1, 1.5, 1.52]}>
        <boxGeometry args={[3.8, 1.8, 0.05]} />
      </mesh>

      {/* Structural columns */}
      {[-2.5, -1.2, 1.2, 2.5].map((x, i) => (
        <mesh key={i} material={steelMat} position={[x, 0, 1.2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
        </mesh>
      ))}

      {/* Horizontal brise-soleil fins */}
      {[1.2, 1.6, 2.0, 2.4, 2.8, 3.2].map((y, i) => (
        <mesh key={i} material={steelMat} position={[0, y, 1.65]}>
          <boxGeometry args={[5.9, 0.04, 0.25]} />
        </mesh>
      ))}

      {/* Roof parapet */}
      <mesh material={concreteMat} position={[0, 3.05, 0]}>
        <boxGeometry args={[6.2, 0.1, 3.2]} />
      </mesh>

      {/* Side wing - lower */}
      <mesh material={concreteMat} position={[3.5, 0.75, -0.3]} castShadow>
        <boxGeometry args={[1, 1.5, 2.4]} />
      </mesh>

      {/* Ground plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#111111" roughness={0.95} />
      </mesh>

      {/* Ground grid lines - architectural plan feel */}
      <gridHelper args={[40, 40, '#1A1A1A', '#1A1A1A']} position={[0, 0, 0]} />
    </group>
  );
}

// Camera keyframes — position [x,y,z] and lookAt target [x,y,z]
// These drive the scroll-based camera animation
const CAMERA_PATH = [
  { pos: [12, 4, 10],  target: [0, 1.5, 0] },  // 0% — establishing wide shot
  { pos: [8,  3,  -8], target: [0, 2,   0] },  // 33% — side elevation
  { pos: [-6, 6,  6],  target: [0, 1,   0] },  // 66% — aerial 3/4
  { pos: [0,  12, 0],  target: [0, 0,   0] },  // 100% — top plan view
];

export default function ArchitectureModel({ scrollProgress }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const progressRef = useRef(0);

  // Set initial camera
  useEffect(() => {
    camera.position.set(...CAMERA_PATH[0].pos);
    camera.lookAt(...CAMERA_PATH[0].target);
    camera.fov = 45;
    camera.updateProjectionMatrix();
  }, [camera]);

  // Build the GSAP scroll-driven timeline
  useEffect(() => {
    const proxy = { t: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-driver',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      },
    });

    tl.to(proxy, {
      t: 1,
      ease: 'none',
      onUpdate: () => {
        const t = proxy.t;
        const segments = CAMERA_PATH.length - 1;
        const seg = Math.min(Math.floor(t * segments), segments - 1);
        const segT = (t * segments) - seg;

        const from = CAMERA_PATH[seg];
        const to   = CAMERA_PATH[seg + 1];

        // Lerp camera position
        camera.position.lerpVectors(
          new THREE.Vector3(...from.pos),
          new THREE.Vector3(...to.pos),
          segT
        );

        // Lerp look-at target
        const targetNow = new THREE.Vector3().lerpVectors(
          new THREE.Vector3(...from.target),
          new THREE.Vector3(...to.target),
          segT
        );
        camera.lookAt(targetNow);
      },
    });

    return () => tl.kill();
  }, [camera]);

  // Subtle ambient rotation for the initial "idle" state
  useFrame(({ clock }) => {
    if (progressRef.current < 0.02 && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <PlaceholderBuilding />
    </group>
  );
}
