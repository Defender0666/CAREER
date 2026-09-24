import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };

type AIResult = { feature: string; provider: string; answer: string; citations: string[]; grounded: boolean };

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const authHeader = request.headers.get('Authorization');
  if (!url || !anonKey) return json({ error: 'Supabase function configuration is incomplete' }, 500);
  if (!authHeader) return json({ error: 'Authentication required' }, 401);

  const supabase = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);
  const body = await request.json().catch(() => ({}));
  const feature = typeof body.feature === 'string' ? body.feature : 'career-assistant';
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 12000) : '';
  if (!prompt) return json({ error: 'Prompt is required' }, 400);

  let result: AIResult;
  try {
    if (Deno.env.get('OPENAI_API_KEY')) result = await openAI(feature, prompt);
    else if (Deno.env.get('GEMINI_API_KEY')) result = await gemini(feature, prompt);
    else result = { feature, provider: 'not-configured', answer: 'No approved AI provider is configured. No answer was generated.', citations: [], grounded: false };
  } catch (error) {
    result = { feature, provider: 'provider-error', answer: `The configured AI provider could not be reached. No answer was generated. (${error instanceof Error ? error.message : 'unknown error'})`, citations: [], grounded: false };
  }

  const { error: insertError } = await supabase.from('ai_runs').insert({ user_id: user.id, feature, provider: result.provider, response: result, citations: result.citations, status: 'completed' });
  if (insertError) return json({ error: 'Could not record AI run', details: insertError.message }, 500);
  return json(result);
});

async function openAI(feature: string, prompt: string): Promise<AIResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini', temperature: 0.2, messages: [{ role: 'system', content: 'You are a career planning assistant. Do not invent current jobs, salaries, company facts, certifications, or citations. Clearly label suggestions as guidance and ask the user to verify time-sensitive claims with official sources.' }, { role: 'user', content: prompt }] }) });
  if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
  const data = await response.json();
  return { feature, provider: 'OpenAI', answer: data.choices?.[0]?.message?.content || 'No answer returned.', citations: [], grounded: false };
}

async function gemini(feature: string, prompt: string): Promise<AIResult> {
  const model = Deno.env.get('GEMINI_MODEL') || 'gemini-2.0-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: 'You are a career planning assistant. Do not invent current jobs, salaries, company facts, certifications, or citations. Clearly label suggestions as guidance and ask the user to verify time-sensitive claims with official sources.' }] }, contents: [{ parts: [{ text: prompt }] }] }) });
  if (!response.ok) throw new Error(`Gemini returned ${response.status}`);
  const data = await response.json();
  return { feature, provider: 'Google Gemini', answer: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer returned.', citations: [], grounded: false };
}
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
