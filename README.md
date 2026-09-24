# CareerOS Ultimate — verified release baseline

CareerOS Ultimate is a privacy-first PWA/Capacitor application for Saket Yadav and Maccy Creations. It supports browser/offline-first use with optional Supabase sync, authenticated AI providers, and server-side job-provider adapters.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
npm run build
```

The UI works without credentials using local storage. Supabase, live jobs, and AI features intentionally show a configuration state until their server-side providers are configured. The app does not fabricate jobs, career facts, salary information, or AI citations.

## Supabase setup

1. Open your Supabase project and run `supabase/schema.sql` in the SQL Editor.
2. Enable Email authentication and configure confirmation/password reset URLs.
3. Deploy the Edge Functions:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy jobs
supabase functions deploy ai
```

4. Set secrets only in Edge Functions, never in `.env` or the browser bundle:

```bash
supabase secrets set ADZUNA_APP_ID=... ADZUNA_APP_KEY=... JSEARCH_API_KEY=...
supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
```

Provider adapters must preserve the upstream URL, title, company, location, posting timestamp, and source attribution. If a provider is unavailable, return an explicit empty state instead of placeholder data.

## Internet and offline behavior

- Skills, career matching, resume drafts, and application tracking remain usable in local storage while offline.
- Supabase sync, AI calls, and live jobs require internet and a configured authenticated project.
- No private API key belongs in the frontend.

## Deployment and custom domain

Build `dist` and deploy it to an HTTPS static host such as Vercel, Netlify, or Cloudflare Pages. Configure SPA fallback to `index.html`, attach your custom domain at the host, then add the HTTPS domain and callback URL to Supabase Authentication URL Configuration.

## Release checklist

Test signup, login, logout, RLS isolation, offline reload, Edge Functions, provider failures, mobile navigation, CSP/security headers, rate limits, privacy policy, backups, and account deletion before production. Contact: CAREEROSULTIMATE@gmail.com
