import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;
export const supabase = url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
export const isSupabaseConfigured = Boolean(supabase);
export async function signInWithPassword(email: string, password: string) { if (!supabase) throw new Error('Supabase is not configured.'); return supabase.auth.signInWithPassword({ email, password }); }
export async function signUpWithPassword(email: string, password: string) { if (!supabase) throw new Error('Supabase is not configured.'); return supabase.auth.signUp({ email, password }); }
export async function signOut() { return supabase ? supabase.auth.signOut() : { error: null }; }
