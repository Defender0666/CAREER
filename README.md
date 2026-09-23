# CareerOS Ultimate

CareerOS Ultimate is a privacy-first career operating system for Saket Yadav / Maccy Creations. It is a Vite + React + TypeScript PWA foundation that works offline for the shell, skill planning, career matching and local tracker state.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Supabase setup (manual)

1. Create a Supabase project and copy its URL and anon key into `.env`.
2. Enable Email provider under Authentication → Providers.
3. Create tables protected by RLS: `profiles`, `skills`, `applications`, `roadmaps`, `resumes`, and `ai_runs`, each with a `user_id uuid references auth.users(id)` column.
4. Add policies restricting every row to `auth.uid() = user_id`. Never expose service-role keys in Vite.
5. Put job aggregation and AI calls behind Supabase Edge Functions. Store provider secrets as Edge Function secrets, validate responses, retain source URLs/timestamps, and return an empty result when a source cannot be verified.

## Production integration notes

- Job sites such as LinkedIn, Naukri and Indeed must be accessed only through their official APIs, permitted feeds, or links; do not scrape or bypass their terms. Adzuna and JSearch credentials belong in the server function.
- AI providers (OpenAI/ChatGPT, Gemini and any Superhuman integration) should use a server proxy, rate limits, consent, redaction and citations. The UI intentionally shows no fabricated listings or AI output.
- Add a real privacy policy, terms, account deletion flow, consent and error monitoring before launch.
- Build an Android APK with Capacitor after web verification: `npm run build && npx cap add android && npx cap copy && npx cap open android`.
- Configure a custom domain in your hosting provider, HTTPS, Supabase redirect URLs, and Android deep links. Generate production PWA icons (the placeholder manifest has no icons yet).

Contact: CAREEROSULTIMATE@gmail.com
