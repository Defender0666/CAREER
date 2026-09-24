# Supabase deployment checklist

Run `supabase/schema.sql`, enable Email Auth, link the project, and deploy `jobs` and `ai` functions. Store only provider secrets in the Edge Function environment. Configure approved Adzuna/JSearch and AI adapters with upstream citations; never return invented records. Test RLS isolation, authentication, provider failures, offline local storage, and deleted-user access before release.

```bash
supabase functions deploy jobs
supabase functions deploy ai
supabase secrets set ADZUNA_APP_ID=... ADZUNA_APP_KEY=... JSEARCH_API_KEY=...
supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
```
