import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) return json({ error: 'Supabase function configuration is incomplete' }, 500);
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Authentication required' }, 401);

  const supabase = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);

  const body = await request.json().catch(() => ({}));
  const feature = typeof body.feature === 'string' ? body.feature : 'career-assistant';
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) return json({ error: 'Prompt is required' }, 400);

  // Add provider adapters here using Edge Function secrets such as OPENAI_API_KEY or GEMINI_API_KEY.
  // Do not return generated claims without citations or verified source URLs.
  const result = {
    feature,
    provider: 'not-configured',
    answer: 'AI provider is not configured. Add a server-side provider and citation validation before generating content.',
    citations: [],
    grounded: false
  };

  const { error: insertError } = await supabase.from('ai_runs').insert({
    user_id: user.id,
    feature,
    provider: result.provider,
    response: result,
    citations: [],
    status: 'completed'
  });
  if (insertError) return json({ error: 'Could not record AI run', details: insertError.message }, 500);

  return json(result);
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
