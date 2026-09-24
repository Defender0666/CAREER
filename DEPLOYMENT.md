# Full deployment and provider configuration

## 1. Supabase database

Open the supplied Supabase project and run `supabase/schema.sql` in the SQL Editor. This creates the tables, profile trigger, indexes and owner-only RLS policies.

## 2. Deploy Edge Functions

Install the Supabase CLI, then run from the repository root:

```bash
supabase login
supabase link --project-ref kyrsdewrgqejoajhpfrn
supabase functions deploy jobs
supabase functions deploy ai
```

The `jobs` function now supports genuine results from Adzuna and JSearch. The `ai` function supports OpenAI first, then Gemini as a fallback. Neither function fabricates data or exposes provider keys to the browser.

## 3. Configure real provider secrets

Use secrets only in Supabase:

```bash
supabase secrets set ADZUNA_APP_ID=... ADZUNA_APP_KEY=... ADZUNA_COUNTRY=in
supabase secrets set JSEARCH_API_KEY=... JSEARCH_API_HOST=jsearch.p.rapidapi.com
supabase secrets set OPENAI_API_KEY=... OPENAI_MODEL=gpt-4o-mini
supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=gemini-2.0-flash
```

Use only keys obtained from the providers. If no provider is configured, the app shows an honest empty state.

## 4. Vercel

Import `Defender0666/CAREER` into Vercel. The committed `vercel.json` sets the Vite build and `dist` output. Add these environment variables in Project Settings → Environment Variables:

```text
VITE_SUPABASE_URL=https://kyrsdewrgqejoajhpfrn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<the publishable key>
```

Redeploy after saving variables. Never add service-role, AI, or job-provider secrets to Vercel client variables.

## 5. Netlify

Import the repository into Netlify. The committed `netlify.toml` configures `npm run build`, `dist`, and SPA fallback. Add the same two `VITE_` variables in Site configuration → Environment variables, then deploy.

## 6. Custom domain and Auth

In Vercel or Netlify, add your domain and follow the DNS records shown by the host. Wait for DNS verification and HTTPS issuance. Then in Supabase → Authentication → URL Configuration set:

```text
Site URL: https://your-real-domain.example
Redirect URL: https://your-real-domain.example/**
```

Replace the example with the domain you actually own. Add `http://localhost:5173/**` as an additional local-development redirect while testing.

## 7. Verify before launch

Test email signup/confirmation, login/logout, RLS isolation, job links opening at the original provider, AI provider attribution, empty provider states, offline shell, mobile layout, HTTPS, and service-worker updates. Do not advertise a production URL until DNS and HTTPS are verified.
