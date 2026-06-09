import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sections = [
    {
        label: 'A-00 / KONCEPT',
        heading: 'Plachta\nHorizontu',
        body: 'Model reflektuje pohnutou historii ostrova. Tři hmoty symbolizují tragické rozdělení národa — a jeho schopnost znovu nalézt jednotu.',
        align: 'left',
    },
    {
        label: 'A-01 / IDENTITA',
        heading: 'Paměť\nv Hmotě',
        body: 'Abstraktní formy odkazují na identitu ostrova — námořní dopravu a rybolov, které spojují generace s obzorem a světem za ním.',
        align: 'right',
    },
    {
        label: 'A-02 / FORMA',
        heading: 'Plachta\njako Symbol',
        body: 'Tvar inspirovaný plachtěnicí není pouze gesto. Je to pohyb zachycený v betonu — touha překonat hranice, které člověk sám vytvořil.',
        align: 'left',
    },
    {
        label: 'A-03 / MÍSTO',
        heading: 'Krajina\na Kontura',
        body: 'Topografie ostrova není pozadí — je to materiál. Vrstevnice určují logiku stavby, která roste z terénu jako přirozené pokračování horizontu.',
        align: 'right',
    },
];

const SECTION_SCROLL_HEIGHT = 150; // vh per section

// Fixed text panel — always visible, swaps content on scroll
function FixedPanel({ active }) {
    const s = sections[active];
    const panelRef = useRef(null);
    const prevActive = useRef(active);

    useEffect(() => {
        if (!panelRef.current) return;
        if (prevActive.current === active) return;
        prevActive.current = active;

        // Cross-fade when section changes
        gsap.fromTo(panelRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
    }, [active]);

    const alignStyle = s.align === 'right'
        ? { right: '6vw', left: 'auto', textAlign: 'right' }
        : { left: '6vw', right: 'auto', textAlign: 'left' };

    return (
        <div
            ref={panelRef}
            style={{
                position: 'fixed',
                bottom: '10vh',
                maxWidth: '320px',
                zIndex: 20,
                pointerEvents: 'none',
                ...alignStyle,
            }}
        >
            <div className="section-label mb-4 flex items-center gap-3" style={s.align === 'right' ? { justifyContent: 'flex-end' } : {}}>
                {s.align !== 'right' && <span className="inline-block w-4 border-t border-[#4A5568]" />}
                {s.label}
                {s.align === 'right' && <span className="inline-block w-4 border-t border-[#4A5568]" />}
            </div>

            <div className="mb-4 w-10" style={{ borderTop: '1px solid #C8BFB0', opacity: 0.4, marginLeft: s.align === 'right' ? 'auto' : 0 }} />

            <h2
                className="display-heading text-[#F5F2ED] mb-4 whitespace-pre-line"
                style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)' }}
            >
                {s.heading}
            </h2>

            <p className="body-text text-[#8A8A8A]" style={{ fontSize: '0.82rem', maxWidth: '28ch', marginLeft: s.align === 'right' ? 'auto' : 0 }}>
                {s.body}
            </p>
        </div>
    );
}

// Progress dots — show which section you're on
function ProgressDots({ active }) {
    return (
        <div style={{
            position: 'fixed',
            right: '2vw',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none',
        }}>
            {sections.map((_, i) => (
                <div key={i} style={{
                    width: i === active ? '2px' : '2px',
                    height: i === active ? '24px' : '8px',
                    background: i === active ? '#C8BFB0' : '#2A2A2A',
                    transition: 'all 0.4s ease',
                    borderRadius: '1px',
                }} />
            ))}
        </div>
    );
}

export default function OverlayUI() {
    const heroRef = useRef(null);
    const [activeSection, setActiveSection] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const scrollTriggersRef = useRef([]);

    // Hero entrance
    useEffect(() => {
        if (!heroRef.current) return;
        const els = heroRef.current.querySelectorAll('.hero-animate');
        gsap.set(els, { opacity: 0, y: 30 });
        gsap.to(els, {
            opacity: 1, y: 0, duration: 1.4, stagger: 0.15, ease: 'power3.out', delay: 0.5,
        });
    }, []);

    // Set up scroll triggers for each section marker
    useEffect(() => {
        // Kill old triggers
        scrollTriggersRef.current.forEach(t => t.kill());
        scrollTriggersRef.current = [];

        sections.forEach((_, i) => {
            const markerId = `#section-marker-${i}`;

            const t = ScrollTrigger.create({
                trigger: markerId,
                start: 'top 60%',
                onEnter: () => {
                    setActiveSection(i);
                    setShowPanel(true);
                },
                onEnterBack: () => {
                    setActiveSection(i);
                    setShowPanel(true);
                },
            });

            scrollTriggersRef.current.push(t);
        });

        // Hide panel before first section
        const hideT = ScrollTrigger.create({
            trigger: '#section-marker-0',
            start: 'top 60%',
            onLeaveBack: () => setShowPanel(false),
        });
        scrollTriggersRef.current.push(hideT);

        return () => scrollTriggersRef.current.forEach(t => t.kill());
    }, []);

    return (
        <div id="scroll-driver" style={{ position: 'relative', zIndex: 10 }}>

            {/* Fixed panel — stays on screen, content swaps */}
            {showPanel && <FixedPanel active={activeSection} />}
            {showPanel && <ProgressDots active={activeSection} />}

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                className="h-screen flex flex-col justify-end pb-16 px-[5vw]"
                style={{ pointerEvents: 'none' }}
            >
                <div className="hero-animate section-label mb-6">Klauzurní Práce / 2026</div>
                <h1
                    className="hero-animate display-heading text-[#F5F2ED] mb-6"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', maxWidth: '12ch' }}
                >
                    Plachta.<br />Horizontu.<br />Ostrova.
                </h1>
                <p className="hero-animate body-text text-[#8A8A8A] mb-10" style={{ fontSize: '0.9rem', maxWidth: '38ch' }}>
                    Procházejte architekturu scrollováním.
                </p>
                <div className="hero-animate flex items-center gap-3">
                    <div className="w-px bg-[#4A5568]" style={{ height: '48px', animation: 'scrollPulse 2s ease-in-out infinite' }} />
                    <span className="section-label" style={{ fontSize: '0.6rem' }}>scroll</span>
                </div>
            </section>

            {/* ── SCROLL SECTIONS — invisible markers that trigger text swaps ── */}
            {sections.map((_, i) => (
                <div
                    key={i}
                    id={`section-marker-${i}`}
                    style={{ height: `${SECTION_SCROLL_HEIGHT}vh`, pointerEvents: 'none' }}
                />
            ))}

            {/* ── CLOSING ── */}
            <section
                className="h-screen flex flex-col items-center justify-center px-[5vw] text-center"
                style={{ pointerEvents: 'auto' }}
            >
                <div className="section-label mb-8">A-04 / DOKUMENTACE</div>
                <h2
                    className="display-heading text-[#F5F2ED] mb-8"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                >
                    Plachta Horizontu
                </h2>
                <div className="mx-auto mb-10 w-14" style={{ borderTop: '1px solid #C8BFB0', opacity: 0.35 }} />
                <button
                    onClick={() => setShowPDF(true)}
                    className="body-text text-[#8A8A8A]"
                    style={{
                        fontSize: '0.82rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: 'JetBrains Mono, monospace',
                        background: 'none',
                        border: '1px solid #2A2A2A',
                        color: '#C8BFB0',
                        padding: '14px 32px',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s, color 0.3s',
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = '#C8BFB0'; e.target.style.color = '#F5F2ED'; }}
                    onMouseLeave={e => { e.target.style.borderColor = '#2A2A2A'; e.target.style.color = '#C8BFB0'; }}
                >
                    Výkresová dokumentace
                </button>
            </section>

            {/* ── PDF OVERLAY ── */}
            {showPDF && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    background: 'rgba(0,0,0,0.92)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                }}>
                    {/* Close button */}
                    <button
                        onClick={() => setShowPDF(false)}
                        style={{
                            position: 'absolute',
                            top: '2vh',
                            right: '2vw',
                            background: 'none',
                            border: 'none',
                            color: '#C8BFB0',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.7rem',
                            letterSpacing: '0.15em',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            padding: '8px 12px',
                        }}
                    >
                        ✕ Zavřít
                    </button>

                    {/* PDF embed */}
                    <iframe
                        src="/presentation.pdf"
                        title="Plachta Horizontu — Dokumentace"
                        style={{
                            width: '88vw',
                            height: '90vh',
                            border: 'none',
                            background: '#F5F2ED',
                        }}
                    />
                </div>
            )}

            <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}