# CAREEROS ULTIMATE

CareerOS Ultimate is a privacy-first career operating system designed for Saket Yadav / Maccy Creations. It is built as an offline-friendly PWA foundation with a production-oriented architecture for skill tracking, job-source integration, AI-assisted resume planning, and enterprise-style settings.

## Included app structure

- Home tab
- Skills tab
- Career tab
- AI Roadmap tab
- AI & ATS Resume tab
- Live Job tab
- Application Tracker tab
- AI Hub
- Profile & Settings tab

## Build and run

```bash
npm install
cp .env.example .env
npm run dev
```

## Production guidance

- Use only official, permissioned APIs for live job data (Naukri, Indeed, LinkedIn, Adzuna, JSearch, etc.).
- Use server-side proxy functions for OpenAI, Gemini, and any AI provider to protect secrets and maintain compliance.
- Keep all provider keys in Supabase Edge Functions, not in a browser build.
- Add a proper privacy policy, terms of service, and deletion flow before public launch.
- Use HTTPS and a custom domain before production deployment.
- Generate PWA icons and Android package metadata before APK distribution.

## Supabase manual setup

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env`.
3. Enable Email auth in Authentication → Providers.
4. Create tables for `profiles`, `skills`, `applications`, `roadmaps`, `resumes`, and `ai_runs`.
5. Apply RLS policies so each row is restricted to `auth.uid() = user_id`.
6. Keep service-role keys server-side only.

## Contact

CAREEROSULTIMATE@gmail.com
