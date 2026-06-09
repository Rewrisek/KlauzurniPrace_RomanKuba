import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    label: 'A-00 / CONCEPT',
    heading: 'Architecture\nas\nNarrative',
    body: 'A building is not an object. It is a sequence of decisions made visible — light negotiated through concrete, structure made legible through shadow.',
    align: 'left',
    offset: '10vh',
  },
  {
    label: 'A-01 / SITE',
    heading: 'Reading\nthe Ground',
    body: 'The site dictates the logic. Topography, orientation, and the movement of people through the landscape are not constraints — they are the material.',
    align: 'right',
    offset: '0vh',
  },
  {
    label: 'A-02 / STRUCTURE',
    heading: 'Load\nMade\nVisible',
    body: 'Columns, slabs, cantilevers. Each structural element is an honest expression of force — gravity turned into architecture.',
    align: 'left',
    offset: '15vh',
  },
  {
    label: 'A-03 / ATMOSPHERE',
    heading: 'Light\nas\nMaterial',
    body: 'The final material added to any project is light. It arrives at different angles, in different qualities, and transforms the same space across every hour of every day.',
    align: 'center',
    offset: '0vh',
  },
];

function SectionCard({ label, heading, align, body, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      end: 'bottom 20%',
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }),
      onLeave: () => gsap.to(el, { opacity: 0, y: -20, duration: 0.8, ease: 'power2.in' }),
      onEnterBack: () => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }),
      onLeaveBack: () => gsap.to(el, { opacity: 0, y: 40, duration: 0.8, ease: 'power2.in' }),
    });

    return () => trigger.kill();
  }, []);

  const alignClass = align === 'right'
    ? 'ml-auto mr-[5vw]'
    : align === 'center'
    ? 'mx-auto'
    : 'ml-[5vw]';

  return (
    <div
      ref={cardRef}
      className={`relative max-w-sm ${alignClass}`}
      style={{ opacity: 0 }}
    >
      {/* Architectural drawing notation label */}
      <div className="section-label mb-4 flex items-center gap-3">
        <span className="inline-block w-4 border-t border-[#4A5568]" />
        {label}
      </div>

      {/* Hairline accent */}
      <div className="arch-rule-accent mb-5 w-16" style={{ borderTopColor: '#C8BFB0', opacity: 0.4 }} />

      <h2
        className="display-heading text-[#F5F2ED] mb-6 whitespace-pre-line"
        style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
      >
        {heading}
      </h2>

      <p className="body-text text-[#8A8A8A]" style={{ fontSize: '0.875rem', maxWidth: '28ch' }}>
        {body}
      </p>

      {/* Index number — architectural drawing style */}
      <div
        className="absolute -right-8 top-0 section-label"
        style={{ color: '#1E1E1E', fontSize: '4rem', fontWeight: 300, lineHeight: 1, userSelect: 'none' }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
}

export default function OverlayUI() {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.from(heroRef.current.querySelectorAll('.hero-animate'), {
      opacity: 0,
      y: 30,
      duration: 1.4,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.5,
    });
  }, []);

  return (
    <div
      id="scroll-driver"
      style={{
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* ── HERO ─────────────────────────────────── */}
      <section
        ref={heroRef}
        className="h-screen flex flex-col justify-end pb-16 px-[5vw]"
      >
        <div className="hero-animate section-label mb-6">
          Architectural Presentation / 2024
        </div>

        <h1
          className="hero-animate display-heading text-[#F5F2ED] mb-6"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', maxWidth: '12ch' }}
        >
          Structure.<br />Light.<br />Ground.
        </h1>

        <p
          className="hero-animate body-text text-[#8A8A8A] mb-10"
          style={{ fontSize: '0.9rem', maxWidth: '38ch' }}
        >
          Scroll to navigate the architecture.
        </p>

        {/* Scroll indicator */}
        <div className="hero-animate flex items-center gap-3">
          <div
            className="w-px bg-[#4A5568]"
            style={{
              height: '48px',
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
          <span className="section-label" style={{ fontSize: '0.6rem' }}>
            scroll
          </span>
        </div>
      </section>

      {/* ── TEXT SECTIONS ────────────────────────── */}
      {sections.map((section, i) => (
        <section
          key={i}
          className="min-h-screen flex items-center px-[5vw] py-24"
          style={{ marginTop: i === 0 ? '0' : section.offset }}
        >
          <SectionCard {...section} index={i} />
        </section>
      ))}

      {/* ── CLOSING SECTION ──────────────────────── */}
      <section className="h-screen flex flex-col items-center justify-center px-[5vw] text-center">
        <div className="section-label mb-8" style={{ pointerEvents: 'none' }}>
          A-04 / PROJECT
        </div>
        <h2
          className="display-heading text-[#F5F2ED] mb-8"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          Explore the Full Drawing Set
        </h2>
        <div
          className="arch-rule-accent mx-auto mb-8"
          style={{ width: '60px', borderTopColor: '#C8BFB0', opacity: 0.4 }}
        />
        <p className="body-text text-[#8A8A8A]" style={{ fontSize: '0.85rem', maxWidth: '30ch' }}>
          Plans · Sections · Elevations · Details
        </p>
      </section>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
