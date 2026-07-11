export type Dimension = 'ownership' | 'process' | 'onboarding' | 'metrics';

export const DIMENSION_META: Record<Dimension, { label: string; color: string }> = {
  ownership: { label: 'Ownership', color: '#DC2626' },
  process: { label: 'Process', color: '#D97706' },
  onboarding: { label: 'Onboarding', color: '#F4A261' },
  metrics: { label: 'Metrics', color: '#2A9D8F' },
};

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  options: { label: string; score: number }[];
}

export const QUESTIONS: Question[] = [
  // Ownership
  {
    id: 'own-1',
    dimension: 'ownership',
    text: 'When a role opens up, who runs the hiring process from start to finish?',
    options: [
      { label: 'No one specific — whoever has time', score: 0 },
      { label: 'Me, personally, every time', score: 33 },
      { label: 'A manager, but inconsistently', score: 67 },
      { label: 'A named owner with backup coverage', score: 100 },
    ],
  },
  {
    id: 'own-2',
    dimension: 'ownership',
    text: "If you were unreachable for two weeks, would hiring for an open role still move forward?",
    options: [
      { label: 'No, everything would stall', score: 0 },
      { label: 'Maybe, if someone remembered to check in', score: 33 },
      { label: 'Mostly yes, with some gaps', score: 67 },
      { label: 'Yes, without me', score: 100 },
    ],
  },
  {
    id: 'own-3',
    dimension: 'ownership',
    text: "Do your hiring managers know exactly what's expected of them at each stage of hiring?",
    options: [
      { label: "Not really, they wing it", score: 0 },
      { label: "Only the ones who've done it before", score: 33 },
      { label: 'Most do, informally', score: 67 },
      { label: "Yes, it's documented and trained", score: 100 },
    ],
  },
  {
    id: 'own-4',
    dimension: 'ownership',
    text: 'When was the last time hiring responsibilities were clearly assigned or reviewed?',
    options: [
      { label: 'Never', score: 0 },
      { label: "Can't remember", score: 33 },
      { label: 'Within the last year', score: 67 },
      { label: 'Reviewed on a regular cadence', score: 100 },
    ],
  },
  {
    id: 'own-5',
    dimension: 'ownership',
    text: 'How many people at your company could explain your hiring process end to end?',
    options: [
      { label: "Just me, and even I'm fuzzy on it", score: 0 },
      { label: 'One or two people', score: 33 },
      { label: 'Most managers', score: 67 },
      { label: 'Everyone who hires', score: 100 },
    ],
  },
  // Process
  {
    id: 'proc-1',
    dimension: 'process',
    text: 'Do you use a consistent set of interview questions for a given role?',
    options: [
      { label: 'No, every interviewer freestyles', score: 0 },
      { label: 'Sometimes', score: 33 },
      { label: 'Usually', score: 67 },
      { label: 'Always, with a scorecard', score: 100 },
    ],
  },
  {
    id: 'proc-2',
    dimension: 'process',
    text: 'Is there a written job scorecard or success profile before you post a role?',
    options: [
      { label: 'Never', score: 0 },
      { label: 'Rarely', score: 33 },
      { label: 'Sometimes', score: 67 },
      { label: 'Every time', score: 100 },
    ],
  },
  {
    id: 'proc-3',
    dimension: 'process',
    text: 'How do hiring decisions get made when interviewers disagree?',
    options: [
      { label: "Whoever's loudest or most senior wins", score: 0 },
      { label: 'Ad hoc discussion', score: 33 },
      { label: 'A rough consensus process', score: 67 },
      { label: 'A structured decision framework', score: 100 },
    ],
  },
  {
    id: 'proc-4',
    dimension: 'process',
    text: 'How long does it typically take from job posting to offer?',
    options: [
      { label: 'No idea, it varies wildly', score: 0 },
      { label: '60+ days', score: 33 },
      { label: '30-60 days', score: 67 },
      { label: 'Under 30 days, consistently', score: 100 },
    ],
  },
  {
    id: 'proc-5',
    dimension: 'process',
    text: 'Do candidates go through the same steps regardless of who interviews them?',
    options: [
      { label: 'No, it depends on the interviewer', score: 0 },
      { label: 'Loosely', score: 33 },
      { label: 'Mostly', score: 67 },
      { label: 'Yes, standardized every time', score: 100 },
    ],
  },
  // Onboarding
  {
    id: 'onb-1',
    dimension: 'onboarding',
    text: 'Is there a documented onboarding plan for new hires beyond day one?',
    options: [
      { label: 'No', score: 0 },
      { label: 'Just a checklist for paperwork', score: 33 },
      { label: 'A rough plan, inconsistently followed', score: 67 },
      { label: 'A structured 30/60/90 plan', score: 100 },
    ],
  },
  {
    id: 'onb-2',
    dimension: 'onboarding',
    text: "What's your new-hire turnover like in the first 90 days?",
    options: [
      { label: 'We lose people regularly', score: 0 },
      { label: "It happens more than I'd like", score: 33 },
      { label: 'Rare, but it happens', score: 67 },
      { label: 'Almost never', score: 100 },
    ],
  },
  {
    id: 'onb-3',
    dimension: 'onboarding',
    text: "Do new hires have a named point of contact (not just their manager) during ramp-up?",
    options: [
      { label: 'No', score: 0 },
      { label: 'Sometimes', score: 33 },
      { label: 'Usually', score: 67 },
      { label: 'Always', score: 100 },
    ],
  },
  {
    id: 'onb-4',
    dimension: 'onboarding',
    text: 'How do you know if a new hire is on track at 30/60/90 days?',
    options: [
      { label: "We don't formally check", score: 0 },
      { label: "Manager's gut feeling", score: 33 },
      { label: 'Informal check-ins', score: 67 },
      { label: 'Structured milestone reviews', score: 100 },
    ],
  },
  {
    id: 'onb-5',
    dimension: 'onboarding',
    text: 'If the person who trains new hires left tomorrow, would onboarding still work?',
    options: [
      { label: 'No', score: 0 },
      { label: 'Barely', score: 33 },
      { label: 'Mostly', score: 67 },
      { label: "Yes, it's documented", score: 100 },
    ],
  },
  // Metrics
  {
    id: 'met-1',
    dimension: 'metrics',
    text: 'Can you say, right now, what your average time-to-fill is?',
    options: [
      { label: 'No idea', score: 0 },
      { label: 'Rough guess', score: 33 },
      { label: 'Yes, roughly', score: 67 },
      { label: 'Yes, precisely, and I track it', score: 100 },
    ],
  },
  {
    id: 'met-2',
    dimension: 'metrics',
    text: 'Do you track why people leave (exit reasons), not just that they left?',
    options: [
      { label: 'No', score: 0 },
      { label: 'Occasionally', score: 33 },
      { label: 'Most of the time', score: 67 },
      { label: 'Always, and we act on patterns', score: 100 },
    ],
  },
  {
    id: 'met-3',
    dimension: 'metrics',
    text: 'Could you show a board or leadership team your current turnover rate on one slide?',
    options: [
      { label: 'No', score: 0 },
      { label: "I'd have to dig for it", score: 33 },
      { label: 'Roughly, yes', score: 67 },
      { label: 'Yes, instantly', score: 100 },
    ],
  },
  {
    id: 'met-4',
    dimension: 'metrics',
    text: 'Do you know your cost-per-hire?',
    options: [
      { label: 'Never calculated it', score: 0 },
      { label: 'Rough ballpark', score: 33 },
      { label: 'Yes, estimated', score: 67 },
      { label: 'Yes, tracked precisely', score: 100 },
    ],
  },
  {
    id: 'met-5',
    dimension: 'metrics',
    text: "How do you currently know if your hiring process is working?",
    options: [
      { label: "We don't, really", score: 0 },
      { label: 'Gut feeling', score: 33 },
      { label: 'Occasional anecdotes', score: 67 },
      { label: 'Regular data review', score: 100 },
    ],
  },
];

export type Tier = 'critical' | 'developing' | 'strong';

export function tierForScore(score: number): Tier {
  if (score < 40) return 'critical';
  if (score < 70) return 'developing';
  return 'strong';
}

export interface Recommendation {
  tag: 'Self-Service' | 'Consultation' | 'Advisory';
  title: string;
  body: string;
}

export const RECOMMENDATIONS: Record<Dimension, Record<Tier, Recommendation>> = {
  ownership: {
    critical: {
      tag: 'Self-Service',
      title: 'No One Owns This Yet',
      body: "Every open role becomes a fire drill because there's no single owner accountable for it start to finish. Name one person — even part-time — who owns hiring for each department.",
    },
    developing: {
      tag: 'Self-Service',
      title: "Ownership Exists, But It's Fragile",
      body: 'Someone owns hiring, but it collapses under vacation or turnover. Document the role clearly enough that a backup could step in this week.',
    },
    strong: {
      tag: 'Consultation',
      title: 'Ownership Is Solid — Now Make It Resilient',
      body: "Hiring runs without you in the room. The next step is cross-training a second owner so one person leaving doesn't reopen the gap.",
    },
  },
  process: {
    critical: {
      tag: 'Self-Service',
      title: 'Every Interview Is Improvised',
      body: "Without a scorecard or standard questions, you're comparing gut feelings, not candidates. Build one job scorecard for your highest-volume role this month.",
    },
    developing: {
      tag: 'Self-Service',
      title: "You Have a Process — It's Just Optional",
      body: 'Structure exists but is inconsistently used. Make the scorecard and interview guide mandatory, not a suggestion.',
    },
    strong: {
      tag: 'Consultation',
      title: 'Process Is Working — Time to Scale It',
      body: "Your structure holds up for the roles you've built it for. Extend it to every open role and train new managers on it directly.",
    },
  },
  onboarding: {
    critical: {
      tag: 'Self-Service',
      title: 'Onboarding Is a Coin Flip',
      body: 'New hires are quitting because ramp-up is a shrug and a laptop. A written 30/60/90 plan for your highest-turnover role is the fastest fix available.',
    },
    developing: {
      tag: 'Self-Service',
      title: "Onboarding Exists, But It's Inconsistent",
      body: "Some new hires get support, others don't. Standardize the plan so it doesn't depend on which manager they land with.",
    },
    strong: {
      tag: 'Consultation',
      title: 'Onboarding Is Working — Protect It',
      body: 'Retention in the first 90 days is strong. Document what works so it survives a change in who trains new hires.',
    },
  },
  metrics: {
    critical: {
      tag: 'Self-Service',
      title: "You're Flying Blind",
      body: "You can't fix what you can't see. Start tracking time-to-fill and 90-day turnover for every hire, starting with your next one.",
    },
    developing: {
      tag: 'Self-Service',
      title: 'You Have Some Numbers, Not a System',
      body: "You can estimate your metrics but can't produce them on demand. Build one simple dashboard you update monthly.",
    },
    strong: {
      tag: 'Advisory',
      title: 'Metrics Are Solid — Make Them Actionable',
      body: 'You can report your numbers. The next step is using them to catch problems before they hit the board deck.',
    },
  },
};
