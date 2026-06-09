import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Preload } from '@react-three/drei';
import ArchitectureModel from './ArchitectureModel';

export default function SceneContainer() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: 5, // ACESFilmicToneMapping
          toneMappingExposure: 0.8,
        }}
        camera={{ fov: 45, near: 0.1, far: 500 }}
      >
        {/* Atmospheric lighting — moody architectural photography feel */}
        <color attach="background" args={['#0A0A0A']} />
        <fog attach="fog" args={['#0A0A0A', 30, 80]} />

        <ambientLight intensity={0.15} />

        {/* Key light — warm late afternoon */}
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.8}
          color="#FFF5E0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Fill light — cool north sky */}
        <directionalLight
          position={[-6, 8, -10]}
          intensity={0.4}
          color="#B0C8E0"
        />

        {/* Ground bounce */}
        <pointLight position={[0, -1, 0]} intensity={0.1} color="#C8BFB0" />

        {/* HDR environment for material reflections */}
        <Environment preset="city" />

        {/* Contact shadows on ground plane */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.6}
          scale={30}
          blur={2}
          far={6}
          color="#000000"
        />

        <ArchitectureModel />

        <Preload all />
      </Canvas>
    </div>
  );
}
