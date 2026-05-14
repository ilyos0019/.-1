-- `is_pro` ustunini qo'shish (PRO versiya uchun)
ALTER TABLE public.ustalar
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false;

-- Schema keshini yangilash haqida eslatma:
-- Supabase SQL editor-da quyidagini ishlating:
-- NOTIFY pgrst, 'reload schema';
