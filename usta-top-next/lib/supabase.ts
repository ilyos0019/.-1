import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Mijoz tomoni va umumiy API so'rovlar uchun anon client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin / Service Role client (faqatgina backend API route'larda ishlatish uchun)
// Buning uchun SUPABASE_SERVICE_ROLE_KEY kerak bo'ladi
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);
