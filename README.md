# CareerOS Ultimate — production setup

CareerOS Ultimate is a privacy-first PWA/Capacitor application for Saket Yadav and Maccy Creations. The browser bundle contains no privileged secrets and never invents jobs, salaries, employer information or AI citations.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
npm run build
```

## Supabase manual configuration

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Add the project URL and publishable key to `.env` and your hosting provider. Never expose a service-role key.
3. Deploy both Edge Functions and configure their secrets in Supabase, not in Git:
   - `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`
   - `JSEARCH_API_KEY`
   - `OPENAI_API_KEY` and/or `GEMINI_API_KEY`
4. Keep provider adapters limited to approved APIs and return an explicit empty state when a provider fails. Validate source URLs before displaying AI claims.
5. Set Auth URL Configuration after choosing the final HTTPS domain. Enable email confirmation and configure password-reset email templates.

## Domain and release

Host `dist` on Vercel, Netlify or Cloudflare Pages, add the custom domain and HTTPS, and configure SPA fallback to `index.html`. Update Supabase Site URL and redirect URLs to the final domain. For Android run `npm run build`, `npx cap sync android`, then create a signed release in Android Studio.

Before launch verify RLS isolation, account deletion, privacy policy, CSP/security headers, provider rate limits, offline sync conflict handling, service-worker updates, real branded icons and accessibility on mobile.

Contact: CAREEROSULTIMATE@gmail.com
