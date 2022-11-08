import { createClient } from '@supabase/supabase-js';
// HACK change this to v2
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY_ANON ?? ''
);

export default client;
