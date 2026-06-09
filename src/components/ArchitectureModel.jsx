import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fallbackMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C8BFB0'),
    roughness: 0.8,
    metalness: 0.05,
});

function fixMaterials(obj) {
    obj.traverse((node) => {
        if (node.isMesh) {
            if (!node.material) { node.material = fallbackMat; return; }
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((mat, i) => {
                if (!mat.color) return;
                const { r, g, b } = mat.color;
                if (r + g + b < 0.1) {
                    const rep = fallbackMat.clone();
                    if (Array.isArray(node.material)) node.material[i] = rep;
                    else node.material = rep;
                }
                if (mat.transparent && mat.opacity < 0.05) mat.opacity = 0.7;
            });
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
}

function Building() {
    const { scene } = useGLTF('/model.glb');

    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const scale = 4;
        scene.scale.setScalar(scale);
        scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        fixMaterials(scene);
    }, [scene]);

    return <primitive object={scene} />;
}

useGLTF.preload('/model.glb');

// Desktop camera path — wide/landscape view
const CAMERA_PATH_DESKTOP = [
    { pos: [12, 4, 10],  target: [0, 2, 0] },
    { pos: [8,  3,  -8], target: [0, 2, 0] },
    { pos: [-6, 6,  6],  target: [0, 1, 0] },
    { pos: [0,  12, 0],  target: [0, 0, 0] },
];

// Mobile/tablet camera path — pulled back to show full model in portrait
const CAMERA_PATH_MOBILE = [
    { pos: [16, 6, 14],  target: [0, 2, 0] },
    { pos: [12, 5, -10], target: [0, 2, 0] },
    { pos: [-8, 8,  8],  target: [0, 1, 0] },
    { pos: [0,  15, 0],  target: [0, 0, 0] },
];

// Tablet sits between the two
const CAMERA_PATH_TABLET = [
    { pos: [14, 5, 12],  target: [0, 2, 0] },
    { pos: [10, 4,  -9], target: [0, 2, 0] },
    { pos: [-7, 7,  7],  target: [0, 1, 0] },
    { pos: [0,  13, 0],  target: [0, 0, 0] },
];

function getCameraPath() {
    const w = window.innerWidth;
    if (w < 768) return CAMERA_PATH_MOBILE;
    if (w < 1024) return CAMERA_PATH_TABLET;
    return CAMERA_PATH_DESKTOP;
}

function getFov() {
    const w = window.innerWidth;
    if (w < 768) return 55;   // wider fov to see more on narrow screen
    if (w < 1024) return 50;
    return 45;
}

export default function ArchitectureModel() {
    const groupRef = useRef();
    const { camera } = useThree();
    const progressRef = useRef(0);
    const cameraPathRef = useRef(getCameraPath());

    useEffect(() => {
        // Update camera path on resize
        const onResize = () => {
            cameraPathRef.current = getCameraPath();
            camera.fov = getFov();
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        camera.position.set(...cameraPathRef.current[0].pos);
        camera.lookAt(0, 2, 0);
        camera.fov = getFov();
        camera.near = 0.01;
        camera.far = 1000;
        camera.updateProjectionMatrix();

        return () => window.removeEventListener('resize', onResize);
    }, [camera]);

    useEffect(() => {
        const proxy = { t: 0 };
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#scroll-driver',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,
                onUpdate: (self) => { progressRef.current = self.progress; },
            },
        });
        tl.to(proxy, {
            t: 1,
            ease: 'none',
            onUpdate: () => {
                const path = cameraPathRef.current;
                const t = proxy.t;
                const segments = path.length - 1;
                const seg = Math.min(Math.floor(t * segments), segments - 1);
                const segT = (t * segments) - seg;
                const from = path[seg];
                const to   = path[seg + 1];
                camera.position.lerpVectors(
                    new THREE.Vector3(...from.pos),
                    new THREE.Vector3(...to.pos),
                    segT
                );
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

    useFrame(({ clock }) => {
        if (progressRef.current < 0.02 && groupRef.current) {
            groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.04;
        }
    });

    return (
        <group ref={groupRef}>
            <Building />
        </group>
    );
}