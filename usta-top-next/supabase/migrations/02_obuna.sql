-- Obuna muddati ustuni qo'shish
ALTER TABLE public.ustalar
  ADD COLUMN IF NOT EXISTS obuna_tugash TIMESTAMP WITH TIME ZONE;

-- Mavjud ustalarni 1 yillik obunaga o'rnatish (created_at + 1 yil)
UPDATE public.ustalar
  SET obuna_tugash = created_at + INTERVAL '1 year'
  WHERE obuna_tugash IS NULL;
