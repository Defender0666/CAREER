# CareerOS Ultimate — production setup

CareerOS Ultimate is a privacy-first PWA/Capacitor application for Saket Yadav and Maccy Creations. The browser bundle contains no privileged secrets and never invents jobs, salaries, employer information or AI citations.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
npm run build
```

The repository is preconfigured for the supplied Supabase project through the publishable-key environment variables in `.env.example`:

```dotenv
VITE_SUPABASE_URL=https://kyrsdewrgqejoajhpfrn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_cAtn2dFn4QIv7BSCl7Vmmg_hmOz3jVd
```

The publishable key is intended for browser use. Never put a Supabase service-role key, database password, AI key, or job-provider key in `.env`, source code, or the deployed browser bundle.

## Supabase manual configuration

1. Open the supplied Supabase project at `https://kyrsdewrgqejoajhpfrn.supabase.co`.
2. Run `supabase/schema.sql` once in the Supabase SQL Editor.
3. In Authentication → Providers, enable Email and configure confirmation/password-reset email settings.
4. Add the local URL to Authentication → URL Configuration while developing:
   - Site URL: `http://localhost:5173`
   - Redirect URL: `http://localhost:5173/**`
5. Deploy the Edge Functions from the repository:

```bash
supabase login
supabase link --project-ref kyrsdewrgqejoajhpfrn
supabase functions deploy jobs
supabase functions deploy ai
```

6. Configure privileged secrets only in the Supabase Edge Function environment:

```bash
supabase secrets set ADZUNA_APP_ID=... ADZUNA_APP_KEY=... JSEARCH_API_KEY=...
supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
```

7. Keep provider adapters limited to approved APIs and return an explicit empty state when a provider fails. Validate source URLs before displaying AI claims.
8. Test signup, login, logout, RLS isolation, offline local storage, Edge Functions, and deleted-user access before production.

## Domain and release

Host `dist` on Vercel, Netlify, Cloudflare Pages, or another HTTPS host, add the custom domain, and configure SPA fallback to `index.html`. Then update Supabase Authentication → URL Configuration with the final HTTPS Site URL and redirect URL. Add the same environment variables to the hosting provider. Do not commit a generated `.env` file.

Before launch verify RLS isolation, account deletion, privacy policy, CSP/security headers, provider rate limits, offline sync conflict handling, service-worker updates, real branded icons, accessibility, and mobile behavior.

Contact: CAREEROSULTIMATE@gmail.com
