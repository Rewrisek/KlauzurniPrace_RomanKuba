import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        // Disable smooth scroll on touch devices — native momentum feels better
        // and Lenis smooth scroll can fight with iOS Safari's inertia
        const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

        const lenis = new Lenis({
            duration: isTouchDevice ? 1.0 : 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            // smoothTouch: false keeps native momentum on mobile (correct)
            smoothTouch: false,
            // Prevent Lenis from swallowing touch events the canvas needs
            eventsTarget: document.documentElement,
        });

        lenisRef.current = lenis;

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        lenis.on('scroll', ScrollTrigger.update);

        // Handle orientation change — ScrollTrigger needs a refresh
        const onOrientationChange = () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 300); // small delay for the browser to repaint after rotation
        };
        window.addEventListener('orientationchange', onOrientationChange);
        // Also handle resize (desktop window resize, tablet split-screen)
        window.addEventListener('resize', () => ScrollTrigger.refresh());

        return () => {
            lenis.destroy();
            window.removeEventListener('orientationchange', onOrientationChange);
        };
    }, []);

    return <>{children}</>;
}