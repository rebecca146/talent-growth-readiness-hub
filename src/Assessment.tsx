import { useState, type CSSProperties, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import {
  QUESTIONS,
  DIMENSION_META,
  RECOMMENDATIONS,
  tierForScore,
  type Dimension,
} from './assessmentData';

type Phase = 'intro' | 'question' | 'contact' | 'results';

const DIMENSIONS: Dimension[] = ['ownership', 'process', 'onboarding', 'metrics'];

interface ResourceLink {
  title: string;
  url: string;
  description: string;
}

type ResourceLinksState = ResourceLink[] | 'loading' | 'error';

function average(nums: number[]) {
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

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

const secondaryButtonStyle: CSSProperties = {
  background: 'none',
  color: '#122B45',
  fontWeight: 600,
  fontSize: 15,
  border: '1px solid #EBEEF2',
  borderRadius: 8,
  padding: '12px 24px',
  minHeight: 44,
  cursor: 'pointer',
};

export default function Assessment() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactError, setContactError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saveWarning, setSaveWarning] = useState(false);
  const [resourceLinks, setResourceLinks] = useState<Partial<Record<Dimension, ResourceLinksState>>>({});

  const question = QUESTIONS[questionIndex];
  const selectedScore = answers[question?.id];

  const dimensionScores = DIMENSIONS.reduce(
    (acc, dim) => {
      const scores = QUESTIONS.filter((q) => q.dimension === dim).map((q) => answers[q.id]);
      acc[dim] = average(scores);
      return acc;
    },
    {} as Record<Dimension, number>,
  );
  const overallScore = average(DIMENSIONS.map((d) => dimensionScores[d]));

  const selectAnswer = (score: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: score }));
  };

  const goNext = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase('contact');
    }
  };

  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else {
      setPhase('intro');
    }
  };

  const loadResourceLinks = (dims: Dimension[]) => {
    setResourceLinks(Object.fromEntries(dims.map((dim) => [dim, 'loading'])) as Record<Dimension, ResourceLinksState>);
    dims.forEach(async (dim) => {
      const tier = tierForScore(dimensionScores[dim]);
      const query = RECOMMENDATIONS[dim][tier].query;
      const { data, error } = await supabase.functions.invoke('resource-links', { body: { query } });
      setResourceLinks((prev) => ({
        ...prev,
        [dim]: error ? 'error' : (data?.results ?? []),
      }));
    });
  };

  const submitContact = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setContactError('Enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactError('Enter a valid email address.');
      return;
    }
    setContactError('');
    setSubmitting(true);
    const { error } = await supabase.from('assessment_results').insert({
      name: name.trim(),
      email: email.trim(),
      ownership_score: dimensionScores.ownership,
      process_score: dimensionScores.process,
      onboarding_score: dimensionScores.onboarding,
      metrics_score: dimensionScores.metrics,
      overall_score: overallScore,
      answers,
    });
    setSubmitting(false);
    setSaveWarning(!!error);
    setPhase('results');
    loadResourceLinks(DIMENSIONS);
  };

  const progressPct = Math.round((questionIndex / QUESTIONS.length) * 100);
  const roadmap = [...DIMENSIONS].sort((a, b) => dimensionScores[a] - dimensionScores[b]);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <header style={{ padding: '20px 24px', maxWidth: 720, margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 17, fontWeight: 600, color: '#122B45' }}>
          Talent Growth Readiness <span style={{ color: '#2A9D8F' }}>Hub</span>
        </Link>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 24px 80px' }}>
        {phase === 'intro' && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEEF2', padding: 40, textAlign: 'center' }}>
            <div style={{ color: '#F4A261', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
              Free 15-Minute Readiness Assessment
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#0B2545', margin: '0 0 16px', lineHeight: 1.2 }}>
              Let's find out what's really broken.
            </h1>
            <p style={{ fontSize: 16, color: '#5A6B7B', lineHeight: 1.6, margin: '0 0 32px' }}>
              20 quick questions across ownership, process, onboarding, and metrics. Answer honestly: your score and roadmap appear instantly, no waiting, no sales call.
            </p>
            <button onClick={() => setPhase('question')} style={ctaButtonStyle}>
              Start the Assessment
            </button>
          </div>
        )}

        {phase === 'question' && question && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#5A6B7B', marginBottom: 8 }}>
                <span>
                  Question {questionIndex + 1} of {QUESTIONS.length}
                </span>
                <span>{DIMENSION_META[question.dimension].label}</span>
              </div>
              <div style={{ height: 8, background: '#EBEEF2', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: '#2A9D8F', borderRadius: 4, transition: 'width 0.3s ease-out' }} />
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEEF2', padding: 32 }}>
              <h2 style={{ fontSize: 21, color: '#122B45', fontWeight: 600, margin: '0 0 24px', lineHeight: 1.4 }}>{question.text}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {question.options.map((opt) => {
                  const isSelected = selectedScore === opt.score;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => selectAnswer(opt.score)}
                      style={{
                        textAlign: 'left',
                        padding: '16px 18px',
                        borderRadius: 10,
                        border: isSelected ? '2px solid #2A9D8F' : '1px solid #EBEEF2',
                        background: isSelected ? 'rgba(42,157,143,0.06)' : '#fff',
                        fontSize: 15,
                        color: '#122B45',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        minHeight: 44,
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button onClick={goBack} style={secondaryButtonStyle}>
                Back
              </button>
              <button onClick={goNext} disabled={selectedScore === undefined} style={{ ...ctaButtonStyle, opacity: selectedScore === undefined ? 0.5 : 1, cursor: selectedScore === undefined ? 'default' : 'pointer' }}>
                {questionIndex === QUESTIONS.length - 1 ? 'See My Results' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {phase === 'contact' && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEEF2', padding: 40 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: '#0B2545', margin: '0 0 12px' }}>
              Almost there.
            </h2>
            <p style={{ fontSize: 15, color: '#5A6B7B', lineHeight: 1.6, margin: '0 0 28px' }}>
              Where should we send your roadmap? Your score shows up right after this, no waiting.
            </p>
            <form onSubmit={submitContact}>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#122B45', marginBottom: 6 }}>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#122B45', marginBottom: 6 }}>Work email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  style={inputStyle}
                />
              </label>
              {contactError && <div style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{contactError}</div>}
              <button type="submit" disabled={submitting} style={{ ...ctaButtonStyle, width: '100%', marginTop: 12, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Scoring…' : 'Get My Free Results'}
              </button>
            </form>
          </div>
        )}

        {phase === 'results' && (
          <div>
            {saveWarning && (
              <div style={{ background: '#FEF3C7', border: '1px solid #F4A261', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#92400E', marginBottom: 20 }}>
                Your results are shown below, but we couldn't save them on our end. If you want a copy emailed to you, reach out at{' '}
                <a href="mailto:hello@authentictalentedge.com" style={{ color: '#92400E', fontWeight: 600 }}>hello@authentictalentedge.com</a>.
              </div>
            )}

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEEF2', padding: 32, textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: '#5A6B7B', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                Your Talent Readiness Score
              </div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, color: '#0B2545' }}>
                {overallScore}
                <span style={{ fontSize: 26, color: '#5A6B7B', fontFamily: "'Inter', sans-serif" }}>/100</span>
              </div>

              <div style={{ marginTop: 32, textAlign: 'left' }}>
                {DIMENSIONS.map((dim) => (
                  <div key={dim} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#122B45', fontWeight: 500, marginBottom: 6 }}>
                      <span>{DIMENSION_META[dim].label}</span>
                      <span>{dimensionScores[dim]}%</span>
                    </div>
                    <div style={{ height: 8, background: '#F5F7FA', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 4, width: `${dimensionScores[dim]}%`, background: DIMENSION_META[dim].color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h2 style={{ fontSize: 20, color: '#0B2545', fontWeight: 700, margin: '0 0 16px' }}>Your Prioritized Roadmap</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {roadmap.map((dim) => {
                const tier = tierForScore(dimensionScores[dim]);
                const rec = RECOMMENDATIONS[dim][tier];
                return (
                  <div key={dim} style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEEF2', padding: 24 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase',
                          color: '#1C6E8C',
                          background: 'rgba(28,110,140,0.1)',
                          borderRadius: 6,
                          padding: '4px 8px',
                        }}
                      >
                        {DIMENSION_META[dim].label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase',
                          color: '#5A6B7B',
                        }}
                      >
                        {rec.tag}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 17, color: '#122B45', fontWeight: 600, margin: '0 0 8px' }}>{rec.title}</h3>
                    <p style={{ fontSize: 14.5, color: '#5A6B7B', lineHeight: 1.6, margin: '0 0 16px' }}>{rec.body}</p>
                    <ResourceLinksList state={resourceLinks[dim]} />
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'linear-gradient(135deg,#0B2545 0%,#13496B 20%,#1C6E8C 40%,#2A9D8F 60%,#E9C46A 80%,#F4A261 100%)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#fff', margin: '0 0 12px' }}>
                Want help closing these gaps faster?
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 20px' }}>
                Book a free consultation to talk through your results with Authentic Talent Edge.
              </p>
              <a
                href={`mailto:hello@authentictalentedge.com?subject=Talent Readiness follow-up&body=Hi, I just took the assessment and scored ${overallScore}/100. I'd like to talk through my results.`}
                style={{ ...ctaButtonStyle, background: '#0B2545', display: 'inline-block' }}
              >
                Book a Consultation
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/" style={{ color: '#1C6E8C', fontWeight: 500, fontSize: 14 }}>
                ← Back to home
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  border: '1px solid #EBEEF2',
  borderRadius: 8,
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  minHeight: 44,
};

function ResourceLinksList({ state }: { state: ResourceLinksState | undefined }) {
  if (!state || state === 'loading') {
    return <div style={{ fontSize: 13, color: '#5A6B7B' }}>Finding free resources...</div>;
  }
  if (state === 'error' || state.length === 0) {
    return null;
  }
  return (
    <div style={{ borderTop: '1px solid #F5F7FA', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#5A6B7B' }}>
        Free resources
      </div>
      {state.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 13.5, color: '#1C6E8C', fontWeight: 500, lineHeight: 1.4 }}
        >
          {link.title}
        </a>
      ))}
    </div>
  );
}
