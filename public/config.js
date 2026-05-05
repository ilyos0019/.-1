// ============================================
// USTA TOP - Supabase Konfiguratsiya
// ============================================
// Bu faylga o'z Supabase loyihangizdan URL va KEY larni kiriting.
// Supabase dashboard -> Settings -> API dan topasiz.

window.SUPABASE_URL = 'https://mxwecncecbwscwdpkloy.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_UWnrjO-pgYyQXA4c0Cb7wA_1rdJgvRE';
window.SUPABASE_SERVICE_KEY = 'sb_secret_1RNnhV0or5L3aK02oek1YA_ORq2kgFE';

// Asosiy (ommaviy) client — bosh sahifa uchun
window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

// Admin client — brauzerda service_role ishlatib bo'lmagani uchun anon key ishlatamiz
// Bazada RLS siyosatlarini (SQL) anon uchun ochib qo'yishingiz kerak
window.supabaseAdmin = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
