import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Preload } from '@react-three/drei';
import ArchitectureModel from './ArchitectureModel';

// Detect low-end / mobile device to reduce GPU load
function getDeviceProfile() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    return {
        // Cap dpr at 1 on mobile to save GPU bandwidth; allow 1.5 on tablet/desktop
        dpr: isMobile ? [1, 1] : isTablet ? [1, 1.25] : [1, 1.5],
        // Lighter shadow map on mobile
        shadowMapSize: isMobile ? 1024 : 2048,
        // Slightly less fill light intensity on mobile (fewer lights = faster)
        fillIntensity: isMobile ? 0.25 : 0.4,
        // Fog — slightly tighter on mobile (hides far clipping earlier)
        fogFar: isMobile ? 60 : 80,
    };
}

export default function SceneContainer() {
    const profile = getDeviceProfile();

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                // Prevent iOS rubber-band scroll from showing white behind canvas
                touchAction: 'none',
            }}
        >
            <Canvas
                shadows
                dpr={profile.dpr}
                gl={{
                    antialias: true,
                    toneMapping: 5, // ACESFilmicToneMapping
                    toneMappingExposure: 0.8,
                    // Reduce precision on mobile for performance
                    powerPreference: 'high-performance',
                }}
                camera={{ fov: 45, near: 0.1, far: 500 }}
                // Resize properly on orientation change
                style={{ touchAction: 'none' }}
            >
                <color attach="background" args={['#0A0A0A']} />
                <fog attach="fog" args={['#0A0A0A', 30, profile.fogFar]} />

                <ambientLight intensity={0.15} />

                {/* Key light — warm late afternoon */}
                <directionalLight
                    position={[8, 12, 6]}
                    intensity={1.8}
                    color="#FFF5E0"
                    castShadow
                    shadow-mapSize={[profile.shadowMapSize, profile.shadowMapSize]}
                    shadow-camera-far={60}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />

                {/* Fill light — cool north sky */}
                <directionalLight
                    position={[-6, 8, -10]}
                    intensity={profile.fillIntensity}
                    color="#B0C8E0"
                />

                {/* Ground bounce */}
                <pointLight position={[0, -1, 0]} intensity={0.1} color="#C8BFB0" />

                <Environment preset="city" />

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