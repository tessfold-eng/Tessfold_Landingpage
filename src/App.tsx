import { useState, useEffect, useRef, useMemo } from "react";
import { submitContactLead } from "./lib/supabase";


// Helper function for smooth scrolling to sections with responsive navbar offset
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const navOffset = isMobile ? 70 : 95; // Accounts for fixed navbar height on mobile vs desktop
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + (window.scrollY || window.pageYOffset) - navOffset;
    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth",
    });
  }
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ scrolled }: { scrolled: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { label: "FEATURES", id: "features" },
    { label: "HOW IT WORKS", id: "how-it-works" },
    { label: "VISION", id: "about" },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3.5 sm:py-5"
      style={{
        background: scrolled || mobileMenuOpen ? "rgba(246,246,248,0.96)" : "transparent",
        backdropFilter: scrolled || mobileMenuOpen ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled || mobileMenuOpen ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 4px 20px -2px rgba(0,0,0,0.05)" : "none",
        transform: "translateZ(0)",
      }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-1.5 cursor-pointer select-none"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="font-bold text-xl sm:text-2xl tracking-tighter text-[#0e0e61] font-display">
            Tessfold.
          </span>
        </div>

        {/* Center links (Desktop) */}
        <div className="hidden md:flex items-center gap-10 lg:gap-12">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="text-xs font-semibold tracking-widest text-slate-700 hover:text-slate-950 cursor-pointer transition-colors select-none bg-transparent border-0 p-0"
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => handleNavClick("contact")}
            className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all text-xs font-semibold tracking-wide cursor-pointer"
          >
            Contact Us
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1 rounded-full border border-slate-300 text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <span
              className={`w-4 h-0.5 bg-slate-800 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
            />
            <span
              className={`w-4 h-0.5 bg-slate-800 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`w-4 h-0.5 bg-slate-800 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Glassmorphism Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-[#f6f6f8]/98 backdrop-blur-2xl shadow-xl px-6 py-5 flex flex-col gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="text-left text-sm font-semibold tracking-wider text-slate-800 hover:text-blue-600 transition-colors py-2.5 border-b border-slate-200/60 cursor-pointer"
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("contact")}
            className="w-full mt-2 py-3 rounded-full bg-slate-950 text-white text-xs font-semibold tracking-wide flex items-center justify-center shadow-xs cursor-pointer"
          >
            Get in touch
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const shipParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (shipParallaxRef.current) {
            shipParallaxRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.08}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="platform"
      className="relative z-10 min-h-screen h-auto md:h-[100vh] md:min-h-[750px] flex flex-col overflow-hidden"
      style={{ background: "#f6f6f8", paddingTop: "80px", paddingBottom: "36px" }}
    >
      {/* Giant Background Watermark Text: Tessfold */}
      <div
        className="absolute top-[28%] sm:top-[32%] md:top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-display font-bold tracking-tighter text-white z-0 w-full text-center"
        style={{
          fontSize: "clamp(80px, 22vw, 420px)",
          color: "rgba(255, 255, 255, 0.95)",
          textShadow: "0 4px 30px rgba(0,0,0,0.02)",
          lineHeight: 0.8,
        }}
      >
        Tessfold
      </div>

      {/* Hero Central Ship Visual (Centered on mobile, majestic on desktop) */}
      <div
        className="relative md:absolute top-auto md:top-[50%] left-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 w-full flex flex-col items-center justify-center pointer-events-none my-auto md:my-0 pt-10 sm:pt-14 md:pt-0 overflow-visible"
      >
        <div className="relative left-[calc(50%+16.5vw)] -translate-x-1/2 sm:left-[calc(50%+10vw)] md:left-auto md:translate-x-0 w-[138vw] max-w-none sm:w-[124vw] md:w-full md:min-w-[1300px] md:max-w-[1800px] flex flex-col items-center justify-center shrink-0">
          <div
            ref={shipParallaxRef}
            className="w-full flex flex-col items-center justify-center transition-transform ease-out duration-75 gpu-layer"
          >
            {/* True Base Ground Shadow */}
            <div
              className="absolute z-0 pointer-events-none anim-shadow-pulse"
              style={{
                bottom: "22%",
                left: "48%",
                width: "55%",
                height: "40px",
                borderRadius: "400%",
                background: "radial-gradient(ellipse at center, rgba(25, 32, 47, 0.9) 0%, rgba(36, 40, 50, 0.4) 50%, transparent 80%)",
                filter: "blur(18px)",
                transformOrigin: "center",
              }}
            />

            <img
              src="/firefly_hero.webp"
              alt="Tessfold Cargo Vessel"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="relative w-full h-auto object-contain z-10 transition-transform duration-1000 hover:scale-[1.01] anim-ship-float max-h-[46vh] sm:max-h-[58vh] md:max-h-[94vh]"
            />
          </div>
        </div>
      </div>

      {/* Hero Bottom Content & Stats Row */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-5 sm:px-8 md:px-12 mt-auto pointer-events-auto pb-4 sm:pb-8 pt-6 md:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end">

          {/* Left Column: Pill CTA + Tagline Headline */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-5">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-[40px] bg-[#0F172A] text-white font-semibold text-sm md:text-[15px] tracking-wide hover:bg-[#2563EB] hover:shadow-[0_16px_32px_rgba(37,99,235,0.28)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_12px_30px_rgba(15,23,42,0.35)] flex items-center gap-2 select-none transform hover:-translate-y-0.5 cursor-pointer"
            >
              Get in touch
            </button>

            <h1
              className="font-display font-normal tracking-tight text-slate-950 mt-1 whitespace-normal sm:whitespace-nowrap"
              style={{ fontSize: "clamp(24px, 3.5vw, 46px)", lineHeight: 1.2 }}
            >
              Reimagining trade
              <br />
              through <span className="underline decoration-[2.5px] #0E0E61 underline-offset-[5px]">instant execution</span>.
            </h1>
          </div>

          {/* Right Column: 2 Stat Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">

            {/* Stat Card 1 */}
            <div className="bg-white rounded-[28px] sm:rounded-[40px] p-4 sm:p-6 md:p-7 shadow-sm border border-slate-200/70 flex flex-col justify-between min-h-[145px] sm:h-[165px] relative transition-all duration-300 hover:shadow-md">
              <div>
                <span className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-950 tracking-tight">
                  94%
                </span>
              </div>
              <div className="flex items-end justify-between gap-1.5 sm:gap-2 mt-auto">
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug font-medium max-w-[125px]">
                  reduction in document errors across multi-party paperwork
                </p>
                <button
                  onClick={() => scrollToSection("features")}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0 hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="sm:w-3 sm:h-3">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-[28px] sm:rounded-[40px] p-4 sm:p-6 md:p-7 shadow-sm border border-slate-200/70 flex flex-col justify-between min-h-[145px] sm:h-[165px] relative transition-all duration-300 hover:shadow-md">
              <div>
                <span className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-950 tracking-tight">
                  47+
                </span>
              </div>
              <div className="flex items-end justify-between gap-1.5 sm:gap-2 mt-auto">
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug font-medium max-w-[125px]">
                  fields auto-verified per shipment before port departure
                </p>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0 hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="sm:w-3 sm:h-3">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Thought Segment ──────────────────────────────────────────────────────────
function ThoughtSegment() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const about = document.getElementById("about");
          if (about) {
            const top = about.getBoundingClientRect().top;
            setCovered(top <= 2);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const line1 = "Export speed is bottlenecked by your slowest document.".split(" ");
  const line2 = "Since fragmented workflows inevitably creates costly errors, true scale demands supervised automation.".split(" ");

  return (
    <section
      ref={ref}
      className={`min-h-[480px] sm:min-h-[580px] md:min-h-[660px] h-screen max-h-[1080px] sticky top-0 z-0 flex flex-col justify-center items-center bg-white px-5 sm:px-6 md:px-12 overflow-hidden transition-opacity duration-150 ${covered ? "opacity-0 pointer-events-none invisible" : "opacity-100"
        }`}
    >
      {/* Content Box - Perfectly Centered */}
      <div className="max-w-4xl mx-auto text-center font-display flex flex-col gap-4 sm:gap-6 z-10 relative">
        <p className="text-lg sm:text-2xl md:text-3xl lg:text-[38px] font-medium tracking-tight leading-[1.4] sm:leading-[1.45] text-center">
          {line1.map((word, i) => (
            <span
              key={`l1-${i}`}
              className="inline-block transition-all duration-[1500ms] ease-out mr-[0.25em]"
              style={{
                color: "#3b82f6",
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(14px)",
                filter: vis ? "blur(0px)" : "blur(4px)",
                transitionDelay: `${i * 130}ms`,
              }}
            >
              {word}
            </span>
          ))}
          {line2.map((word, i) => (
            <span
              key={`l2-${i}`}
              className="inline-block transition-all duration-[1500ms] ease-out mr-[0.25em]"
              style={{
                color: "#0E0E61",
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(14px)",
                filter: vis ? "blur(0px)" : "blur(4px)",
                transitionDelay: `${(line1.length + i) * 130 + 250}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </p>

        <div
          className="text-base md:text-lg font-medium text-slate-500 transition-all duration-[1500ms] ease-out"
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(14px)",
            filter: vis ? "blur(0px)" : "blur(4px)",
            transitionDelay: `${(line1.length + line2.length) * 130 + 450}ms`,
          }}
        >
          — Founder, CEO.
        </div>
      </div>

      {/* Moving Wavy Curve Lines Pattern - Background Overlap (2 Layers, 9 Lines total) */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[50%] overflow-hidden pointer-events-none select-none z-0 opacity-75">
        {/* Layer 1 (5 Wave Lines) */}
        <div className="absolute bottom-0 left-0 w-[200%] h-full flex anim-wave-slide">
          <svg className="w-1/2 h-full shrink-0" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="none">
            <path d="M0 30 Q 150 0, 300 30 T 600 30 T 900 30 T 1200 30" stroke="#3b82f6" strokeWidth="1.5" opacity="0.2" />
            <path d="M0 55 Q 150 25, 300 55 T 600 55 T 900 55 T 1200 55" stroke="#3b82f6" strokeWidth="2" opacity="0.35" />
            <path d="M0 80 Q 150 50, 300 80 T 600 80 T 900 80 T 1200 80" stroke="#3b82f6" strokeWidth="2.5" opacity="0.45" />
            <path d="M0 105 Q 150 75, 300 105 T 600 105 T 900 105 T 1200 105" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
            <path d="M0 130 Q 150 100, 300 130 T 600 130 T 900 130 T 1200 130" stroke="#3b82f6" strokeWidth="1.5" opacity="0.2" />
          </svg>
          <svg className="w-1/2 h-full shrink-0" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="none">
            <path d="M0 30 Q 150 0, 300 30 T 600 30 T 900 30 T 1200 30" stroke="#3b82f6" strokeWidth="1.5" opacity="0.2" />
            <path d="M0 55 Q 150 25, 300 55 T 600 55 T 900 55 T 1200 55" stroke="#3b82f6" strokeWidth="2" opacity="0.35" />
            <path d="M0 80 Q 150 50, 300 80 T 600 80 T 900 80 T 1200 80" stroke="#3b82f6" strokeWidth="2.5" opacity="0.45" />
            <path d="M0 105 Q 150 75, 300 105 T 600 105 T 900 105 T 1200 105" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
            <path d="M0 130 Q 150 100, 300 130 T 600 130 T 900 130 T 1200 130" stroke="#3b82f6" strokeWidth="1.5" opacity="0.2" />
          </svg>
        </div>

        {/* Layer 2 (4 Wave Lines, Slower Parallax) */}
        <div className="absolute bottom-0 left-0 w-[200%] h-full flex anim-wave-slide-slow opacity-60">
          <svg className="w-1/2 h-full shrink-0" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="none">
            <path d="M0 45 Q 150 75, 300 45 T 600 45 T 900 45 T 1200 45" stroke="#2563eb" strokeWidth="1.5" opacity="0.25" />
            <path d="M0 70 Q 150 100, 300 70 T 600 70 T 900 70 T 1200 70" stroke="#2563eb" strokeWidth="2" opacity="0.35" />
            <path d="M0 95 Q 150 125, 300 95 T 600 95 T 900 95 T 1200 95" stroke="#2563eb" strokeWidth="2" opacity="0.3" />
            <path d="M0 120 Q 150 150, 300 120 T 600 120 T 900 120 T 1200 120" stroke="#2563eb" strokeWidth="1.5" opacity="0.2" />
          </svg>
          <svg className="w-1/2 h-full shrink-0" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="none">
            <path d="M0 45 Q 150 75, 300 45 T 600 45 T 900 45 T 1200 45" stroke="#2563eb" strokeWidth="1.5" opacity="0.25" />
            <path d="M0 70 Q 150 100, 300 70 T 600 70 T 900 70 T 1200 70" stroke="#2563eb" strokeWidth="2" opacity="0.35" />
            <path d="M0 95 Q 150 125, 300 95 T 600 95 T 900 95 T 1200 95" stroke="#2563eb" strokeWidth="2" opacity="0.3" />
            <path d="M0 120 Q 150 150, 300 120 T 600 120 T 900 120 T 1200 120" stroke="#2563eb" strokeWidth="1.5" opacity="0.2" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── Vision / About Section ──────────────────────────────────────────────────
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28 relative z-10 overflow-hidden bg-white rounded-t-[36px] md:rounded-t-[48px] shadow-[0_-25px_60px_-15px_rgba(15,23,42,0.14)] border-t border-slate-200/90"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col">

        {/* Row 1: Section Heading */}
        <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight text-slate-950 mb-8 md:mb-12">
          The Vision
        </h2>

        {/* 3-Column Layout with Synchronized Row Heights */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          {/* Column 1 */}
          <div className="lg:col-span-3">
            <p className="text-[#94a3b8] font-medium text-base md:text-lg leading-snug font-sans m-0">
              Switch to new<br />Autonomous workflow.
            </p>
          </div>

          {/* Column 2: Header at Row 2 level, Paragraph starting at Row 3 level */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="font-display font-bold text-slate-950 text-2xl md:text-3xl tracking-tight m-0 leading-none">
              The Problem:
            </h3>
            <p className="text-[#94a3b8] text-base md:text-[17px] leading-relaxed font-sans m-0">
              The greatest barrier to faster trade is the heavy reliance of export and finance teams on manual workflows. While ERPs force manual input and generators merely auto-fill templates; neither actually cross-checks physical logistics against compliance rules. <br />  <br />What’s missing is an autonomous engine that maps multi-document data to your spreadsheets and instantly verifies 3rd-party paperwork against internal ledgers to eliminate mismatches.  </p>        </div>

          {/* Column 3: Aligned to start at the exact same height as Column 2's body paragraph */}
          <div className="lg:col-span-5 lg:pt-[44px]">
            <p className="font-display font-medium text-slate-950 text-xl md:text-2xl lg:text-[27px] leading-[1.36] tracking-tight m-0">
              To accelerate global trade by making<br /> export operations seamless and error-free.            </p>
          </div>
        </div>

        {/* Full-width Image of aboutpage.jpg (Responsive Height) */}
        <div
          className={`mt-12 sm:mt-16 md:mt-24 w-full overflow-hidden transition-all duration-1000 delay-200 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <img
            src="/vision.webp"
            alt="Tessfold Vision About Page"
            loading="lazy"
            decoding="async"
            className="w-full h-[260px] sm:h-[380px] md:h-[600px] lg:h-[700px] max-h-[75vh] object-cover object-center rounded-xl md:rounded-none shadow-sm md:shadow-none"
          />
        </div>

      </div>
    </section>
  );
}

// ─── Results Banner (Hero Off-White Gradient with Vertical Dividers) ───────────
function StatsStrip() {
  return (
    <section className="relative z-10 w-full py-12 sm:py-14 md:py-20 overflow-hidden bg-gradient-to-b from-white to-[#f7f9fc]">

      {/* Main Container */}
      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-6 md:px-10 z-10">

        {/* Top Row: Heading + Copy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-8 sm:pb-12">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
              Committed to deliver results.
            </h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#94a3b8] font-normal leading-relaxed">
              Automated EXIM documentation built to reduce compliance errors and friction-free shipments.
            </p>
          </div>
        </div>

        {/* Bottom Grid: 4 Stat Metrics with Vertical Dividers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6 md:gap-0 divide-x-0 md:divide-x divide-slate-200/70 pt-2 sm:pt-4">
          {[
            {
              n: "94%",
              desc: "Error Reduction: Reduction in document errors across EXIM shipments.",
            },
            {
              n: "10×",
              desc: "Faster Cycle: Accelerated PO to shipment workflow completion.",
            },
            {
              n: "47+",
              desc: "Fields Verified: Data points auto verified per shipment.",
            },
            {
              n: "< 3 min",
              desc: "Generation Speed: Full compliant export document pack generated.",
            },
          ].map(({ n, desc }, index) => (
            <div
              key={index}
              className={`space-y-1 sm:space-y-1.5 ${index === 0 ? "md:pr-8" : index === 3 ? "md:pl-8" : "md:px-8"} ${index % 2 === 1 ? "pl-2 sm:pl-0" : ""}`}
            >
              <div className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0E0E61] tracking-tight mb-1 sm:mb-2">
                {n}
              </div>
              <p className="font-sans text-[11px] sm:text-xs md:text-sm text-[#94a3b8] font-normal leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}

// ─── Our Story Section ────────────────────────────────────────────────────────
function OurStorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="our-story" ref={ref} className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28 relative overflow-hidden bg-white">
      <div className="max-w-[1180px] mx-auto px-6 md:px-0 flex flex-col w-full">

        {/* Section Heading (Matches 'The Vision' size and font) */}
        <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight text-slate-950 mb-8 md:mb-12">
          Our Story
        </h2>

        {/* 3-Column Grid Layout (Centered along X-axis with balanced column distribution) */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          {/* Column 1: Badge / Tag */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-slate-900">
              <img src="/arrow.png" alt="arrow" className="w-4 h-4 object-contain shrink-0" />
              <span>Who we are</span>
            </div>
          </div>

          {/* Column 2: Main Paragraph + Subtext */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <p className="font-sans text-lg sm:text-xl md:text-2xl font-medium text-slate-900 leading-relaxed tracking-tight m-0">
              We started as engineers building complex software, and realized that most ERPs were ignoring the actual bottlenecks of global trade. Fueled by the real-world friction shared by major exporters,{" "}
              <span className="text-[#94a3b8]">we decided to completely rebuild the export workflow through the lens of AI.</span>
            </p>

            {/* Subtext Row aligned along X-axis with paragraph start */}
            <div className="pt-1">
              <span className="text-xs sm:text-sm font-sans text-slate-900 font-medium">
                Meet your partners in <span className="italic font-bold text-[#FF6D13]">trade automation</span>
              </span>
            </div>
          </div>

          {/* Column 3: Secondary Description */}
          <div className="lg:col-span-3">
            <p className="text-[#94a3b8] text-xs sm:text-sm md:text-base leading-relaxed font-sans m-0">
              We believe in problem-driven product engineering. By connecting with your teams to deeply understand your daily operations, we build intelligent, automated features that directly eliminate workflow friction.            </p>
          </div>
        </div>

        {/* 4 Cards Grid Layout with Stepping Heights, Sharp Straight Corners, & Thinner Widths */}
        <div className="max-w-[1180px] mx-auto w-full">
          <div
            className={`mt-10 sm:mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-start transition-all duration-1000 delay-200 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            {/* Card 1: Content Box (Top aligned - lg:mt-0) */}
            <div className="bg-white border border-slate-200 rounded-none p-5 sm:p-6 flex flex-col justify-between h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px] shadow-sm lg:mt-0">
              <div>
                <div className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-900 mb-5 sm:mb-6">
                  <span className="flex items-center gap-1.5 font-display text-xs sm:text-sm">
                    <span className="w-4 h-4 bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold rounded-none">
                      T
                    </span>
                    TESSFOLD
                  </span>
                  <span className="text-slate-400 font-sans text-sm">↗</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-slate-950 tracking-tight mb-2 sm:mb-3 leading-tight">
                  The<br />Collaborative<br />Ethos
                </h3>
                <p className="text-[#94a3b8] text-xs sm:text-sm font-sans leading-relaxed">
                  We trade egos for open feedback and shared perspectives. For us, true development is about continuous connection.<br />Wherever you need support, <br />we will be there.
                </p>
              </div>
              <a
                href="#contact"
                className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-sans font-medium text-slate-950 hover:text-blue-600 transition-colors"
              >
                <span>Get to know the team</span>
                <span>↗</span>
              </a>
            </div>

            {/* Card 2: Vertical Image 1 (Stepped down - lg:mt-6) */}
            <div className="rounded-none overflow-hidden h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px] border border-slate-200/80 bg-slate-900 shadow-sm lg:mt-6">
              <img
                src="/1.webp"
                alt="Tessfold studio portrait 1"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-left"
              />
            </div>

            {/* Card 3: Vertical Image 2 (Stepped down further - lg:mt-12) */}
            <div className="rounded-none overflow-hidden h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px] border border-slate-200/80 bg-slate-900 shadow-sm lg:mt-12">
              <img
                src="/3.webp"
                alt="Tessfold studio portrait 2"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Card 4: Vertical Image 3 (Stepped down furthest - lg:mt-18) */}
            <div className="rounded-none overflow-hidden h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px] border border-slate-200/80 bg-slate-900 shadow-sm lg:mt-18">
              <img
                src="/2.webp"
                alt="Tessfold studio portrait 3"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

const EXIM_DOCUMENTS = [
  { name: "Shipping Bill", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { name: "Commercial Invoice", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { name: "Packing List", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  { name: "Bill of Lading (B/L)", color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
  { name: "Certificate of Origin", color: "text-amber-600 bg-amber-50 border-amber-100" },
  { name: "Letter of Credit (LC)", color: "text-purple-600 bg-purple-50 border-purple-100" },
  { name: "Bank Realisation (e-BRC)", color: "text-rose-600 bg-rose-50 border-rose-100" },
  { name: "SDF / GR Form", color: "text-teal-600 bg-teal-50 border-teal-100" },
  { name: "Marine Insurance Cert", color: "text-sky-600 bg-sky-50 border-sky-100" },
  { name: "Proforma Invoice", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { name: "Bill of Entry", color: "text-violet-600 bg-violet-50 border-violet-100" },
  { name: "Import General Manifest", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
];

const PLATFORM_FEATURES = [
  {
    title: "Dashboard Reports",
    desc: "Visualizes internal system data and metrics through shipment and financial graphs.",
  },
  {
    title: "Automated Parsing",
    desc: "Accelerates data entry workflows by parsing Excel/CSV files and automatically extracting purchase order details into sheets.",
  },
  {
    title: "Compliance Reports",
    desc: "Generates audit-ready documents—such as shipping bills, packing lists, and bills of lading—directly from the database.",
  },
  {
    title: "Central Sharing & Event Alerts",
    desc: "Triggers automated email notifications and webhooks upon document status updates, granting third parties instant, role-based S3 access to eliminate manual email threads.",
  },
  {
    title: "Cross Validation",
    desc: "Utilizes internal logic to verify data consistency and formatting across all third-party documents.",
  },
  {
    title: "Auto Harmonizing",
    desc: "Automatically standardizes and corrects data discrepancies immediately following cross-validation, ensuring uniform data across systems.",
  },
];

// ─── Platform & Freight Management Showcase (After How It Works / Automation in Action) ───
function PlatformShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [openFeature, setOpenFeature] = useState<number | null>(null);

  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="platform-showcase" ref={ref} className="pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20 md:pb-28 relative z-20 bg-white overflow-visible">
      <div className="max-w-[1180px] mx-auto px-6 md:px-8 lg:px-0 flex flex-col gap-6 sm:gap-8 md:gap-10">

        {/* ── Top Area: MacBook (Shifted Left) + Round Box with Animated Documents (Right) - Desktop Only (Hidden on Mobile) ── */}
        <div
          className={`hidden sm:flex w-full relative pt-0 pb-2 sm:pb-4 flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 xl:gap-8 transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          {/* ── Left Side: MacBook + Floating Channels Above (Shifted Left) ── */}
          <div className="w-full lg:flex-1 lg:max-w-[730px] xl:max-w-[760px] relative">

            {/* Dotted Connection SVG curves */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-40 z-0" fill="none">
              <path d="M 65 40 C 145 40, 180 140, 260 140" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,5" />
              <path d="M 105 100 C 185 100, 220 160, 280 160" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5,5" />
            </svg>

            {/* Floating Card 1 (Top-Left): Gmail Card - Positioned Behind MacBook */}
            <div className="absolute -top-6 sm:-top-8 md:-top-10 -left-2 sm:left-1 md:left-2 z-10 transform -rotate-10 hover:rotate-0 transition-transform duration-300">
              <div className="w-32 sm:w-44 md:w-52 h-11 sm:h-13 md:h-14 rounded-[16px] sm:rounded-[20px] bg-gradient-to-r from-[#ff9aa2] to-[#ffb7b2] p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-rose-500/20 border border-white/80 backdrop-blur-xs">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <img src="/Gmail.webp" alt="Gmail Ingestion" className="w-3 h-3 sm:w-5 sm:h-5 object-contain" />
                </div>
                <div className="flex flex-col min-w-0 pr-1">
                  <span className="text-[9px] sm:text-xs md:text-sm font-bold text-rose-950 truncate leading-tight font-sans">
                    PO Ingested
                  </span>
                  <span className="text-[7px] sm:text-[9.5px] text-rose-900/80 truncate font-sans">
                    buyer@globaltrade.com
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Card 2 (Below Gmail): WhatsApp Card - Positioned Behind MacBook */}
            <div className="absolute top-4 sm:top-5 md:top-5.5 left-10 sm:left-5 md:left-8 z-10 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="w-32 sm:w-44 md:w-52 h-11 sm:h-13 md:h-14 rounded-[16px] sm:rounded-[20px] bg-gradient-to-r from-[#4ade80] to-[#86efac] p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-500/15 border border-white/60 backdrop-blur-xs">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <img src="/whatsapp.png" alt="WhatsApp Ingestion" className="w-3.5 h-3.5 sm:w-5.5 sm:h-5.5 object-contain" />
                </div>
                <div className="flex flex-col min-w-0 pr-1">
                  <span className="text-[9px] sm:text-xs md:text-sm font-bold text-emerald-950 truncate leading-tight font-sans">
                    Order Stream
                  </span>
                  <span className="text-[7px] sm:text-[9.5px] text-emerald-900/80 truncate font-sans">
                    4 Items Verified ✓
                  </span>
                </div>
              </div>
            </div>

            {/* ── Central MacBook Frame with Live Custom SVG Dashboard ── */}
            <div className="relative w-full aspect-[735/490] select-none drop-shadow-[0_25px_50px_rgba(15,23,42,0.16)] mt-6 sm:mt-8 lg:mt-6 z-20">

              {/* The Live Dashboard rendered exactly in the screen cutout */}
              <div className="absolute top-[13.67%] left-[14.15%] w-[71.84%] h-[67.35%] overflow-hidden rounded-[3px] sm:rounded-[4px] bg-[#f8fafc] z-10 flex">

                {/* Dashboard Sidebar */}
                <div className="w-11 sm:w-20 md:w-28 bg-[#0c1324] text-slate-300 p-1 sm:p-2 md:p-2.5 flex flex-col justify-between shrink-0 border-r border-slate-800/80">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="px-0.5 sm:px-1">
                      <span className="font-display font-bold text-[10px] sm:text-xs md:text-sm text-white tracking-tight flex items-center gap-1">
                        Tessfold
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      </span>
                    </div>

                    <nav className="space-y-0.5 sm:space-y-1">
                      <div className="bg-blue-600/90 text-white font-medium rounded px-1.5 py-0.5 sm:py-1 text-[7px] sm:text-[8.5px] md:text-[9.5px] flex items-center shadow-xs">
                        <span className="truncate">Dashboard</span>
                      </div>
                      <div className="text-slate-400 hover:text-white px-1.5 py-0.5 sm:py-1 text-[7px] sm:text-[8.5px] md:text-[9.5px] flex items-center">
                        <span className="truncate">Shipments</span>
                      </div>
                      <div className="text-slate-400 hover:text-white px-1.5 py-0.5 sm:py-1 text-[7px] sm:text-[8.5px] md:text-[9.5px] flex items-center">
                        <span className="truncate">Customers</span>
                      </div>
                      <div className="text-slate-400 hover:text-white px-1.5 py-0.5 sm:py-1 text-[7px] sm:text-[8.5px] md:text-[9.5px] flex items-center">
                        <span className="truncate">Documents</span>
                      </div>
                      <div className="text-slate-400 hover:text-white px-1.5 py-0.5 sm:py-1 text-[7px] sm:text-[8.5px] md:text-[9.5px] flex items-center">
                        <span className="truncate">Finance</span>
                      </div>
                    </nav>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[6px] sm:text-[7.5px] md:text-[8.5px] text-slate-400 flex items-center gap-1 px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">Active Node</span>
                  </div>
                </div>

                {/* Dashboard Main Workspace */}
                <div className="flex-1 bg-[#f8fafc] p-2 sm:p-2.5 md:p-3 overflow-hidden flex flex-col justify-between gap-1.5 sm:gap-2">

                  {/* Top Bar (clears the camera notch) */}
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5">
                    <div>
                      <h4 className="font-display font-bold text-[11px] sm:text-xs md:text-sm text-slate-900 leading-none">
                        Dashboard
                      </h4>
                      <p className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-500 font-sans mt-0.5">
                        Welcome to your freight forwarding management system
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7px] sm:text-[8px] md:text-[9px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Live Stream</span>
                      </span>
                    </div>
                  </div>

                  {/* 4 Stat Cards Row */}
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {/* Card 1 */}
                    <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                      <span className="block text-[6px] sm:text-[8px] md:text-[9px] text-slate-500 truncate font-sans">
                        Total Shipments
                      </span>
                      <div className="font-display font-bold text-[10px] sm:text-xs md:text-sm text-slate-900 leading-tight mt-0.5">
                        468
                      </div>
                      <span className="text-[6px] sm:text-[7px] md:text-[8px] text-emerald-600 font-medium">
                        +12.5% from last mo.
                      </span>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                      <span className="block text-[6px] sm:text-[8px] md:text-[9px] text-slate-500 truncate font-sans">
                        Active Deliveries
                      </span>
                      <div className="font-display font-bold text-[10px] sm:text-xs md:text-sm text-slate-900 leading-tight mt-0.5">
                        127
                      </div>
                      <span className="text-[6px] sm:text-[7px] md:text-[8px] text-emerald-600 font-medium">
                        +3.2% from last mo.
                      </span>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                      <span className="block text-[6px] sm:text-[8px] md:text-[9px] text-slate-500 truncate font-sans">
                        Monthly Revenue
                      </span>
                      <div className="font-display font-bold text-[10px] sm:text-xs md:text-sm text-slate-900 leading-tight mt-0.5">
                        $189,000
                      </div>
                      <span className="text-[6px] sm:text-[7px] md:text-[8px] text-emerald-600 font-medium">
                        +9.8% growth
                      </span>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                      <span className="block text-[6px] sm:text-[8px] md:text-[9px] text-slate-500 truncate font-sans">
                        Pending Issues
                      </span>
                      <div className="font-display font-bold text-[10px] sm:text-xs md:text-sm text-emerald-700 leading-tight mt-0.5">
                        0
                      </div>
                      <span className="text-[6px] sm:text-[7px] md:text-[8px] text-emerald-600 font-medium">
                        All harmonized ✓
                      </span>
                    </div>
                  </div>

                  {/* 2 Middle Charts Row */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 flex-1 min-h-0">

                    {/* Left Chart: Shipment Volume Bar Chart */}
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="block font-semibold text-[8px] sm:text-[9px] md:text-[10px] text-slate-800 leading-tight">
                          Shipment Volume
                        </span>
                        <span className="block text-[6px] sm:text-[7px] text-slate-400 font-sans">
                          Monthly shipment count over time
                        </span>
                      </div>

                      {/* SVG Bar Chart */}
                      <div className="h-16 sm:h-20 md:h-24 w-full pt-1">
                        <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                          <line x1="0" y1="20" x2="200" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1="0" y1="45" x2="200" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1="0" y1="70" x2="200" y2="70" stroke="#e2e8f0" strokeWidth="1" />

                          {/* Bars */}
                          {[
                            { m: "Jan", val: 52, x: 18 },
                            { m: "Feb", val: 68, x: 48 },
                            { m: "Mar", val: 44, x: 78 },
                            { m: "Apr", val: 82, x: 108 },
                            { m: "May", val: 74, x: 138 },
                            { m: "Jun", val: 96, x: 168 },
                          ].map((b) => {
                            const barHeight = (b.val / 100) * 55;
                            const y = 70 - barHeight;
                            return (
                              <g key={b.m}>
                                <defs>
                                  <linearGradient id={`bar-grad-${b.m}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#2563eb" />
                                  </linearGradient>
                                </defs>
                                <rect
                                  x={b.x}
                                  y={y}
                                  width="16"
                                  height={barHeight}
                                  rx="3"
                                  fill={`url(#bar-grad-${b.m})`}
                                />
                                <text
                                  x={b.x + 8}
                                  y="78"
                                  fontSize="6"
                                  fill="#94a3b8"
                                  textAnchor="middle"
                                  fontFamily="sans-serif"
                                >
                                  {b.m}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>

                    {/* Right Chart: Revenue Trend */}
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="block font-semibold text-[8px] sm:text-[9px] md:text-[10px] text-slate-800 leading-tight">
                          Revenue Trend
                        </span>
                        <span className="block text-[6px] sm:text-[7px] text-slate-400 font-sans">
                          Monthly revenue growth
                        </span>
                      </div>

                      {/* SVG Line Chart exactly matching reference */}
                      <div className="h-16 sm:h-20 md:h-24 w-full pt-1">
                        <svg className="w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="none">
                          {/* Horizontal Grid Lines (dashed) */}
                          <line x1="28" y1="14" x2="195" y2="14" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="28" y1="29" x2="195" y2="29" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="28" y1="44" x2="195" y2="44" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="28" y1="59" x2="195" y2="59" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />

                          {/* Vertical Grid Lines (dashed) */}
                          <line x1="61" y1="14" x2="61" y2="74" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="95" y1="14" x2="95" y2="74" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="128" y1="14" x2="128" y2="74" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="162" y1="14" x2="162" y2="74" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="195" y1="14" x2="195" y2="74" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2,2" />

                          {/* Solid Y-Axis with ticks */}
                          <line x1="28" y1="14" x2="28" y2="74" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="26" y1="14" x2="28" y2="14" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="26" y1="29" x2="28" y2="29" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="26" y1="44" x2="28" y2="44" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="26" y1="59" x2="28" y2="59" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="26" y1="74" x2="28" y2="74" stroke="#94a3b8" strokeWidth="0.8" />

                          {/* Solid X-Axis with ticks */}
                          <line x1="28" y1="74" x2="195" y2="74" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="28" y1="74" x2="28" y2="76.5" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="61" y1="74" x2="61" y2="76.5" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="95" y1="74" x2="95" y2="76.5" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="128" y1="74" x2="128" y2="76.5" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="162" y1="74" x2="162" y2="76.5" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="195" y1="74" x2="195" y2="76.5" stroke="#94a3b8" strokeWidth="0.8" />

                          {/* Y-Axis Labels */}
                          <text x="24" y="16.5" fontSize="5.5" fill="#64748b" textAnchor="end" fontFamily="sans-serif">200000</text>
                          <text x="24" y="31.5" fontSize="5.5" fill="#64748b" textAnchor="end" fontFamily="sans-serif">150000</text>
                          <text x="24" y="46.5" fontSize="5.5" fill="#64748b" textAnchor="end" fontFamily="sans-serif">100000</text>
                          <text x="24" y="61.5" fontSize="5.5" fill="#64748b" textAnchor="end" fontFamily="sans-serif">50000</text>
                          <text x="24" y="74.5" fontSize="5.5" fill="#64748b" textAnchor="end" fontFamily="sans-serif">0</text>

                          {/* X-Axis Labels */}
                          <text x="28" y="83" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">Jan</text>
                          <text x="61" y="83" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">Feb</text>
                          <text x="95" y="83" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">Mar</text>
                          <text x="128" y="83" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">Apr</text>
                          <text x="162" y="83" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">May</text>
                          <text x="195" y="83" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">Jun</text>

                          {/* Green Smooth Spline Curve */}
                          <path
                            d="M 28 36.5 C 43 31.5, 48 30.5, 61 30.5 C 74 30.5, 83 33.5, 95 33.5 C 108 33.5, 116 23.5, 128 23.0 C 140 22.5, 150 22.0, 162 21.5 C 174 21.0, 184 17.5, 195 16.4"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Data Point Nodes (Hollow white circle with green stroke) */}
                          {[
                            { cx: 28, cy: 36.5 },
                            { cx: 61, cy: 30.5 },
                            { cx: 95, cy: 33.5 },
                            { cx: 128, cy: 23.0 },
                            { cx: 162, cy: 21.5 },
                            { cx: 195, cy: 16.4 },
                          ].map((pt, i) => (
                            <circle
                              key={i}
                              cx={pt.cx}
                              cy={pt.cy}
                              r="2.0"
                              fill="#ffffff"
                              stroke="#10b981"
                              strokeWidth="1.2"
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Shipment Mode + Recent Shipments */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {/* Donut Distribution */}
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2">
                      <div>
                        <span className="block font-semibold text-[7px] sm:text-[8px] md:text-[9px] text-slate-800 leading-tight">
                          Shipment Mode
                        </span>
                        <div className="space-y-0.5 mt-1 text-[6px] sm:text-[7px] text-slate-500 font-sans">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>Ocean (62%)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>Air (24%)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Road (14%)</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="55 100" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#22d3ee" strokeWidth="4" strokeDasharray="22 100" strokeDashoffset="-55" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="13 100" strokeDashoffset="-77" />
                        </svg>
                      </div>
                    </div>

                    {/* Recent Shipments Feed */}
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                      <span className="block font-semibold text-[7px] sm:text-[8px] md:text-[9px] text-slate-800 leading-tight">
                        Recent Activity
                      </span>
                      <div className="space-y-1 mt-1 text-[6px] sm:text-[7px] md:text-[8px]">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-0.5">
                          <span className="font-semibold text-slate-800">SH-001 · Shanghai</span>
                          <span className="text-blue-600 bg-blue-50 px-1 py-0.2 rounded">In Transit</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">SH-002 · Hamburg</span>
                          <span className="text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">Delivered ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Large Dashed Arrow emerging from behind MacBook with an Oval Loop pointing to Documents ── */}
              <div className="absolute top-[20%] sm:top-[22%] right-[-150px] lg:right-[-185px] xl:right-[-215px] w-[270px] lg:w-[310px] xl:w-[340px] h-[140px] lg:h-[150px] pointer-events-none select-none z-20 overflow-visible hidden lg:block">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 280 140" fill="none">
                  <defs>
                    <marker
                      id="arrow-oval-loop"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="6.5"
                      markerHeight="6.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#60a5fa" />
                    </marker>
                  </defs>
                  {/* Fluid dashed path: emerges from behind MacBook, forms sweeping oval loop, points to docs */}
                  <path
                    d="M 10 90 C 65 90, 95 18, 150 18 C 190 18, 202 78, 172 98 C 135 112, 115 65, 150 42 C 190 22, 230 65, 276 65"
                    stroke="#60a5fa"
                    strokeWidth="1.8"
                    strokeDasharray="5,5"
                    markerEnd="url(#arrow-oval-loop)"
                  />
                </svg>
              </div>

              {/* Transparent MacBook Frame placed over the screen with silver body */}
              <img
                src="/mackbooknew.png"
                alt="MacBook Frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30"
              />
            </div>
          </div>

          {/* ── Mobile Downward Dashed Arrow (Stacked Layout Only) ── */}
          <div className="flex lg:hidden items-center justify-center shrink-0 z-20 pointer-events-none select-none my-3">
            <svg className="w-8 h-12 overflow-visible" viewBox="0 0 24 48" fill="none">
              <defs>
                <marker id="arrow-down-to-doc" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 1.5 0 L 5 8 L 8.5 0 z" fill="#60a5fa" />
                </marker>
              </defs>
              <path
                d="M 12 2 C 12 16, 12 26, 12 38"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="5,5"
                markerEnd="url(#arrow-down-to-doc)"
              />
            </svg>
          </div>

          {/* ── Right Side: Just Animated Documents (No outer box, docs part only) ── */}
          <div className="w-full sm:w-auto lg:w-[260px] xl:w-[290px] shrink-0 relative z-20 flex flex-col items-center lg:items-start justify-center">
            <div className="h-[360px] sm:h-[400px] w-full max-w-[270px] overflow-hidden mask-vertical-fade relative py-2">
              <div className="anim-scroll-docs flex flex-col gap-2.5">
                {[...EXIM_DOCUMENTS, ...EXIM_DOCUMENTS].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-400/80 transition-all cursor-default group"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${doc.color}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-slate-800 text-xs sm:text-[13px] tracking-tight whitespace-nowrap group-hover:text-blue-600 transition-colors">
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* ── Bottom Bento Grid: Features Toggle Accordion + Cards ── */}
        <div
          id="features"
          className={`scroll-mt-24 md:scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start transition-all duration-1000 delay-150 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          {/* ── Left Column (lg:col-span-6): Features Toggle Accordion ── */}
          <div className="lg:col-span-6 flex flex-col justify-start py-1 sm:py-2">
            <div className="w-full max-w-[500px]">
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-950 mb-8 sm:mb-10 md:mb-12">
                Features
              </h2>

              {/* Indented Points List */}
              <div className="pl-4 sm:pl-6 md:pl-8">
                <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                  {PLATFORM_FEATURES.map((item, idx) => {
                    const isOpen = openFeature === idx;
                    return (
                      <div key={item.title} className="py-3.5 sm:py-4">
                        <button
                          type="button"
                          onClick={() => setOpenFeature(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-hidden"
                          aria-expanded={isOpen}
                        >
                          <span
                            className={`text-base sm:text-lg transition-colors ${isOpen
                              ? "font-bold text-slate-950"
                              : "font-normal text-slate-500 group-hover:text-slate-700"
                              }`}
                          >
                            {item.title}
                          </span>
                          <svg
                            className={`w-4 h-4 text-slate-400 group-hover:text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-slate-600" : ""
                              }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <div
                          className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-2.5" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed pr-2 font-normal">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>


          {/* ── Right Column Container (lg:col-span-6): Ocean Card + Enterprise Card (Isolated from Features toggle stretch) ── */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">

            {/* Middle Card: LinkedIn Post 3 Feature Card in Vertical Position */}
            <div className="min-h-[340px] sm:min-h-[380px] h-full">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs relative group h-full flex flex-col justify-between p-6">
                {/* High-res linkedinpost3.png in vertical portrait orientation with front of the ship framed */}
                <img
                  src="/linkedinpost3.webp"
                  alt="Global Trade Freight Operations"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-left group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/40 pointer-events-none" />

                {/* Top Tag */}
                <div className="relative z-10">
                  <span className="text-[10px] font-arial-nova-cond uppercase tracking-wider font-semibold text-blue-200 drop-shadow">
                    Global Maritime Trade
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="relative z-10">
                  <div className="font-display font-bold text-white text-lg sm:text-xl leading-snug drop-shadow">
                    Autonomous Cargo Clearance
                  </div>
                  <p className="text-xs text-blue-100/90 font-sans leading-relaxed mt-1.5 drop-shadow">
                    Reduce demurrage delays across international ocean and air freight lanes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: Tall Enterprise Solutions Card */}
            <div className="flex flex-col h-full">
              <div className="bg-white border border-slate-200/90 shadow-xs rounded-2xl md:rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all h-full">
                <div>
                  {/* Header Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-arial-nova-cond uppercase tracking-wider font-semibold text-blue-600">
                      Enterprise Ready
                    </span>
                  </div>

                  {/* Section 1: ERP Integration for Document Verification */}
                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-slate-950 tracking-tight leading-snug">
                      ERP Integration for Document Verification
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
                      No need to dump your complete workflow at once. Seamlessly integrate automated document verification into your existing ERP without operational disruption.
                    </p>
                  </div>

                  {/* Subtle Divider */}
                  <div className="w-full h-px bg-slate-100 my-4" />

                  {/* Section 2: Custom Solution */}
                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-slate-950 tracking-tight">
                      Custom Solution
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
                      Bespoke validation rules and customs pipelines tailored to your supply chain volume.
                    </p>
                  </div>
                </div>

                {/* Action Button at Bottom */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => scrollToSection("contact")}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs group"
                  >
                    <span>Explore Custom Setup</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

// ─── Automation in Action (How It Works) ──────────────────────────────────────
const STEPS = [
  {
    id: "01",
    tag: "Ingest",
    color: "#2563eb",
    title: "Collect PO",
    label: "1. Collect PO",
    boxBg: "#e0f2fe",
    boxBorder: "#bae6fd",
    boxText: "#0369a1",
    dashColor: "#0284c7",
    dashInactive: "rgba(2, 132, 199, 0.25)",
    explanation: "Direct ingestion of purchase orders from WhatsApp, email attachments, XML, and API feeds into a central pipeline.",
    benefits: ["Generate custom PO links to eliminate back-and-forth buyer corrections."],
    desc: "Accept purchase orders via WhatsApp, Gmail, form links or EDI feeds. XML, PDF, plain text — any format, any channel.",
    sources: [{ icon: "💬", name: "WhatsApp" }, { icon: "📧", name: "Gmail" }, { icon: "🔗", name: "Form Link" }, { icon: "⚡", name: "EDI / API" }],
    type: "ingest",
  },
  {
    id: "02",
    tag: "Extract",
    color: "#7c3aed",
    title: "Structure Data",
    label: "2. Structure Data",
    boxBg: "#ebdfff",
    boxBorder: "#d8b4fe",
    boxText: "#6b21a8",
    dashColor: "#7c3aed",
    dashInactive: "rgba(124, 58, 237, 0.25)",
    explanation: "AI extracts and structures every line item, HSN code, Description, Quantity, Unit Price etc. into a tabular ledger",
    benefits: ["Define custom extraction fields to unlock seamless, single-step verification."],
    desc: "AI reads every PO field and maps it to a clean ERP-ready sheet. Human verifies once — reused everywhere downstream.",
    rows: [
      { co: "XYZ Solutions", code: "001", item: "Red T-Shirt", qty: 500 },
      { co: "XYZ Solutions", code: "002", item: "Blue Polo", qty: 300 },
      { co: "ABC Corp", code: "003", item: "Cap (Grey)", qty: 200 },
    ],
    type: "table",
  },
  {
    id: "03",
    tag: "Generate",
    color: "#059669",
    title: "Generate Documents",
    label: "3. Generate Documents",
    boxBg: "#dcfce7",
    boxBorder: "#86efac",
    boxText: "#15803d",
    dashColor: "#16a34a",
    dashInactive: "rgba(22, 163, 74, 0.25)",
    explanation: "Auto-populates Commercial Invoices, Packing Lists, Shipping Bills, and customs packs in a single click.",
    benefits: ["Consolidate third-party emails and generated documents with a single click."],
    desc: "One click produces your entire compliance pack — pre-filled, formatted to customs spec, ready to submit.",
    docs: ["Commercial Invoice", "Packing List", "Tax Invoice", "Proforma Invoice", "Shipping Bill", "e-Invoice", "Bill of Lading", "Certificate of Origin"],
    type: "docs",
  },
  {
    id: "04",
    tag: "Verify",
    color: "#4f46e5",
    title: "Cross-Verification",
    label: "4. Cross-Verification",
    boxBg: "#e0e7ff",
    boxBorder: "#c7d2fe",
    boxText: "#3730a3",
    dashColor: "#4f46e5",
    dashInactive: "rgba(79, 70, 229, 0.25)",
    explanation: "Automated 3-way reconciliation comparing internal ledgers with Letters of Credit, bank docs, and buyer records.",
    benefits: ["Flag document discrepancies and instantly route alerts to the correct teams."],
    desc: "Upload 3rd-party docs — Letter of Credit, bank docs, buyer's records. Tessfold cross-checks 47+ fields and flags every mismatch.",
    checks: [
      { f: "HSN Code", a: "852349", b: "852349", ok: true },
      { f: "Invoice Value", a: "$14,760", b: "$14,880", ok: false },
      { f: "Port of Loading", a: "Nhava Sheva", b: "Nhava Sheva", ok: true },
      { f: "LC Amount", a: "$14,880", b: "$14,760", ok: false },
    ],
    type: "verify",
  },
  {
    id: "05",
    tag: "Resolve",
    color: "#e11d48",
    title: "Auto Harmonizing",
    label: "5. Auto Harmonizing",
    boxBg: "#ffe4e8",
    boxBorder: "#fecdd6",
    boxText: "#9f1239",
    dashColor: "#f43f5e",
    dashInactive: "rgba(244, 63, 94, 0.25)",
    explanation: "Identifies mismatches, logs immutable audit trails, and auto-corrects compliance data before port entry.",
    benefits: ["Resolve data mismatches directly using auto-harmonized internal spreadsheet tables."],
    desc: "Discrepancies flagged with full context and auto-resolved where possible. Every fix is logged. Shipment clears clean.",
    fixes: [
      { issue: "HSN Code Mismatch", fix: "HSN Code Fixed", before: "852349 vs 852340", after: "Updated to 852349" },
      { issue: "LC Amount Delta", fix: "LC Recalculated", before: "+$120 over limit", after: "New total: $14,880" },
      { issue: "Port Name Typo", fix: "Port Corrected", before: '"Nhava Shava"', after: '"Nhava Sheva"' },
    ],
    type: "resolve",
  },
];

function IngestStepPanel() {
  const [email, setEmail] = useState("buyer@globaltrade.com");
  const [linked, setLinked] = useState(false);

  const handleLinkClick = (e: React.FormEvent) => {
    e.preventDefault();
    setLinked(!linked);
  };

  return (
    <div className="space-y-3.5 font-serif-pro">
      {/* Upper Area: Email Link Generator Box */}
      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-arial-nova-cond text-[#94a3b8] uppercase tracking-wider font-semibold">
            PO Ingestion Link Generator
          </span>
        </div>

        {!linked ? (
          <form onSubmit={handleLinkClick} className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter buyer email..."
                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm border border-slate-300 bg-white focus:outline-none focus:border-blue-500 font-serif-pro text-slate-800 placeholder-slate-400 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-950 hover:bg-slate-800 text-white transition-all flex items-center justify-center shadow-sm shrink-0 cursor-pointer"
            >
              <span>Link</span>
            </button>
          </form>
        ) : (
          <div
            onClick={() => setLinked(false)}
            className="mt-2 cursor-pointer bg-emerald-50 border border-emerald-300/90 text-emerald-900 p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium transition-all shadow-xs group"
            title="Click to reset link"
          >
            <div className="flex items-center gap-2 min-w-0 pr-1">
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-medium shadow-xs shrink-0">
                ✓
              </div>
              <div className="text-emerald-950 flex items-center gap-1.5 font-serif-pro text-xs sm:text-sm truncate">
                <span className="shrink-0">Linked:</span>
                <span className="text-emerald-700 bg-emerald-100/70 px-1.5 sm:px-2 py-0.5 rounded truncate">{email || "buyer@globaltrade.com"}</span>
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200/80 shadow-2xs group-hover:bg-emerald-100 transition-colors shrink-0">
              Linked ✓
            </span>
          </div>
        )}
      </div>

      {/* Lower Area: Ingestion Channel Logos & Icons */}
      <div>
        <div className="text-[11px] sm:text-xs font-arial-nova-cond text-[#94a3b8] uppercase tracking-wider mb-2 font-semibold">
          Supported Ingestion Options:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {/* WhatsApp */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all">
            <img src="/whatsapp.png" alt="WhatsApp" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0" />
            <span className="text-xs sm:text-sm text-slate-800 font-serif-pro truncate">WhatsApp</span>
          </div>

          {/* Gmail */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all">
            <img src="/Gmail.webp" alt="Gmail" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0" />
            <span className="text-xs sm:text-sm text-slate-800 font-serif-pro truncate">Gmail</span>
          </div>

          {/* Buyer Link */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 p-0.5 sm:p-1 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
              <img src="/link.webp" alt="Buyer Link" className="w-full h-full object-contain rounded-md" />
            </div>
            <span className="text-xs sm:text-sm text-slate-800 font-serif-pro truncate">Buyer Link</span>
          </div>

          {/* Custom Attachment */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/70">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57a4 4 0 1 1 5.66 5.66l-8.59 8.58a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm text-slate-800 font-serif-pro truncate">Custom Attachment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for Step 2 Typewriter effect
function getTypedText(fullText: string, cursorOffset: number, cellStart: number) {
  if (cursorOffset <= cellStart) return "";
  const chars = cursorOffset - cellStart;
  return fullText.slice(0, Math.min(fullText.length, chars));
}

function TableStepPanel({ rows }: { rows: { co: string; code: string; item: string; qty: string | number }[] }) {
  const [cursor, setCursor] = useState(0);

  const safeRows = useMemo(() => {
    return (rows || []).map((r) => ({
      co: String(r.co || ""),
      code: String(r.code || ""),
      item: String(r.item || ""),
      qty: String(r.qty || ""),
    }));
  }, [rows]);

  const totalChars = useMemo(() => {
    return safeRows.reduce((acc, r) => acc + r.co.length + r.code.length + r.item.length + r.qty.length, 0);
  }, [safeRows]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCursor((prev) => {
        if (prev >= totalChars + 15) return 0; // Reset typing cycle
        return prev + 1;
      });
    }, 45); // Fast typing pace
    return () => clearInterval(timer);
  }, [totalChars]);

  let runningOffset = 0;

  return (
    <div className="space-y-3 font-serif-pro">
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-[10.5px] sm:text-xs font-arial-nova-cond text-[#94a3b8] uppercase tracking-wider font-semibold flex items-center gap-1.5 shrink min-w-0 whitespace-nowrap">
          <span><span className="hidden sm:inline">Structured </span>Tabular Ledger</span>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 animate-pulse shrink-0" />
        </span>
        <span className="text-[10px] sm:text-xs font-serif-pro text-purple-700 bg-purple-50 px-2 sm:px-2.5 py-0.5 rounded border border-purple-200/60 flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap">
          <span>Auto-Parsing<span className="hidden sm:inline"> Stream</span></span>
          <span className="animate-spin text-purple-600">⚡</span>
        </span>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-white font-serif-pro">
        <div className="grid grid-cols-4 px-2 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-arial-nova-cond font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 gap-1.5 sm:gap-2 border-b border-slate-200">
          {["Company", "Code", "Items", "QTY"].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {safeRows.map((r, i) => {
          const typedCo = getTypedText(r.co, cursor, runningOffset);
          runningOffset += r.co.length;
          const typedCode = getTypedText(r.code, cursor, runningOffset);
          runningOffset += r.code.length;
          const typedItem = getTypedText(r.item, cursor, runningOffset);
          runningOffset += r.item.length;
          const typedQty = getTypedText(r.qty, cursor, runningOffset);
          runningOffset += r.qty.length;

          const isCurrentlyTypingCo = typedCo.length < r.co.length && typedCo.length > 0;

          return (
            <div
              key={i}
              className="grid grid-cols-4 px-2 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-sm bg-white text-slate-800 font-serif-pro gap-1.5 sm:gap-2 border-t border-slate-100 items-center min-h-[32px] sm:min-h-[38px]"
            >
              <span className="text-slate-900 flex items-center font-normal truncate">
                {typedCo}
                {isCurrentlyTypingCo && <span className="inline-block w-1 h-3.5 bg-purple-600 ml-0.5 animate-pulse" />}
              </span>
              <span className="text-slate-600 truncate">{typedCode}</span>
              <span className="text-slate-700 truncate">{typedItem}</span>
              <span className="text-slate-900 font-normal">{typedQty}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocsStepPanel({ docs }: { docs: string[] }) {
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const restart = () => {
    setCycleKey((c) => c + 1);
  };

  useEffect(() => {
    setProgress(0);
    setCompletedCount(0);

    const total = docs.length;
    let loopTimeout: ReturnType<typeof setTimeout>;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (total * 7); // Slower pacing (~6 seconds)
        if (next >= 100) {
          clearInterval(timer);
          setCompletedCount(total);
          // Hold completed state for 2s, then trigger next cycle automatically
          loopTimeout = setTimeout(() => {
            setCycleKey((c) => c + 1);
          }, 2000);
          return 100;
        }
        const currentCount = Math.floor((next / 100) * total);
        setCompletedCount(currentCount);
        return next;
      });
    }, 70);

    return () => {
      clearInterval(timer);
      if (loopTimeout) clearTimeout(loopTimeout);
    };
  }, [cycleKey, docs.length]);

  return (
    <div className="space-y-2.5 font-serif-pro">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-arial-nova-cond text-[#94a3b8] uppercase tracking-wider font-semibold">
          Generated Document Pack
        </span>

        <button
          onClick={restart}
          className={`px-3 py-0.5 rounded-xl text-xs font-serif-pro font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${completedCount === docs.length
            ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
            : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            }`}
        >
          {completedCount === docs.length ? (
            <>
              <span>✓ 8 Docs Ready</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Generating</span>
            </>
          )}
        </button>
      </div>

      {/* Blue Loading Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative border border-slate-200/60">
        <div
          className="bg-blue-600 h-full transition-all duration-100 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-2 gap-2">
        {docs.map((d, idx) => {
          const isDone = idx < completedCount;
          const isCurrent = idx === completedCount && progress < 100;

          return (
            <div
              key={d}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-serif-pro font-normal transition-all duration-300 shadow-2xs ${isDone
                ? "bg-emerald-50 border border-emerald-300/90 text-emerald-950 scale-[1.01]"
                : isCurrent
                  ? "bg-blue-50 border border-blue-400 text-blue-950 animate-pulse ring-2 ring-blue-200"
                  : "bg-slate-50 border border-slate-200/80 text-slate-400 opacity-60"
                }`}
            >
              <div
                className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-md flex items-center justify-center text-[10px] sm:text-[11px] shrink-0 font-medium transition-all ${isDone
                  ? "bg-emerald-600 text-white"
                  : isCurrent
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                  }`}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span className="truncate">{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VerifyStepPanel({ checks }: { checks: { f: string; a: string; b: string; ok: boolean }[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => {
        if (prev >= checks.length + 1) {
          return 0; // Reset scan loop
        }
        return prev + 1;
      });
    }, 750); // Down row by row every 750ms
    return () => clearInterval(timer);
  }, [checks.length]);

  return (
    <div className="space-y-2 font-serif-pro w-full overflow-hidden">
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-[11px] sm:text-xs font-arial-nova-cond text-[#94a3b8] uppercase tracking-wider font-semibold whitespace-nowrap">
          3-Way Audit Engine
        </span>
        <span className="text-[10px] sm:text-xs font-serif-pro text-indigo-700 bg-indigo-50 px-2 sm:px-2.5 py-0.5 rounded border border-indigo-200/60 flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span>Auditing Field {Math.min(activeIdx + 1, checks.length)} / {checks.length}</span>
        </span>
      </div>

      {/* 2 Header Boxes with Dotted Boundaries */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 font-arial-nova-cond uppercase tracking-wider">
        <div className="text-center text-[10.5px] sm:text-xs font-semibold py-1 sm:py-1.5 rounded-lg bg-blue-50/50 text-blue-800 border-2 border-dashed border-blue-400">
          Your Documents
        </div>
        <div className="text-center text-[10.5px] sm:text-xs font-semibold py-1 sm:py-1.5 rounded-lg bg-indigo-50/50 text-indigo-800 border-2 border-dashed border-indigo-400">
          3rd Party Docs
        </div>
      </div>

      {/* Checking rows with dotted lines and dotted highlight boxes */}
      <div className="space-y-1.5 bg-slate-50/70 p-1.5 sm:p-2.5 rounded-xl border border-slate-200/80 font-serif-pro w-full overflow-hidden">
        {checks.map((c, i) => {
          const isCurrent = i === activeIdx;
          const isChecked = i < activeIdx || activeIdx >= checks.length;

          return (
            <div
              key={c.f}
              className={`flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm font-serif-pro p-1 rounded-lg transition-all border-2 w-full min-w-0 ${isCurrent
                ? "bg-blue-50/90 border-blue-300/80 shadow-2xs"
                : "bg-transparent border-transparent"
                }`}
            >
              {/* Field Label */}
              <span className="text-[10px] sm:text-sm text-[#94a3b8] w-14 sm:w-24 shrink-0 font-medium truncate" title={c.f}>{c.f}</span>

              {/* Left Field Value with Dotted Box */}
              <div
                className={`px-1 sm:px-2.5 py-0.5 rounded-md transition-all text-[10px] sm:text-sm border-2 flex items-center justify-center shrink min-w-0 max-w-[85px] sm:max-w-none ${isCurrent
                  ? "border-dashed border-blue-500 bg-white font-medium text-blue-900 shadow-2xs"
                  : isChecked
                    ? "border-solid border-emerald-300 bg-emerald-50 text-emerald-950 font-medium"
                    : "border-solid border-slate-200 bg-white text-slate-700 font-normal"
                  }`}
                title={c.a}
              >
                <span className="truncate">{c.a}</span>
              </div>

              {/* Middle Dotted Connecting Line */}
              <div className="flex-1 flex items-center px-0.5 sm:px-1 min-w-[6px]">
                <div
                  className={`w-full border-b-2 border-dashed transition-all ${isCurrent
                    ? "border-blue-500 animate-pulse"
                    : isChecked
                      ? "border-emerald-400"
                      : "border-slate-300"
                    }`}
                />
              </div>

              {/* Right Field Value with Dotted Box */}
              <div
                className={`px-1 sm:px-2.5 py-0.5 rounded-md transition-all text-[10px] sm:text-sm border-2 flex items-center justify-center shrink min-w-0 max-w-[85px] sm:max-w-none ${isCurrent
                  ? "border-dashed border-blue-500 bg-white font-medium text-blue-900 shadow-2xs"
                  : isChecked
                    ? "border-solid border-emerald-300 bg-emerald-50 text-emerald-950 font-medium"
                    : "border-solid border-slate-200 bg-white text-slate-700 font-normal"
                  }`}
                title={c.b}
              >
                <span className="truncate">{c.b}</span>
              </div>

              {/* Status Checkmark (no bullets) */}
              <div className="w-4 sm:w-5 flex justify-center shrink-0">
                {isChecked ? (
                  <span className={`text-[11px] sm:text-sm font-medium ${c.ok ? "text-emerald-600" : "text-amber-600"}`}>
                    {c.ok ? "✓" : "⚠"}
                  </span>
                ) : isCurrent ? (
                  <span className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                ) : (
                  <span className="w-1.5 h-0.5 bg-slate-300 inline-block rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResolveStepPanel({ fixes }: { fixes: { issue: string; before: string; fix: string; after: string }[] }) {
  const [progress, setProgress] = useState(0);
  const [harmonizedCount, setHarmonizedCount] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const restart = () => {
    setCycleKey((c) => c + 1);
  };

  useEffect(() => {
    setProgress(0);
    setHarmonizedCount(0);

    const total = fixes.length;
    let loopTimeout: ReturnType<typeof setTimeout>;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (total * 8); // Slower pacing (~6 seconds)
        if (next >= 100) {
          clearInterval(timer);
          setHarmonizedCount(total);
          // Hold harmonized state for 2s, then trigger next cycle automatically
          loopTimeout = setTimeout(() => {
            setCycleKey((c) => c + 1);
          }, 2000);
          return 100;
        }
        const currentCount = Math.floor((next / 100) * total);
        setHarmonizedCount(currentCount);
        return next;
      });
    }, 70);

    return () => {
      clearInterval(timer);
      if (loopTimeout) clearTimeout(loopTimeout);
    };
  }, [cycleKey, fixes.length]);

  return (
    <div className="space-y-2.5 font-serif-pro">
      {/* Top Header & Harmonize Button */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="text-[11px] sm:text-xs font-arial-nova-cond text-[#94a3b8] uppercase tracking-wider font-semibold whitespace-nowrap">
          Auto-Harmonization
        </span>

        <button
          onClick={restart}
          className={`px-2.5 sm:px-3 py-0.5 rounded-xl text-[10.5px] sm:text-xs font-serif-pro font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap ${harmonizedCount === fixes.length
            ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
            }`}
        >
          {harmonizedCount === fixes.length ? (
            <>
              <span>✓ All Harmonized</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Harmonizing</span>
            </>
          )}
        </button>
      </div>

      {/* Rose/Pinkish Loading Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative border border-slate-200/60">
        <div
          className="bg-rose-500 h-full transition-all duration-100 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Fix Cards */}
      <div className="space-y-2">
        {fixes.map((f, idx) => {
          const isResolved = idx < harmonizedCount;

          return (
            <div key={f.issue} className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm font-serif-pro">
              {/* Discrepancy Box */}
              <div
                className={`rounded-xl p-2 sm:p-2.5 border transition-all ${isResolved
                  ? "bg-slate-50 border-slate-200 text-slate-400 line-through opacity-70"
                  : "bg-rose-50/70 border-rose-200 text-rose-900"
                  }`}
              >
                <p className={`text-xs sm:text-sm font-medium mb-0.5 ${isResolved ? "text-slate-500" : "text-rose-600"}`}>
                  ⚠ {f.issue}
                </p>
                <p className="text-[11px] sm:text-sm leading-tight sm:leading-normal">{f.before}</p>
              </div>

              {/* Resolved / Harmonized Box - GREEN */}
              <div
                className={`rounded-xl p-2 sm:p-2.5 border transition-all ${isResolved
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs ring-1 ring-emerald-200 scale-[1.01]"
                  : "bg-slate-50 border-slate-200 text-slate-400 opacity-50"
                  }`}
              >
                <p className={`text-xs sm:text-sm font-medium mb-0.5 ${isResolved ? "text-emerald-700" : "text-slate-400"}`}>
                  {isResolved ? "✓ Harmonized" : "Pending Fix"}
                </p>
                <p className={`text-[11px] sm:text-sm leading-tight sm:leading-normal ${isResolved ? "text-slate-900 font-normal" : "text-slate-400"}`}>
                  {isResolved ? f.after : f.fix}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepPanel({ step, active }: { step: typeof STEPS[0]; active: boolean }) {
  if (step.type === "ingest") return <IngestStepPanel />;
  if (step.type === "table") return <TableStepPanel rows={step.rows || []} />;
  if (step.type === "docs") return <DocsStepPanel docs={step.docs || []} />;
  if (step.type === "verify") return <VerifyStepPanel checks={step.checks || []} />;
  if (step.type === "resolve") return <ResolveStepPanel fixes={step.fixes || []} />;
  return null;
}

function HowItWorksSection() {
  const [active, setActive] = useState(0); // Default to Step 1 (Collect PO)
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  const s = STEPS[active];

  return (
    <section id="how-it-works" ref={ref} className="scroll-mt-24 md:scroll-mt-28 py-12 md:py-16 relative z-10 overflow-hidden bg-white">
      <div className="max-w-[1180px] mx-auto px-6 md:px-0 flex flex-col w-full">

        {/* Section Heading & Subtitle */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight text-slate-950 mb-3 md:mb-4">
            Automation in Action
          </h2>
          <p className="text-[#94a3b8] font-sans text-base md:text-lg max-w-3xl leading-relaxed">
            Watch manual bottlenecks disappear as raw documents become instantly verified data. And achieve seamless flow that resolves discrepancies before your cargo ever leaves the port.
          </p>
        </div>

        {/* Main Content: Left Step List + Right Themed Visual Card with Extra Horizontal Space */}
        <div
          className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } flex flex-col lg:flex-row items-start gap-10 lg:gap-14 xl:gap-20`}
        >
          {/* Mobile Horizontal Pill Tab Strip with Scrollbar (< lg) & Desktop Vertical Step Navigation List (lg+) */}
          <div className="w-full lg:w-56 xl:w-64 shrink-0 flex flex-row lg:flex-col overflow-x-auto mobile-scrollbar lg:no-scrollbar gap-2 lg:gap-0 pb-3.5 lg:pb-0 pt-0.5">
            {STEPS.map((st, i) => {
              const isActive = active === i;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 lg:w-full text-left px-4 py-2 lg:px-0 lg:py-2.5 sm:lg:py-3 rounded-full lg:rounded-none transition-all duration-200 cursor-pointer flex items-center justify-between border ${isActive
                    ? "bg-slate-950 text-white border-slate-950 lg:bg-transparent lg:border-transparent lg:border-b lg:border-b-slate-900 lg:text-slate-950 font-medium shadow-xs lg:shadow-none"
                    : "bg-slate-100/90 text-slate-600 border-transparent hover:bg-slate-200/90 lg:bg-transparent lg:border-transparent lg:border-b lg:border-b-slate-200/90 lg:text-slate-400 lg:hover:text-slate-700 font-normal"
                    }`}
                >
                  <span className="text-xs sm:text-sm lg:text-[17px] tracking-tight font-sans whitespace-nowrap">
                    {st.label || `${i + 1}. ${st.title}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Light Themed Container Card & Benefit Pill */}
          <div className="flex-1 w-full flex flex-col min-w-0">
            {/* Dynamic Light Colored Container with Compact Padding */}
            <div
              className="w-full rounded-[20px] md:rounded-[24px] px-3 sm:px-6 pt-3.5 pb-4 sm:pt-4 sm:pb-5 border shadow-xs transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: s.boxBg,
                borderColor: s.boxBorder,
              }}
            >

              {/* Top Row: Darker Shade Description + Dash Indicators with tight bottom margin */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-3.5">
                <p
                  className="font-sans font-normal text-xs sm:text-sm md:text-[15px] leading-snug max-w-xl transition-colors duration-300 pl-2 sm:pl-3 md:pl-3.5"
                  style={{ color: s.boxText }}
                >
                  {s.explanation}
                </p>

                {/* Dash Indicators in top right */}
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5 self-end sm:self-start">
                  {STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActive(idx)}
                      aria-label={`Switch to step ${idx + 1}`}
                      className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                      style={{
                        width: active === idx ? "22px" : "13px",
                        backgroundColor: active === idx ? s.dashColor : s.dashInactive,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Inner White Animation Card (Compact padding, Source Serif Pro font) */}
              <div className="bg-white rounded-xl md:rounded-[18px] px-2.5 sm:px-5 py-3 sm:py-4 border border-black/5 shadow-xs flex flex-col justify-center min-h-0 font-serif-pro overflow-hidden">
                <StepPanel step={s} active={true} />
              </div>
            </div>

            {/* Centered Green Benefit Badge below Right Container */}
            {s.benefits && s.benefits[0] && (
              <div className="mt-3.5 sm:mt-4 flex justify-center px-4">
                <div className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl border border-emerald-400/90 bg-[#f0fdf4] text-emerald-800 text-xs sm:text-sm font-medium shadow-2xs text-center transition-all duration-300">
                  {s.benefits[0]}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

// ─── Why Supervised Automation Section ───────────────────────────────────────
function WhySupervisedAutomationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="manual-vs-tessfold" ref={ref} className="py-14 md:py-20 relative z-10 overflow-hidden bg-gradient-to-b from-[#f7f9fc] to-white">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">

        {/* Section Header */}
        <div className={`mb-6 md:mb-8 text-center max-w-3xl mx-auto transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 mb-3">
            Why Supervised <br className="hidden sm:inline" />Automation Matters?
          </h2>
          <p className="text-[#94a3b8] text-base md:text-lg font-sans leading-relaxed">
            From scattered purchase orders across channels to synchronized operations and frictionless export control.
          </p>
        </div>

        {/* Ocean Banner Card Container with Overlapping Lady */}
        <div className={`relative pt-14 md:pt-20 lg:pt-24 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Main Rounded Ocean Card */}
          <div className="relative rounded-[20px] sm:rounded-[24px] md:rounded-[32px] overflow-hidden border border-blue-900/20 flex items-center min-h-[290px] sm:min-h-[340px]">
            {/* Ocean Background Image */}
            <img
              src="/background3.webp"
              alt="Ocean background waves"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover absolute inset-0"
            />
            {/* Dark gradient overlay on mobile so stats are 100% legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent sm:hidden z-0" />

            {/* 4 Stats Grid */}
            <div className="relative z-10 py-6 px-5 sm:px-8 sm:pl-14 md:pl-20 lg:pl-24 w-full sm:w-[75%] lg:w-[65%] my-auto">
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-10 sm:gap-y-7">

                {/* Stat 1 */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold text-white tracking-tight drop-shadow-md">
                    3–5
                  </div>
                  <p className="text-[11px] sm:text-sm md:text-base font-sans text-white font-medium sm:font-bold leading-snug max-w-[170px] sm:max-w-[210px] drop-shadow-md">
                    Days average manual doc prep takes per shipment
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold text-white tracking-tight drop-shadow-md">
                    ₹2.4L+
                  </div>
                  <p className="text-[11px] sm:text-sm md:text-base font-sans text-white font-medium sm:font-bold leading-snug max-w-[170px] sm:max-w-[210px] drop-shadow-md">
                    Average penalty per compliance error
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold text-white tracking-tight drop-shadow-md">
                    34%
                  </div>
                  <p className="text-[11px] sm:text-sm md:text-base font-sans text-white font-medium sm:font-bold leading-snug max-w-[170px] sm:max-w-[210px] drop-shadow-md">
                    Shipments delayed due to doc errors
                  </p>
                </div>

                {/* Stat 4 */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold text-white tracking-tight drop-shadow-md">
                    8–12
                  </div>
                  <p className="text-[11px] sm:text-sm md:text-base font-sans text-white font-medium sm:font-bold leading-snug max-w-[170px] sm:max-w-[210px] drop-shadow-md">
                    Documents required per export shipment
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Overlapping Lady Image - Desktop Only (Hidden on Mobile) */}
          <img
            src="/Fireflymam.webp"
            alt="Supervised Automation Officer"
            loading="lazy"
            decoding="async"
            className="hidden sm:block absolute right-0 sm:right-10 md:right-16 lg:right-24 bottom-0 h-[105%] sm:h-[135%] md:h-[145%] lg:h-[152%] max-h-[580px] object-contain object-bottom pointer-events-none z-20 opacity-100"
          />

        </div>

      </div>
    </section>
  );
}

// ─── Animated Word Flip Loop Component ──────────────────────────────────────
const FLIP_WORDS = ["friction.", "delays.", "errors.", "guesswork."];

function WordFlipLoop() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FLIP_WORDS.length);
        setAnimating(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative h-[1.3em] overflow-hidden align-bottom">
      <span
        className={`inline-block transition-all duration-300 ease-out italic font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent transform-gpu ${animating
          ? "opacity-0 -translate-y-4 rotate-x-90 scale-95 blur-[2px]"
          : "opacity-100 translate-y-0 rotate-x-0 scale-100 blur-0"
          }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {FLIP_WORDS[index]}
      </span>
    </span>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setSubmitting(true);
    setError(null);

    const res = await submitContactLead({
      name: form.name,
      email: form.email,
      message: form.message,
      source: "Landing Page Contact Section",
    });

    setSubmitting(false);

    if (res.success) {
      setDone(true);
    } else {
      setError(res.error || "Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" ref={ref} className="scroll-mt-24 md:scroll-mt-28 py-24 md:py-32 relative z-10 overflow-hidden bg-white">
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 relative z-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          {/* Left Column: Side Paragraph + Bold Callout */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-4 md:gap-6 pr-0 lg:pr-6">
            <a
              href="mailto:tessfold@gmail.com"
              className="font-sans text-xs sm:text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              tessfold@gmail.com
            </a>
            <p className="font-sans text-lg sm:text-xl md:text-2xl text-slate-400 font-normal leading-relaxed tracking-tight m-0">
              Let&apos;s connect for a free meeting and find technical solutions to your industry problems. Move from chaos to clarity.
            </p>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight m-0 flex flex-wrap items-center gap-2">
              <span>Execute with zero</span>
              <WordFlipLoop />
            </h3>
          </div>

          {/* Right Column: Form with minimal underline inputs */}
          <div className="lg:col-span-6 w-full">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-950 tracking-tight mb-8 md:mb-10">
              Get In Touch
            </h2>

            {done ? (
              <div className="py-12 border-t border-b border-slate-200">
                <h3 className="font-display text-2xl font-bold text-slate-950 mb-2">Thank you for reaching out!</h3>
                <p className="text-slate-500 font-sans text-sm md:text-base">
                  We&apos;ve received your request and our team will connect with you to schedule our free technical meeting.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <input
                    type="text"
                    placeholder="Name*"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-transparent border-b border-slate-300 py-3.5 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-slate-950 transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email*"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-transparent border-b border-slate-300 py-3.5 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-slate-950 transition-colors"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Message (Tell us about your industry workflow or problems)"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full bg-transparent border-b border-slate-300 py-3.5 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-slate-950 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 py-4 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-700 text-white font-sans text-sm md:text-base font-semibold flex items-center justify-center gap-2.5 rounded-none transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base leading-none">↳</span>
                      <span>Let&apos;s connect</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10" style={{ background: "#f7f9fc", borderTop: "1px solid #e2e8f0" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <span
            className="font-display text-lg tracking-[-0.04em] text-[#0f172a] font-normal"
            style={{ lineHeight: 1.2 }}
          >
            tessfold
          </span>
        </div>
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          © 2026 Tessfold Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const h = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: "white" }}>
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <ThoughtSegment />
      <AboutSection />
      <HowItWorksSection />
      {/* Section Divider between Automation in Action and Features */}
      <div className="relative z-10 bg-white max-w-[1180px] mx-auto px-6 md:px-0 pt-4 pb-0 sm:pt-6 sm:pb-0">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200/90" />
          <div className="shrink-0 flex items-center justify-center p-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs hover:border-blue-400 transition-colors">
            <img
              src="/cargo-ship_870056.png"
              alt="Cargo ship indicator"
              loading="lazy"
              decoding="async"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="flex-1 h-px bg-slate-200/90 sm:hidden" />
        </div>
      </div>
      <PlatformShowcaseSection />
      <WhySupervisedAutomationSection />
      {/* Section Divider */}
      <div className="relative z-10 bg-white max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="w-full h-px bg-slate-200/80" />
      </div>
      <OurStorySection />
      <StatsStrip />
      <ContactSection />
      <Footer />
    </div>
  );
}
