// ============================================
// USTA TOP - Supabase Konfiguratsiya
// ============================================
// Bu faylga o'z Supabase loyihangizdan URL va KEY larni kiriting.
// Supabase dashboard -> Settings -> API dan topasiz.

const SUPABASE_URL = 'https://mxwwncwrbswwdfjkbsy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UWnrjO-pgYyQXA4c0Cb7wA_1rdJgvRE';
const SUPABASE_SERVICE_KEY = 'sb_secret_1RNnhV0or5L3aK02oek1YA_ORq2kgFE';

// Asosiy (ommaviy) client — bosh sahifa uchun
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client — service_role key bilan (admin.html ichida ishlatiladi)
// Bu key hech qachon ommaviy saytda ochiq qolmasin!
const supabaseAdmin = window.supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
