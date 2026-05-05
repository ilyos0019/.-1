-- Ustalar jadvali
CREATE TABLE IF NOT EXISTS public.ustalar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ism TEXT NOT NULL,
    kasb TEXT NOT NULL,
    telefon TEXT NOT NULL,
    shahar TEXT NOT NULL,
    bio TEXT,
    reyting FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Murojaatlar jadvali
CREATE TABLE IF NOT EXISTS public.murojaatlar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mijoz_ism TEXT NOT NULL,
    mijoz_tel TEXT NOT NULL,
    usta_id UUID REFERENCES public.ustalar(id) ON DELETE CASCADE NOT NULL,
    xabar TEXT,
    status TEXT DEFAULT 'yangi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) qoidalari
ALTER TABLE public.ustalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.murojaatlar ENABLE ROW LEVEL SECURITY;

-- Hammaga ustalarni o'qish imkoniyati (GET)
CREATE POLICY "Ustalar barchaga ochiq" 
ON public.ustalar 
FOR SELECT 
USING (true);

-- API orqali yangi usta qo'shish (Anon key bilan)
CREATE POLICY "Yangi usta qo'shish barchaga ochiq" 
ON public.ustalar 
FOR INSERT 
WITH CHECK (true);

-- API orqali murojaat yuborish (Anon key bilan)
CREATE POLICY "Murojaat yuborish barchaga ochiq" 
ON public.murojaatlar 
FOR INSERT 
WITH CHECK (true);

-- Murojaatlarni faqatgina admin/ustalar o'qishi mumkin (Hozircha hamma o'qishi mumkin qilib turamiz yoki faqat usta o'zi o'qiydi deb faraz qilamiz)
-- Loyiha API key bilan backendda service_role orqali barcha amallarni bajara oladi.
CREATE POLICY "Murojaatlarni hamma o'qishi"
ON public.murojaatlar
FOR SELECT
USING (true);
