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

// Hook to detect mobile/tablet
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(() => window.innerWidth >= 768 && window.innerWidth < 1024);

    useEffect(() => {
        const handler = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return { isMobile, isTablet };
}

function FixedPanel({ active }) {
    const s = sections[active];
    const panelRef = useRef(null);
    const prevActive = useRef(active);
    const { isMobile, isTablet } = useIsMobile();

    useEffect(() => {
        if (!panelRef.current) return;
        if (prevActive.current === active) return;
        prevActive.current = active;

        gsap.fromTo(panelRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, [active]);

    // On mobile: always bottom-centre, full width, compact
    // On tablet: same as mobile but slightly wider
    // On desktop: left/right as designed
    const getMobileStyle = () => ({
        left: '0',
        right: '0',
        bottom: '0',
        maxWidth: '100%',
        textAlign: 'left',
        padding: '16px 20px 20px',
        background: 'linear-gradient(to top, rgba(10,10,10,0.96) 70%, transparent)',
    });

    const getTabletStyle = () => ({
        left: s.align === 'right' ? 'auto' : '5vw',
        right: s.align === 'right' ? '5vw' : 'auto',
        bottom: '8vh',
        maxWidth: '380px',
        textAlign: s.align === 'right' ? 'right' : 'left',
        padding: 0,
        background: 'none',
    });

    const getDesktopStyle = () => ({
        left: s.align === 'right' ? 'auto' : '6vw',
        right: s.align === 'right' ? '6vw' : 'auto',
        bottom: '10vh',
        maxWidth: '320px',
        textAlign: s.align === 'right' ? 'right' : 'left',
        padding: 0,
        background: 'none',
    });

    const posStyle = isMobile ? getMobileStyle() : isTablet ? getTabletStyle() : getDesktopStyle();

    return (
        <div
            ref={panelRef}
            style={{
                position: 'fixed',
                zIndex: 20,
                pointerEvents: 'none',
                ...posStyle,
            }}
        >
            <div
                className="section-label mb-3 flex items-center gap-3"
                style={posStyle.textAlign === 'right' ? { justifyContent: 'flex-end' } : {}}
            >
                {posStyle.textAlign !== 'right' && <span className="inline-block w-4 border-t border-[#4A5568]" />}
                {s.label}
                {posStyle.textAlign === 'right' && <span className="inline-block w-4 border-t border-[#4A5568]" />}
            </div>

            <div
                className="mb-3 w-10"
                style={{
                    borderTop: '1px solid #C8BFB0',
                    opacity: 0.4,
                    marginLeft: posStyle.textAlign === 'right' ? 'auto' : 0,
                }}
            />

            <h2
                className="display-heading text-[#F5F2ED] mb-3 whitespace-pre-line"
                style={{
                    fontSize: isMobile
                        ? 'clamp(1.8rem, 7vw, 2.4rem)'
                        : isTablet
                            ? 'clamp(2rem, 3vw, 2.8rem)'
                            : 'clamp(2.2rem, 3.5vw, 3.2rem)',
                }}
            >
                {s.heading}
            </h2>

            <p
                className="body-text text-[#8A8A8A]"
                style={{
                    fontSize: isMobile ? '0.75rem' : '0.82rem',
                    maxWidth: isMobile ? '100%' : '28ch',
                    marginLeft: posStyle.textAlign === 'right' ? 'auto' : 0,
                    lineHeight: isMobile ? 1.6 : 1.7,
                }}
            >
                {s.body}
            </p>
        </div>
    );
}

function ProgressDots({ active }) {
    const { isMobile } = useIsMobile();

    // On mobile: dots move to bottom-right corner, horizontal layout
    if (isMobile) {
        return (
            <div style={{
                position: 'fixed',
                right: '20px',
                bottom: '90px', // above the text panel
                zIndex: 21,
                display: 'flex',
                flexDirection: 'row',
                gap: '6px',
                pointerEvents: 'none',
            }}>
                {sections.map((_, i) => (
                    <div key={i} style={{
                        height: '2px',
                        width: i === active ? '20px' : '6px',
                        background: i === active ? '#C8BFB0' : '#2A2A2A',
                        transition: 'all 0.4s ease',
                        borderRadius: '1px',
                    }} />
                ))}
            </div>
        );
    }

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
                    width: '2px',
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
    const { isMobile, isTablet } = useIsMobile();

    // Hero entrance
    useEffect(() => {
        if (!heroRef.current) return;
        const els = heroRef.current.querySelectorAll('.hero-animate');
        gsap.set(els, { opacity: 0, y: 24 });
        gsap.to(els, {
            opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out', delay: 0.4,
        });
    }, []);

    useEffect(() => {
        scrollTriggersRef.current.forEach(t => t.kill());
        scrollTriggersRef.current = [];

        sections.forEach((_, i) => {
            const markerId = `#section-marker-${i}`;
            const t = ScrollTrigger.create({
                trigger: markerId,
                start: 'top 60%',
                onEnter: () => { setActiveSection(i); setShowPanel(true); },
                onEnterBack: () => { setActiveSection(i); setShowPanel(true); },
            });
            scrollTriggersRef.current.push(t);
        });

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

            {showPanel && <FixedPanel active={activeSection} />}
            {showPanel && <ProgressDots active={activeSection} />}

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                className="h-screen flex flex-col justify-end pb-12 px-[5vw]"
                style={{ pointerEvents: 'none' }}
            >
                <div className="hero-animate section-label mb-4">Klauzurní Práce / 2026</div>
                <h1
                    className="hero-animate display-heading text-[#F5F2ED] mb-5"
                    style={{
                        fontSize: isMobile
                            ? 'clamp(2.8rem, 12vw, 4.5rem)'
                            : isTablet
                                ? 'clamp(3rem, 7vw, 5.5rem)'
                                : 'clamp(3.5rem, 8vw, 7rem)',
                        maxWidth: '12ch',
                    }}
                >
                    Plachta.<br />Horizontu.<br />Ostrova.
                </h1>
                <p
                    className="hero-animate body-text text-[#8A8A8A] mb-8"
                    style={{
                        fontSize: isMobile ? '0.78rem' : '0.9rem',
                        maxWidth: '34ch',
                    }}
                >
                    Procházejte architekturu scrollováním.
                </p>
                <div className="hero-animate flex items-center gap-3">
                    <div
                        className="w-px bg-[#4A5568]"
                        style={{ height: isMobile ? '36px' : '48px', animation: 'scrollPulse 2s ease-in-out infinite' }}
                    />
                    <span className="section-label" style={{ fontSize: '0.6rem' }}>scroll</span>
                </div>
            </section>

            {/* ── SCROLL SECTION MARKERS ── */}
            {sections.map((_, i) => (
                <div
                    key={i}
                    id={`section-marker-${i}`}
                    style={{ height: `${SECTION_SCROLL_HEIGHT}vh`, pointerEvents: 'none' }}
                />
            ))}

            {/* ── CLOSING ── */}
            <section
                className="h-screen flex flex-col items-center justify-center text-center"
                style={{
                    pointerEvents: 'auto',
                    padding: isMobile ? '0 6vw' : '0 5vw',
                }}
            >
                <div className="section-label mb-6">A-04 / DOKUMENTACE</div>
                <h2
                    className="display-heading text-[#F5F2ED] mb-6"
                    style={{
                        fontSize: isMobile
                            ? 'clamp(1.8rem, 7vw, 2.4rem)'
                            : 'clamp(2rem, 4vw, 3.5rem)',
                    }}
                >
                    Plachta Horizontu
                </h2>
                <div className="mx-auto mb-8 w-14" style={{ borderTop: '1px solid #C8BFB0', opacity: 0.35 }} />
                <button
                    onClick={() => setShowPDF(true)}
                    className="body-text"
                    style={{
                        fontSize: isMobile ? '0.7rem' : '0.82rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: 'JetBrains Mono, monospace',
                        background: 'none',
                        border: '1px solid #2A2A2A',
                        color: '#C8BFB0',
                        padding: isMobile ? '12px 24px' : '14px 32px',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s, color 0.3s',
                        // Ensure 44px min touch target
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8BFB0'; e.currentTarget.style.color = '#F5F2ED'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#C8BFB0'; }}
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
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    pointerEvents: 'auto',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {/* Close button — large touch target */}
                    <button
                        onClick={() => setShowPDF(false)}
                        style={{
                            position: 'sticky',
                            top: 0,
                            alignSelf: 'flex-end',
                            zIndex: 101,
                            background: 'rgba(0,0,0,0.85)',
                            border: 'none',
                            color: '#C8BFB0',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.7rem',
                            letterSpacing: '0.15em',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            // 44×44 touch target
                            minWidth: '44px',
                            minHeight: '44px',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        ✕ Zavřít
                    </button>

                    {isMobile ? (
                        // On mobile, link out instead of iframe (iframes are unusable on iOS Safari)
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            gap: '24px',
                            padding: '40px 24px',
                            textAlign: 'center',
                        }}>
                            <div className="section-label" style={{ color: '#4A5568' }}>A-04 / DOKUMENTACE</div>
                            <p className="body-text text-[#8A8A8A]" style={{ fontSize: '0.8rem', maxWidth: '30ch' }}>
                                Na mobilních zařízeních otevřete dokumentaci v novém okně.
                            </p>
                            <a
                                href="/presentation.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: '#C8BFB0',
                                    border: '1px solid #C8BFB0',
                                    padding: '14px 28px',
                                    textDecoration: 'none',
                                    minHeight: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                Otevřít PDF →
                            </a>
                        </div>
                    ) : (
                        <iframe
                            src="/presentation.pdf"
                            title="Plachta Horizontu — Dokumentace"
                            style={{
                                width: isTablet ? '94vw' : '88vw',
                                height: isTablet ? '85vh' : '90vh',
                                border: 'none',
                                background: '#F5F2ED',
                                flex: '0 0 auto',
                            }}
                        />
                    )}
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