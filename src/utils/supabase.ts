import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export const getProfile = async (name: string, password: string) => {
  const fakeEmail = `${name}@app.local`
  const { data: { user } } = await supabase.auth.signInWithPassword({ email: fakeEmail, password });
  return user;
}
