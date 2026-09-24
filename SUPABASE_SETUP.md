# CareerOS Ultimate — Supabase project configuration

This repository is configured to use the CareerOS Supabase project:

- **Project URL:** `https://kyrsdewrgqejoajhpfrn.supabase.co`
- **Project reference:** `kyrsdewrgqejoajhpfrn`
- **Browser key:** the publishable key supplied by the project owner

## Local setup

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

The frontend reads these variables in `src/lib/supabase.ts`:

```dotenv
VITE_SUPABASE_URL=https://kyrsdewrgqejoajhpfrn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
```

Do not commit `.env`. The publishable key may be used by the browser, but service-role keys, database passwords, AI keys, and job-provider keys must never be placed in frontend code or `.env` files.

## Supabase dashboard setup

1. Run `supabase/schema.sql` in the SQL Editor.
2. Enable Email authentication.
3. Add your local and production URLs under Authentication → URL Configuration.
4. Deploy the Edge Functions:

```bash
supabase login
supabase link --project-ref kyrsdewrgqejoajhpfrn
supabase functions deploy jobs
supabase functions deploy ai
```

5. Add privileged provider credentials only to Supabase Edge Function secrets:

```bash
supabase secrets set ADZUNA_APP_ID=... ADZUNA_APP_KEY=... JSEARCH_API_KEY=...
supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
```

6. Test Email Auth, RLS isolation, offline fallback, AI responses, provider failures, and logout before deployment.
