import { createClient } from '@supabase/supabase-js';
import env from './env.js';

//Créer la connection a supabase
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export default supabase;
