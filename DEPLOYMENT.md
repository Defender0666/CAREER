# CareerOS Ultimate — production launch

## Architecture

```text
PWA / Android WebView
        |
        | Supabase publishable key + user JWT
        v
Supabase Auth ---- Postgres + RLS
        |                 |
        |                 +-- profiles, user_skills, applications,
        |                     roadmaps, resumes, ai_runs
        v
Supabase Edge Functions
        |
        +-- jobs: approved Adzuna/JSearch/provider adapters
        +-- ai: server-side OpenAI/Gemini adapters
        |
        v
External providers
        +-- verified job APIs
        +-- AI providers
```

The browser and APK may contain only the Supabase URL and publishable key. Service-role, AI, and job-provider secrets belong only in Edge Function secrets.

## Capacitor APK

Install prerequisites: Node.js 18+, JDK 17+, Android Studio, Android SDK and an Android signing keystore.

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

`capacitor.config.ts` sets the package ID to `com.maccycreations.careerosultimate`. In Android Studio, verify the package, app label, icons, splash screen, version code, version name and release signing configuration. Use **Build → Generate Signed Bundle / APK** for a release artifact.

If the Android platform has already been created, use:

```bash
npm run build
npx cap sync android
npx cap open android
```

Do not use a remote development server in the release build. The app must load the local `dist` bundle and communicate with Supabase over HTTPS.

## PWA icons

Create real branded PNG files at:

- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

Do not ship placeholder or missing icons. Test installability in Chrome DevTools → Application → Manifest and Lighthouse.

## Custom-domain checklist

1. Select a production host such as Vercel, Netlify, Cloudflare Pages or a static HTTPS host.
2. Add the custom domain in that host’s dashboard.
3. Add the exact DNS records supplied by the host at your DNS provider.
4. Wait for DNS verification and confirm automatic TLS/HTTPS is active.
5. Configure the host’s SPA fallback so every application route serves `index.html`.
6. Add the final HTTPS URL to Supabase Authentication → URL Configuration:
   - Site URL: `https://your-domain.example`
   - Redirect URL: `https://your-domain.example/**`
7. Add the same production URL to any OAuth provider configuration if OAuth is enabled.
8. Configure environment variables in the hosting provider; never commit `.env`.
9. Confirm the service worker, manifest, icons and HTTPS installability.
10. Add a real privacy policy, terms, contact page, account deletion flow and support address before public launch.
11. Test deep links, sign-in redirects, offline shell, online sync, Edge Functions and Android navigation on the final domain.

## Release verification

```bash
npm run build
npm run preview
```

Verify:

- no TypeScript or Vite build errors
- no secrets in the generated `dist` bundle
- Supabase Auth works with the production redirect URL
- RLS blocks cross-user reads and writes
- jobs return only provider responses or an explicit empty state
- AI output clearly identifies provider and citations/grounding state
- application changes persist offline and sync when online
- APK is signed and uses HTTPS
