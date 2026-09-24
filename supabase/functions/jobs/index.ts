import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !anonKey) return json({ error: 'Supabase function configuration is incomplete' }, 500);

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Authentication required' }, 401);

  const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);

  const body = await request.json().catch(() => ({}));
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  if (!query) return json({ error: 'A job query is required' }, 400);

  // Provider calls belong here. Configure only approved APIs as Edge Function secrets.
  // This starter returns no listings until a provider is configured, preventing fabricated data.
  const configuredProviders = ['ADZUNA_APP_ID', 'ADZUNA_APP_KEY', 'JSEARCH_API_KEY'].filter((key) => Boolean(Deno.env.get(key)));
  return json({
    authenticatedUserId: user.id,
    query,
    location,
    providers: configuredProviders,
    jobs: [],
    message: configuredProviders.length
      ? 'Provider credentials detected. Implement the approved provider adapter before returning results.'
      : 'No approved job provider is configured; no listings are returned.'
  });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
