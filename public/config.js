// ============================================
// USTA TOP - Supabase Konfiguratsiya
// ============================================
// Bu faylga o'z Supabase loyihangizdan URL va KEY larni kiriting.
// Supabase dashboard -> Settings -> API dan topasiz.

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
const SUPABASE_SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE';

// Asosiy (ommaviy) client — bosh sahifa uchun
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client — service_role key bilan (admin.html ichida ishlatiladi)
// Bu key hech qachon ommaviy saytda ochiq qolmasin!
const supabaseAdmin = window.supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
