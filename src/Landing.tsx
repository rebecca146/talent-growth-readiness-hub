import { useState, useEffect, useRef, useCallback, type ChangeEvent, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const DIMS = [
  { label: 'Ownership', score: 25, color: '#DC2626' },
  { label: 'Process', score: 35, color: '#D97706' },
  { label: 'Onboarding', score: 48, color: '#F4A261' },
  { label: 'Metrics', score: 62, color: '#2A9D8F' },
];

const PAIN_CARDS = [
  { title: 'Nobody owns hiring.', body: "Every open role becomes your emergency. There's no process, no owner, no plan, just a flare fired at your calendar." },
  { title: 'Every manager wings the interview.', body: "No structure means you can't trust a hiring decision you weren't in the room for. So you're in final interviews for roles you should never touch." },
  { title: 'New hires quit in 90 days.', body: 'Onboarding is a shrug and a laptop. The same seat gets filled three times a year, and nobody can tell you why.' },
];

const STEPS_BASE = [
  { n: 1, title: 'Assess', body: 'Take the free 15-minute Readiness Assessment across the four dimensions that predict hiring success: ownership, process, onboarding, and metrics.', flag: false },
  { n: 2, title: 'Get Your Roadmap', body: 'Receive a scored report with personalized, prioritized recommendations, instantly. No waiting, no gatekeeping.', flag: false },
  { n: 3, title: 'Fix What You Can', body: 'Free self-service resources: templates, interview guides, scorecards, for every gap you can close yourself.', flag: false },
  { n: 4, title: 'Get Expert Help When You Want It', body: "For the gaps you can't close alone: expert consultation, done-with-you projects, and fractional advisory support. We build the system, train your people, and stay until it's adopted.", flag: true },
];

const BENEFITS = [
  { lead: 'A number you can act on', body: 'Your Talent Readiness Score, benchmarked against companies your size.' },
  { lead: 'Answers, not another opinion', body: 'See exactly which of the 4 infrastructure dimensions is leaking money.' },
  { lead: 'Your time back', body: 'A path out of final interviews, midnight resume reviews, and fire drills.' },
  { lead: 'A hiring process managers actually follow', body: 'Structured tools your team can run without you.' },
  { lead: 'Board-ready data', body: 'Walk into your next meeting with retention numbers instead of excuses.' },
  { lead: 'A partner who stays', body: 'If you want help, you get accountability through adoption, not a deck and a disappearing act.' },
];

const SHOWCASE_CAPTIONS = ['Answer 20 operator-level questions', 'Get your score across 4 dimensions', 'Follow your prioritized roadmap'];

const TESTIMONIALS = [
  { quote: 'We filled the same clinical seat three times in a year. After rebuilding onboarding off our roadmap, we filled it once, ten weeks ago, and she’s thriving.', who: 'COO, behavioral health, 110 employees' },
  { quote: 'I got out of final interviews for frontline roles. I didn’t realize how much of my week that gave back until it did.', who: 'Founder, homebuilding services, 85 employees' },
  { quote: 'The board slide wasn’t red this quarter. First time since the acquisition.', who: 'CEO, PE-backed sales organization, 140 employees' },
];

const FAQS = [
  { q: 'Is the assessment really free?', a: "Yes. The assessment, your score, your recommendations, and the self-service resources are free, no credit card, no trial clock. Paid options exist only if you want expert help implementing, and we'll always tell you plainly where free ends and paid begins." },
  { q: 'Will I get a sales call after I take it?', a: "No. Your results arrive instantly on screen. If you want to talk to an expert, you book it. We don't chase." },
  { q: 'How long does it take?', a: 'About 15 minutes. Built for operators, every question is one you can answer off the top of your head.' },
  { q: 'Who is this for?', a: 'Founders, CEOs, and COOs at companies with roughly 30-150 employees who are still personally stuck in hiring. Especially strong fit for behavioral health, healthcare, construction and homebuilding, and sales-driven teams.' },
  { q: 'How is this different from hiring an agency or a recruiter?', a: 'Agencies fill seats. Recruiters need a process to plug into. We diagnose and fix the system underneath, so every seat you fill after this stays filled.' },
  { q: 'What happens with my answers?', a: "They generate your score and roadmap. We don't sell your data, and you can request deletion anytime." },
];

const STARS = [0, 1, 2, 3, 4];

type Calc = { employees: number; salary: number; lost: number };

function computeCost(c: Calc) {
  return Math.round(c.lost * c.salary * 0.75);
}

export default function Landing() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [calc, setCalc] = useState<Calc>({ employees: 100, salary: 75000, lost: 15 });
  const [calcDisplay, setCalcDisplay] = useState(computeCost({ employees: 100, salary: 75000, lost: 15 }));
  const [statProgress, setStatProgress] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const navigate = useNavigate();

  const statRef = useRef<HTMLElement | null>(null);
  const statRafRef = useRef(0);
  const calcRafRef = useRef(0);
  const calcDisplayRef = useRef(calcDisplay);
  const statsStartedRef = useRef(false);

  useEffect(() => {
    calcDisplayRef.current = calcDisplay;
  }, [calcDisplay]);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    const onScroll = () => {
      const y = window.scrollY;
      const nearFooter = document.body.scrollHeight - (y + window.innerHeight) < 400;
      setScrolled(y > 40);
      setShowStickyCta(y > 500 && !nearFooter && window.innerWidth < 1024);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const animateStats = useCallback(() => {
    const start = performance.now();
    const dur = 1300;
    const tick = (now: number) => {
      const p = clamp((now - start) / dur, 0, 1);
      setStatProgress(easeOutCubic(p));
      if (p < 1) statRafRef.current = requestAnimationFrame(tick);
    };
    statRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const el = statRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsStartedRef.current) {
          statsStartedRef.current = true;
          animateStats();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(statRafRef.current);
    };
  }, [animateStats]);

  useEffect(() => () => cancelAnimationFrame(calcRafRef.current), []);

  const animateCalc = (target: number) => {
    cancelAnimationFrame(calcRafRef.current);
    const start = performance.now();
    const from = calcDisplayRef.current;
    const dur = 500;
    const tick = (now: number) => {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = easeOutCubic(p);
      setCalcDisplay(Math.round(from + (target - from) * eased));
      if (p < 1) calcRafRef.current = requestAnimationFrame(tick);
    };
    calcRafRef.current = requestAnimationFrame(tick);
  };

  const updateCalc = (patch: Partial<Calc>) => {
    const next = { ...calc, ...patch };
    setCalc(next);
    animateCalc(computeCost(next));
  };

  const setEmployees = (e: ChangeEvent<HTMLInputElement>) => updateCalc({ employees: Number(e.target.value) });
  const setSalary = (e: ChangeEvent<HTMLInputElement>) => updateCalc({ salary: Number(e.target.value) });
  const setLost = (e: ChangeEvent<HTMLInputElement>) => updateCalc({ lost: Number(e.target.value) });

  const toggleMobileMenu = () => setMobileMenuOpen((o) => !o);
  const toggleFaq = (i: number) => setFaqOpen((o) => (o === i ? -1 : i));
  const openAssessment = () => navigate('/assessment');

  const dashboardDims = DIMS.map((d) => ({ label: d.label, score: d.score, barStyle: { width: `${d.score}%`, background: d.color } }));

  const steps = STEPS_BASE.map((s, i) => ({
    ...s,
    showLine: isDesktop && i < STEPS_BASE.length - 1,
    wrapStyle: (isDesktop
      ? { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, position: 'relative' }
      : { display: 'flex', gap: '20px', alignItems: 'flex-start' }) as CSSProperties,
    cardStyle: (isDesktop
      ? { marginTop: '20px', background: '#fff', border: s.flag ? '1.5px solid #E9C46A' : '1px solid #EBEEF2', borderRadius: '14px', padding: '20px', minHeight: '160px' }
      : { flex: 1, background: '#fff', border: s.flag ? '1.5px solid #E9C46A' : '1px solid #EBEEF2', borderRadius: '14px', padding: '18px', marginBottom: '28px' }) as CSSProperties,
  }));

  const faqs = FAQS.map((f, i) => ({ ...f, isOpen: faqOpen === i, index: i }));

  const statFailedHire = Math.round(42000 * statProgress).toLocaleString();
  const statRefill = (3 * statProgress).toFixed(1).replace(/\.0$/, '');
  const statHours = Math.round(10 * statProgress);

  const heroH1Size = isDesktop ? '3.2rem' : '2.1rem';
  const h2Size = isDesktop ? '2.25rem' : '1.7rem';
  const h2SizeDark = isDesktop ? '2.5rem' : '1.7rem';

  const ctaButtonStyle: CSSProperties = {
    background: '#2A9D8F',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    borderRadius: 8,
    padding: '14px 32px',
    minHeight: 44,
    cursor: 'pointer',
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* ============ NAV ============ */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid #F5F7FA' : '1px solid transparent',
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <img src="/logo-icon.png" alt="Authentic Talent Edge" style={{ height: isDesktop ? 38 : 30, width: 'auto', flexShrink: 0 }} />
            <span style={{ fontSize: isDesktop ? 19 : 14, fontWeight: 600, color: '#122B45', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Talent Growth Readiness <span style={{ color: '#2A9D8F' }}>Hub</span>
            </span>
          </div>
          <nav style={{ display: isDesktop ? 'flex' : 'none', gap: 32, alignItems: 'center' }}>
            <a href="#how-it-works" style={{ color: '#122B45', fontWeight: 500, fontSize: 15, position: 'relative' }}>How It Works</a>
            <a href="#what-you-get" style={{ color: '#122B45', fontWeight: 500, fontSize: 15 }}>What You Get</a>
            <a href="#results" style={{ color: '#122B45', fontWeight: 500, fontSize: 15 }}>Results</a>
            <a href="#faq" style={{ color: '#122B45', fontWeight: 500, fontSize: 15 }}>FAQ</a>
          </nav>
          <button onClick={openAssessment} style={{ display: isDesktop ? 'inline-flex' : 'none', background: '#2A9D8F', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', borderRadius: 8, padding: '10px 20px', minHeight: 44, alignItems: 'center', cursor: 'pointer' }}>
            Take the Free Assessment
          </button>
          <button onClick={toggleMobileMenu} aria-label="Open menu" style={{ display: isDesktop ? 'none' : 'flex', background: 'none', border: 'none', padding: 10, cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M4 12H20M4 17H20" stroke="#122B45" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,20,0.4)', zIndex: 60 }} onClick={toggleMobileMenu} />
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: 320, background: '#fff', zIndex: 61, boxShadow: '-8px 0 24px rgba(10,14,20,0.15)', padding: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button onClick={toggleMobileMenu} aria-label="Close menu" style={{ alignSelf: 'flex-end', background: 'none', border: 'none', padding: 8, cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="#122B45" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              <a href="#how-it-works" onClick={toggleMobileMenu} style={{ color: '#122B45', fontWeight: 500, fontSize: 17, padding: '14px 8px', borderBottom: '1px solid #F5F7FA' }}>How It Works</a>
              <a href="#what-you-get" onClick={toggleMobileMenu} style={{ color: '#122B45', fontWeight: 500, fontSize: 17, padding: '14px 8px', borderBottom: '1px solid #F5F7FA' }}>What You Get</a>
              <a href="#results" onClick={toggleMobileMenu} style={{ color: '#122B45', fontWeight: 500, fontSize: 17, padding: '14px 8px', borderBottom: '1px solid #F5F7FA' }}>Results</a>
              <a href="#faq" onClick={toggleMobileMenu} style={{ color: '#122B45', fontWeight: 500, fontSize: 17, padding: '14px 8px', borderBottom: '1px solid #F5F7FA' }}>FAQ</a>
              <button
                onClick={() => {
                  toggleMobileMenu();
                  openAssessment();
                }}
                style={{ marginTop: 16, background: '#2A9D8F', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 8, padding: '14px 20px', minHeight: 44, cursor: 'pointer' }}
              >
                Take the Free Assessment
              </button>
            </div>
          </>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section style={{ position: 'relative', background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #F5F7FA 100%)', paddingTop: 96 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: 520, background: 'radial-gradient(circle at top right, rgba(11,37,69,0.07), rgba(28,110,140,0.04) 45%, transparent 70%)', pointerEvents: 'none' }} />
        <div
          style={{
            position: 'relative',
            maxWidth: 1280,
            margin: '0 auto',
            padding: isDesktop ? '48px 24px 100px' : '24px 20px 72px',
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: 'center',
            gap: 48,
          }}
        >
          <div style={{ flex: isDesktop ? '0 0 55%' : '1 1 auto', maxWidth: isDesktop ? 560 : '100%' }}>
            <div style={{ display: 'inline-block', color: '#F4A261', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20, animation: 'fadeUp 0.5s ease-out both' }}>
              Free 15-Minute Readiness Assessment
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: heroH1Size, lineHeight: 1.12, color: '#0B2545', margin: '0 0 24px', animation: 'fadeUp 0.5s ease-out 0.08s both' }}>
              Find Out Why Your Hiring{' '}
              <span style={{ background: 'linear-gradient(135deg,#0B2545 0%,#13496B 20%,#1C6E8C 40%,#2A9D8F 60%,#E9C46A 80%,#F4A261 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                Keeps Breaking
              </span>
              : Before It Breaks Your Growth
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: '#5A6B7B', margin: '0 0 32px', maxWidth: 520, animation: 'fadeUp 0.5s ease-out 0.16s both' }}>
              You've thrown agencies, job boards, and even a recruiter at the problem. The seats still keep reopening. Take the free Talent Growth Readiness Assessment and get a personalized roadmap to hiring that finally runs without you in the middle of it.
            </p>
            <div style={{ animation: 'fadeUp 0.5s ease-out 0.24s both' }}>
              <button onClick={openAssessment} style={{ ...ctaButtonStyle, boxShadow: '0 4px 14px rgba(42,157,143,0.3)' }}>
                Take the Free Assessment Now
              </button>
              <div style={{ fontSize: 13, color: '#5A6B7B', marginTop: 12 }}>Free forever. 15 minutes. No credit card. No sales call required.</div>
            </div>
            <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 28, color: '#1C6E8C', fontWeight: 500, fontSize: 14, animation: 'fadeUp 0.5s ease-out 0.3s both' }}>
              See how it works ↓
            </a>
          </div>

          <div style={{ flex: isDesktop ? '0 0 45%' : '1 1 auto', width: '100%', maxWidth: isDesktop ? 460 : 420 }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 24px 60px rgba(11,37,69,0.18)', border: '1px solid #F5F7FA', overflow: 'hidden', animation: 'floatY 5s ease-in-out infinite' }}>
              <div style={{ background: '#F5F7FA', padding: '10px 16px', display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D97706' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#16A34A' }} />
              </div>
              <div style={{ padding: 28 }} role="img" aria-label="Talent Growth Readiness score dashboard showing gaps across ownership, process, onboarding, and metrics">
                <div style={{ fontSize: 13, color: '#5A6B7B', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>Talent Readiness Score</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, color: '#0B2545', marginBottom: 20 }}>
                  43<span style={{ fontSize: 22, color: '#5A6B7B', fontFamily: "'Inter', sans-serif" }}>/100</span>
                </div>
                {dashboardDims.map((dim) => (
                  <div key={dim.label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#122B45', fontWeight: 500, marginBottom: 6 }}>
                      <span>{dim.label}</span>
                      <span>{dim.score}%</span>
                    </div>
                    <div style={{ height: 8, background: '#F5F7FA', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 4, ...dim.barStyle }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAT BAR ============ */}
      <section ref={statRef as never} style={{ background: '#0B2545', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: isTablet ? 'repeat(3,1fr)' : '1fr', gap: 32 }}>
          <div style={{ textAlign: 'center' }} aria-label="$42,000 average cost of one failed hire at the manager level">
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: '#E9C46A' }}>${statFailedHire}+</div>
            <div style={{ fontSize: 14, color: '#F5F7FA', marginTop: 8, maxWidth: 220, marginLeft: 'auto', marginRight: 'auto' }}>average cost of one failed hire at the manager level</div>
          </div>
          <div style={{ textAlign: 'center' }} aria-label="3 times the same seat refilled in 14 months when onboarding is broken">
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: '#E9C46A' }}>{statRefill}x</div>
            <div style={{ fontSize: 14, color: '#F5F7FA', marginTop: 8, maxWidth: 220, marginLeft: 'auto', marginRight: 'auto' }}>the same seat refilled in 14 months when onboarding is broken</div>
          </div>
          <div style={{ textAlign: 'center' }} aria-label="10+ hours per week leader time lost to hiring fire drills">
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: '#E9C46A' }}>{statHours}+ hrs/wk</div>
            <div style={{ fontSize: 14, color: '#F5F7FA', marginTop: 8, maxWidth: 220, marginLeft: 'auto', marginRight: 'auto' }}>leader time lost to hiring fire drills</div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM SECTION ============ */}
      <section id="how-it-works" style={{ background: '#F5F7FA', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: h2Size, lineHeight: 1.2, color: '#0B2545', fontWeight: 700, margin: '0 0 20px' }}>Hiring Keeps Landing on Your Desk Like a Fire Drill. Again.</h2>
          <p style={{ fontSize: 17, color: '#5A6B7B', maxWidth: 680, margin: '0 auto 56px', lineHeight: 1.6 }}>
            Someone quits. The posting goes back up. You're screening resumes at the kitchen table at 11 PM, because if you don't do it, nobody does. You've paid the agency fees. You even hired a recruiter. And the same problems keep coming back.
          </p>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : '1fr', gap: 24 }}>
          {PAIN_CARDS.map((card) => (
            <div key={card.title} style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEEF2', padding: 32, transition: 'transform 0.2s ease-out' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(28,110,140,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1C6E8C' }} />
              </div>
              <h3 style={{ fontSize: 19, color: '#122B45', fontWeight: 600, margin: '0 0 10px' }}>{card.title}</h3>
              <p style={{ fontSize: 15, color: '#5A6B7B', lineHeight: 1.6, margin: 0 }}>{card.body}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 26, lineHeight: 1.5, color: '#0B2545', textAlign: 'center', maxWidth: 760, margin: '64px auto 0' }}>
          "Here's the truth: it was never an effort problem. Your company outgrew instinct-driven hiring, and nobody built the system to replace it."
        </p>
      </section>

      {/* ============ SOLUTION SECTION ============ */}
      <section style={{ background: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#F4A261', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>The Fix Has a Name</div>
          <h2 style={{ fontSize: h2Size, lineHeight: 1.2, color: '#0B2545', fontWeight: 700, margin: '0 0 20px' }}>Talent Infrastructure. And It Starts With a Free Diagnosis.</h2>
          <p style={{ fontSize: 17, color: '#5A6B7B', maxWidth: 680, margin: '0 auto 64px', lineHeight: 1.6 }}>
            Agencies fill seats. Job boards take your money. The Talent Growth Readiness Hub does something different: it measures where your hiring system actually stands, shows you exactly what's missing, and gives you the roadmap to fix it, starting free.
          </p>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: isDesktop ? 24 : 0, alignItems: isDesktop ? 'flex-start' : 'stretch' }}>
          {steps.map((step) => (
            <div key={step.n} style={step.wrapStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, minWidth: 48, borderRadius: '50%', background: '#0B2545', color: '#E9C46A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>
                  {step.n}
                </div>
                {step.showLine && <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg,#0B2545,#2A9D8F,#E9C46A)', marginLeft: 8 }} />}
              </div>
              <div style={step.cardStyle}>
                <h3 style={{ fontSize: 18, color: '#122B45', fontWeight: 600, margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#5A6B7B', lineHeight: 1.6, margin: 0 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button onClick={openAssessment} style={ctaButtonStyle}>Take the Free Assessment</button>
          <div style={{ fontSize: 13, color: '#5A6B7B', marginTop: 12 }}>Your score and roadmap are free. Forever.</div>
        </div>
      </section>

      {/* ============ BENEFITS GRID ============ */}
      <section id="what-you-get" style={{ background: '#F5F7FA', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: h2Size, lineHeight: 1.2, color: '#0B2545', fontWeight: 700, margin: '0 0 56px' }}>What You Walk Away With</h2>
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : isTablet ? 'repeat(2,1fr)' : '1fr', gap: 20 }}>
          {BENEFITS.map((b) => (
            <div key={b.lead} style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEEF2', padding: 28, transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ minWidth: 22, marginTop: 2 }}>
                  <circle cx="12" cy="12" r="10" fill="#16A34A" />
                  <path d="M8 12.5L10.5 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#122B45', marginBottom: 6 }}>{b.lead}</div>
                  <div style={{ fontSize: 14, color: '#5A6B7B', lineHeight: 1.5 }}>{b.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ TURNOVER CALCULATOR ============ */}
      <section style={{ background: '#0B2545', padding: '96px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: h2SizeDark, lineHeight: 1.2, color: '#fff', fontWeight: 700, margin: '0 0 12px' }}>What Is Broken Hiring Actually Costing You?</h2>
          <p style={{ fontSize: 16, color: '#B9C4D0', margin: '0 0 48px' }}>Ballpark it in 30 seconds. No email required.</p>
        </div>
        <div style={{ maxWidth: 760, margin: '0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: isDesktop ? 48 : '28px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#fff', fontWeight: 500, marginBottom: 10 }}>
                <span>Employees</span>
                <span>{calc.employees}</span>
              </div>
              <input type="range" min={10} max={500} step={5} value={calc.employees} onChange={setEmployees} aria-label="Employees" style={{ width: '100%', accentColor: '#2A9D8F', height: 44 }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#fff', fontWeight: 500, marginBottom: 10 }}>
                <span>Avg. salary of roles refilled most</span>
                <span>${calc.salary.toLocaleString()}</span>
              </div>
              <input type="range" min={40000} max={250000} step={5000} value={calc.salary} onChange={setSalary} aria-label="Average salary" style={{ width: '100%', accentColor: '#2A9D8F', height: 44 }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#fff', fontWeight: 500, marginBottom: 10 }}>
                <span>Employees lost in last 12 months</span>
                <span>{calc.lost}</span>
              </div>
              <input type="range" min={0} max={100} step={1} value={calc.lost} onChange={setLost} aria-label="Employees lost in the last 12 months" style={{ width: '100%', accentColor: '#2A9D8F', height: 44 }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: 14, color: '#B9C4D0', marginBottom: 8 }}>Your estimated annual cost of turnover:</div>
            <div aria-live="polite" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: '#E9C46A' }}>${calcDisplay.toLocaleString()}</div>
            <div style={{ fontSize: 14, color: '#B9C4D0', marginTop: 8 }}>That's the leak. The assessment shows you where the pipe is broken.</div>
            <button onClick={openAssessment} style={{ ...ctaButtonStyle, marginTop: 28 }}>Find the Leak: Take the Free Assessment</button>
          </div>
        </div>
      </section>

      {/* ============ SHOWCASE ============ */}
      <section style={{ background: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: h2Size, lineHeight: 1.2, color: '#0B2545', fontWeight: 700, margin: '0 0 12px' }}>See Your Score Before You Spend a Dollar</h2>
          <p style={{ fontSize: 16, color: '#5A6B7B', margin: '0 0 48px' }}>Two minutes inside the Hub: the assessment, your readiness dashboard, and the roadmap it builds for you.</p>
        </div>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ borderRadius: 16, aspectRatio: '16/9', overflow: 'hidden', boxShadow: '0 24px 60px rgba(11,37,69,0.18)', border: '1px solid #F5F7FA' }}>
            <video
              src="/assessment-walkthrough.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Product walkthrough: taking the assessment and seeing your score and roadmap"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(3,1fr)' : '1fr', gap: 16, marginTop: 24 }}>
            {SHOWCASE_CAPTIONS.map((cap) => (
              <div key={cap} style={{ background: '#F5F7FA', borderRadius: 12, padding: 20, textAlign: 'center', fontSize: 14, color: '#122B45', fontWeight: 500 }}>{cap}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="results" style={{ background: '#F5F7FA', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: h2Size, lineHeight: 1.2, color: '#0B2545', fontWeight: 700, margin: '0 0 56px' }}>Operators Who Stopped Firefighting</h2>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : '1fr', gap: 24 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.who} style={{ background: '#fff', borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, color: 'rgba(28,110,140,0.15)', position: 'absolute', top: 8, left: 16, lineHeight: 1 }}>"</div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16, position: 'relative' }}>
                {STARS.map((s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill="#E9C46A"><polygon points="10,1 12.6,7 19,7.6 14.2,11.9 15.6,18.2 10,14.8 4.4,18.2 5.8,11.9 1,7.6 7.4,7" /></svg>
                ))}
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#122B45', margin: '0 0 20px', position: 'relative' }}>{t.quote}</p>
              <div style={{ fontSize: 13, color: '#5A6B7B', fontWeight: 500 }}>{t.who}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: '#5A6B7B', marginTop: 48 }}>
          Built by Authentic Talent Edge · 14+ years in talent acquisition · Behavioral health, healthcare, construction, and sales organizations
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section style={{ background: 'linear-gradient(135deg,#0B2545 0%,#13496B 20%,#1C6E8C 40%,#2A9D8F 60%,#E9C46A 80%,#F4A261 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: h2SizeDark, color: '#fff', margin: '0 0 24px', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
          Your hiring problem finally has a name. Get yours diagnosed, free.
        </h3>
        <button onClick={openAssessment} style={{ ...ctaButtonStyle, background: '#0B2545' }}>Take the Free Assessment Now</button>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 12 }}>15 minutes. Instant results. No credit card, no sales call.</div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" style={{ background: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: h2Size, lineHeight: 1.2, color: '#0B2545', fontWeight: 700, margin: '0 0 48px', textAlign: 'center' }}>Fair Questions. Straight Answers.</h2>
          {faqs.map((f) => (
            <div key={f.q} style={{ borderBottom: '1px solid #EBEEF2' }}>
              <button
                onClick={() => toggleFaq(f.index)}
                aria-expanded={f.isOpen}
                style={{ width: '100%', background: 'none', border: 'none', padding: '20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: '#122B45' }}>{f.q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-flex', transition: 'transform 0.2s', transform: `rotate(${f.isOpen ? 180 : 0}deg)`, minWidth: 18 }}>
                  <path d="M6 9L12 15L18 9" stroke="#5A6B7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {f.isOpen && (
                <div role="region" style={{ padding: '0 4px 20px', fontSize: 15, color: '#5A6B7B', lineHeight: 1.6 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section style={{ background: '#0B2545', padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: h2SizeDark, lineHeight: 1.25, color: '#fff', maxWidth: 760, margin: '0 auto 20px' }}>
          You've Diagnosed Everything Else in Your Business. It's Time Someone{' '}
          <span style={{ background: 'linear-gradient(135deg,#2A9D8F,#E9C46A,#F4A261)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Diagnosed This</span>.
        </h2>
        <p style={{ fontSize: 17, color: '#B9C4D0', maxWidth: 520, margin: '0 auto 32px' }}>15 minutes from now, you'll know exactly why hiring keeps breaking, and what to do about it, in order.</p>
        <button onClick={openAssessment} style={ctaButtonStyle}>Take the Free Assessment Now</button>
        <div style={{ fontSize: 13, color: '#B9C4D0', marginTop: 14 }}>Free forever · Instant results · Built by operators, not theorists</div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ background: '#0A0E14', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4,1fr)' : isTablet ? 'repeat(2,1fr)' : '1fr', gap: 40 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
              Talent Growth Readiness <span style={{ color: '#2A9D8F' }}>Hub</span>
            </div>
            <p style={{ fontSize: 14, color: '#8A97A6', lineHeight: 1.6, maxWidth: 260 }}>A free diagnostic and resource platform by Authentic Talent Edge.</p>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#8A97A6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Explore</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="#how-it-works" style={{ color: '#F5F7FA', fontSize: 14 }}>How It Works</a>
              <a href="#what-you-get" style={{ color: '#F5F7FA', fontSize: 14 }}>What You Get</a>
              <a href="#faq" style={{ color: '#F5F7FA', fontSize: 14 }}>FAQ</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openAssessment(); }} style={{ color: '#F5F7FA', fontSize: 14 }}>Take the Assessment</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#8A97A6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="#" style={{ color: '#F5F7FA', fontSize: 14 }}>Expert Consultation</a>
              <a href="#" style={{ color: '#F5F7FA', fontSize: 14 }}>Consulting Projects</a>
              <a href="#" style={{ color: '#F5F7FA', fontSize: 14 }}>Fractional Advisory</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#8A97A6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Connect</div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <a href="#" aria-label="LinkedIn" style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5F7FA"><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /><path d="M10 9h4v2c1-1.5 2.5-2.3 4.5-2.3 3.5 0 5.5 2.3 5.5 6.3V21h-4v-5.5c0-1.8-.7-3-2.4-3-1.3 0-2.1.9-2.4 1.8-.1.3-.2.7-.2 1.2V21h-4z" /></svg>
              </a>
              <a href="#" aria-label="Instagram" style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F7FA" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
              </a>
              <a href="#" aria-label="Facebook" style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5F7FA"><path d="M14 21v-8h3l.5-4H14V7c0-1.2.3-2 2-2h1.6V1.4C17.2 1.3 16 1.2 14.7 1.2 11.9 1.2 10 2.9 10 6v3H7v4h3v8z" /></svg>
              </a>
            </div>
            <a href="mailto:hello@authentictalentedge.com" style={{ color: '#8A97A6', fontSize: 14 }}>hello@authentictalentedge.com</a>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '48px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', fontSize: 13, color: '#8A97A6' }}>
          <div>© {new Date().getFullYear()} Authentic Talent Edge. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: '#8A97A6' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#8A97A6' }}>Terms</a>
          </div>
        </div>
      </footer>

      {/* ============ STICKY MOBILE CTA ============ */}
      {showStickyCta && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #EBEEF2', boxShadow: '0 -4px 16px rgba(10,14,20,0.08)', padding: '10px 16px', zIndex: 50, display: 'flex' }}>
          <button onClick={openAssessment} style={{ flex: 1, background: '#2A9D8F', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', borderRadius: 8, padding: 12, minHeight: 44, cursor: 'pointer' }}>
            Take the Free Assessment
          </button>
        </div>
      )}
    </div>
  );
}
