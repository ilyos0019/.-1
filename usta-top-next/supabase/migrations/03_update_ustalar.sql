-- `telegram` ustunini qo'shish
ALTER TABLE public.ustalar
  ADD COLUMN IF NOT EXISTS telegram TEXT;

-- `rasm_url` ustunini qo'shish
ALTER TABLE public.ustalar
  ADD COLUMN IF NOT EXISTS rasm_url TEXT;

-- `tasdiqlangan` ustunini qo'shish (standart holda tasdiqlanmagan = false)
ALTER TABLE public.ustalar
  ADD COLUMN IF NOT EXISTS tasdiqlangan BOOLEAN DEFAULT false;

-- `obuna_tugash` ustunini qo'shish (1 yillik muddat nazorati uchun)
ALTER TABLE public.ustalar
  ADD COLUMN IF NOT EXISTS obuna_tugash TIMESTAMP WITH TIME ZONE;

-- Agar tasdiqlangan va obunasi yo'q bo'lgan eskilar bo'lsa, ularni 1 yillik qilib qo'yish
UPDATE public.ustalar
  SET obuna_tugash = created_at + INTERVAL '1 year'
  WHERE obuna_tugash IS NULL AND tasdiqlangan = true;
