import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const AUTH_ENABLED = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const supabase = AUTH_ENABLED
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
