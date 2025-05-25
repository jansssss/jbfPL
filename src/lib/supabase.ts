import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  name: string;
  level: number;
  first_login: boolean;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  members: string;
  strategy: string;
  goal: string;
  level: string;
  notes: string;
  status: string;
  applicant_id: string;
  created_at: string;
};