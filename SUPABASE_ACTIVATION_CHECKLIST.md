# Supabase activation checklist

Project reference: `kyrsdewrgqejoajhpfrn`

## Database

1. Open the Supabase SQL Editor.
2. Run `supabase/schema.sql` in one execution.
3. Confirm these tables exist: `profiles`, `user_skills`, `applications`, `roadmaps`, `resumes`, and `ai_runs`.
4. Confirm RLS is enabled on every table.
5. Create a test account and verify the profile trigger creates exactly one profile row.
6. Test with two accounts that each account can only read, insert, update, and delete its own rows.

## Authentication

1. Enable Email provider.
2. Decide whether email confirmation is required.
3. Configure Site URL and production/local redirect URLs.
4. Test signup, confirmation, login, refresh, logout, and password recovery.

## Edge Functions

```bash
supabase login
supabase link --project-ref kyrsdewrgqejoajhpfrn
supabase functions deploy jobs
supabase functions deploy ai
```

Set only server-side secrets:

```bash
supabase secrets set ADZUNA_APP_ID=... ADZUNA_APP_KEY=... ADZUNA_COUNTRY=in
supabase secrets set JSEARCH_API_KEY=... JSEARCH_API_HOST=jsearch.p.rapidapi.com
supabase secrets set OPENAI_API_KEY=... OPENAI_MODEL=gpt-4o-mini
supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=gemini-2.0-flash
```

The frontend must never call provider APIs directly. Providers must return original URLs and source attribution. If every provider fails or is unconfigured, return zero listings and a clear message—never sample or fabricated data.

## Production validation

- Use HTTPS only.
- Check Edge Function logs for upstream failures without exposing secrets.
- Apply provider rate limits and request-size limits.
- Validate every job URL as HTTP(S) before display.
- Store AI provider, grounded status, and citations with every AI run.
- Remove test users and test records before launch.
