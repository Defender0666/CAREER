# Supabase deployment checklist

1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. Install the Supabase CLI and link the project.
3. Deploy the starter functions:

```bash
supabase functions deploy jobs
supabase functions deploy ai
```

4. Add secrets only to the Edge Function environment:

```bash
supabase secrets set ADZUNA_APP_ID=... ADZUNA_APP_KEY=... JSEARCH_API_KEY=...
supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
```

5. Replace the provider TODOs with approved API adapters that preserve the original provider URL, title, company, location, timestamp, and source attribution.
6. Configure Email Auth, Site URL, redirect URLs, SMTP, custom domain, and RLS in the Supabase dashboard.
7. Test unauthenticated, cross-user, and deleted-user access before production.
