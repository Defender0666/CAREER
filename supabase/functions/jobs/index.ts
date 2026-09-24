import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type Job = { title: string; company: string; location: string; url: string; source: string; description: string; postedAt?: string };

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const authHeader = request.headers.get('Authorization');
  if (!supabaseUrl || !anonKey) return json({ error: 'Supabase function configuration is incomplete' }, 500);
  if (!authHeader) return json({ error: 'Authentication required' }, 401);

  const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);

  const body = await request.json().catch(() => ({}));
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  if (!query) return json({ error: 'A job query is required' }, 400);

  const requests: Promise<Job[]>[] = [];
  if (Deno.env.get('ADZUNA_APP_ID') && Deno.env.get('ADZUNA_APP_KEY')) requests.push(searchAdzuna(query, location));
  if (Deno.env.get('JSEARCH_API_KEY')) requests.push(searchJSearch(query, location));
  if (!requests.length) return json({ authenticatedUserId: user.id, query, location, providers: [], jobs: [], message: 'No approved job provider is configured; no listings are returned.' });

  const results = await Promise.allSettled(requests);
  const jobs = dedupe(results.flatMap((result) => result.status === 'fulfilled' ? result.value : []));
  const failed = results.filter((result) => result.status === 'rejected').length;
  return json({ authenticatedUserId: user.id, query, location, providers: configuredProviders(), jobs, message: jobs.length ? `${jobs.length} verified listing(s) returned from configured providers.` : failed ? 'Configured providers returned no usable listings.' : 'No verified results returned.' });
});

async function searchAdzuna(query: string, location: string): Promise<Job[]> {
  const country = Deno.env.get('ADZUNA_COUNTRY') || 'in';
  const params = new URLSearchParams({ app_id: Deno.env.get('ADZUNA_APP_ID')!, app_key: Deno.env.get('ADZUNA_APP_KEY')!, results_per_page: '20', what: query, where: location, 'content-type': 'application/json' });
  const response = await fetch(`https://api.adzuna.com/v1/api/jobs/${encodeURIComponent(country)}/search/1?${params}`);
  if (!response.ok) throw new Error(`Adzuna returned ${response.status}`);
  const data = await response.json();
  return (Array.isArray(data.results) ? data.results : []).map((item: any) => normalize({ title: item.title, company: item.company?.display_name, location: item.location?.display_name || location, url: item.redirect_url, description: item.description, postedAt: item.created }, 'Adzuna')).filter(Boolean) as Job[];
}

async function searchJSearch(query: string, location: string): Promise<Job[]> {
  const params = new URLSearchParams({ query: location ? `${query} in ${location}` : query, page: '1', num_pages: '1' });
  const response = await fetch(`https://jsearch.p.rapidapi.com/search?${params}`, { headers: { 'X-RapidAPI-Key': Deno.env.get('JSEARCH_API_KEY')!, 'X-RapidAPI-Host': Deno.env.get('JSEARCH_API_HOST') || 'jsearch.p.rapidapi.com' } });
  if (!response.ok) throw new Error(`JSearch returned ${response.status}`);
  const data = await response.json();
  return (Array.isArray(data.data) ? data.data : []).map((item: any) => normalize({ title: item.job_title, company: item.employer_name, location: item.job_location || item.job_city || location, url: item.job_apply_link || item.job_google_link, description: item.job_description, postedAt: item.job_posted_at_datetime }, 'JSearch')).filter(Boolean) as Job[];
}

function normalize(item: any, source: string): Job | null {
  if (!item.title || !item.company || !item.url || !isHttpUrl(item.url)) return null;
  return { title: String(item.title).trim(), company: String(item.company).trim(), location: String(item.location || 'Not specified').trim(), url: item.url, source, description: String(item.description || '').slice(0, 1000), postedAt: item.postedAt };
}
function isHttpUrl(value: string) { try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:'; } catch { return false; } }
function dedupe(jobs: Job[]) { return [...new Map(jobs.map((job) => [`${job.title.toLowerCase()}|${job.company.toLowerCase()}|${job.url}`, job])).values()].slice(0, 50); }
function configuredProviders() { return [Deno.env.get('ADZUNA_APP_ID') && Deno.env.get('ADZUNA_APP_KEY') ? 'Adzuna' : '', Deno.env.get('JSEARCH_API_KEY') ? 'JSearch' : ''].filter(Boolean); }
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
