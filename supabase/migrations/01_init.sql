-- ============================================
-- USTA TOP - Supabase Migration
-- ============================================

-- 1. USTALAR JADVALI
CREATE TABLE IF NOT EXISTS public.ustalar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ism TEXT NOT NULL,
    kasb TEXT NOT NULL,
    telefon TEXT NOT NULL,
    shahar TEXT,
    bio TEXT,
    rasm_url TEXT,
    reyting FLOAT DEFAULT 0,
    tasdiqlangan BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- 2. MUROJAATLAR JADVALI
CREATE TABLE IF NOT EXISTS public.murojaatlar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mijoz_ism TEXT NOT NULL,
    mijoz_tel TEXT NOT NULL,
    usta_id UUID REFERENCES public.ustalar(id) ON DELETE SET NULL,
    xabar TEXT,
    status TEXT DEFAULT 'yangi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE public.ustalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.murojaatlar ENABLE ROW LEVEL SECURITY;

-- USTALAR uchun RLS:
-- Hamma SELECT qila oladi (faqat tasdiqlangan ustalarni frontend da filter qilamiz)
CREATE POLICY "ustalar_select_all"
ON public.ustalar FOR SELECT
USING (true);

-- Faqat service_role INSERT, UPDATE, DELETE qila oladi
CREATE POLICY "ustalar_insert_service"
ON public.ustalar FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "ustalar_update_service"
ON public.ustalar FOR UPDATE
USING (auth.role() = 'service_role');

CREATE POLICY "ustalar_delete_service"
ON public.ustalar FOR DELETE
USING (auth.role() = 'service_role');

-- MUROJAATLAR uchun RLS:
-- Hamma INSERT qila oladi (mijozlar murojaat yuborsin)
CREATE POLICY "murojaatlar_insert_all"
ON public.murojaatlar FOR INSERT
WITH CHECK (true);

-- Faqat service_role SELECT qila oladi (adminlar o'qiydi)
CREATE POLICY "murojaatlar_select_service"
ON public.murojaatlar FOR SELECT
USING (auth.role() = 'service_role');
