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

## Supabase configuration

The project is configured for the supplied Supabase project:

- URL: `https://kyrsdewrgqejoajhpfrn.supabase.co`
- Key type: Supabase publishable key

For local development:

```bash
npm install
cp .env.example .env
npm run dev
```

The publishable/anon key is intended for frontend use. Never add a Supabase service-role key, OpenAI key, Gemini key, or job-provider secret to the frontend. Put privileged credentials in Supabase Edge Function secrets.

## Production guidance

- Use only official, permissioned APIs for live job data (Naukri, Indeed, LinkedIn, Adzuna, JSearch, etc.).
- Use server-side proxy functions for OpenAI, Gemini, and any AI provider to protect secrets and maintain compliance.
- Add a proper privacy policy, terms of service, and deletion flow before public launch.
- Use HTTPS and a custom domain before production deployment.
- Generate PWA icons and Android package metadata before APK distribution.

## Supabase manual setup

1. In Supabase Authentication → Providers, enable Email.
2. Configure Site URL and redirect URLs for local development and your final custom domain.
3. Create tables for `profiles`, `skills`, `applications`, `roadmaps`, `resumes`, and `ai_runs`.
4. Add a `user_id uuid references auth.users(id)` column to user-owned tables.
5. Enable RLS and restrict rows with policies based on `auth.uid() = user_id`.
6. Create Edge Functions for job aggregation and AI calls; store their secrets with `supabase secrets set`.
7. Configure SMTP and email templates before production authentication.

## Contact

CAREEROSULTIMATE@gmail.com
