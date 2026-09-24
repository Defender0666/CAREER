# CareerOS Ultimate

## Build and run

```bash
npm install
cp .env.example .env
npm run dev
```

The app includes the CareerOS Ultimate PWA foundation for Saket Yadav / Maccy Creations: Home, Skills, Career, AI Roadmap, AI & ATS Resume, Live Job, Application Tracker, AI Hub, and Profile & Settings.

## Production files

- `capacitor.config.ts` — Android app configuration
- `public/manifest.webmanifest` — installable PWA metadata
- `DEPLOYMENT.md` — architecture, custom domain, APK and release checklist
- `supabase/schema.sql` — database and RLS setup
- `supabase/functions/jobs` — approved job-provider function starter
- `supabase/functions/ai` — secure AI function starter

Use only the Supabase publishable key in the client. Keep service-role, AI and job-provider secrets in Supabase Edge Function secrets. Never publish fabricated job, salary or company information.

Contact: CAREEROSULTIMATE@gmail.com
