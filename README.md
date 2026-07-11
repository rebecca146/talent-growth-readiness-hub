# Talent Growth Readiness Hub

React + TypeScript + Vite site for Authentic Talent Edge's Talent Growth Readiness Hub.

## What's here

- **Landing page** (`/`) — hero, stats, problem/solution, turnover calculator, testimonials, FAQ, footer. Fully responsive (mobile drawer nav, sticky mobile CTA).
- **Assessment** (`/assessment`) — 20-question readiness assessment (5 questions each across Ownership, Process, Onboarding, Metrics), one question per screen with a progress bar. Ends with a contact-capture step, then an instant results screen: overall score, per-dimension breakdown, and a prioritized roadmap of recommendations.
- Every assessment submission (name, email, per-dimension scores, overall score, raw answers) is saved to Supabase.

## Local development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173.

## Environment variables

Copy `.env.example` to `.env` and fill in your Supabase project's URL and publishable key:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

A project (`talent-growth-readiness-hub`, Supabase org `wsexzjjtuhvcjmneebtt`) is already set up with an `assessment_results` table (`name`, `email`, `ownership_score`, `process_score`, `onboarding_score`, `metrics_score`, `overall_score`, `answers` jsonb, `created_at`). Row-level security only allows anonymous inserts — nothing can be read back from the browser.

## Building for production

```bash
npm run build
```

Outputs to `dist/`. Deploy that folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.) — just make sure the `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` env vars are set on the host too, since they're baked in at build time. Because this is a client-side-routed SPA (`/assessment` via react-router), the host needs a catch-all rewrite to `index.html` so a direct load of `/assessment` doesn't 404.
