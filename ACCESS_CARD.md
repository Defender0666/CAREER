# CareerOS Ultimate — Access Card

## Application

- **Name:** CareerOS Ultimate
- **Developer:** Saket Yadav
- **Company:** Maccy Creations
- **Repository:** https://github.com/Defender0666/CAREER
- **Latest implementation commit:** https://github.com/Defender0666/CAREER/commit/bd379488898a5613120f92dba2d4c9fe4e923809
- **Support:** CAREEROSULTIMATE@gmail.com

## Local access

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

## Production access

A public production URL and custom domain have not been supplied or configured yet, so no genuine live URL is claimed here. After deploying the `dist` folder to Vercel, Netlify, Cloudflare Pages, or another HTTPS host:

1. Add the custom domain in the hosting provider.
2. Add the DNS records supplied by that provider.
3. Enable HTTPS.
4. Configure SPA fallback to `index.html`.
5. Add the final URL to Supabase Authentication → URL Configuration.
6. Replace the placeholder below with the verified URL.

```text
Production URL: TO_BE_CONFIGURED
Custom domain: TO_BE_CONFIGURED
```

## Supabase access configuration

Create `.env` locally or add these values as hosting-provider environment variables:

```dotenv
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Run `supabase/schema.sql` in the Supabase SQL Editor. Keep service-role keys, AI keys, and job-provider keys out of the browser and configure them only as Supabase Edge Function secrets.

## Security notice

This card intentionally contains no passwords, service-role keys, AI provider keys, or fabricated live-job data. Create user accounts through the app's Profile & Settings tab. Live jobs and AI responses remain unavailable until genuine approved providers are configured.

## Included tabs

Home · Skills · Career paths · AI roadmap · AI & ATS resume · Live jobs · Application tracker · AI hub · Profile & settings
