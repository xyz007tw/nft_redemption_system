CREATE TABLE IF NOT EXISTS public.packages (
  id integer PRIMARY KEY,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  amount integer NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  discount_text text,
  roi_text text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 插入預設的 5 個微享 AI 算力方案
INSERT INTO public.packages (id, name_zh, name_en, amount, price, discount_text, roi_text, is_active) 
VALUES
(1, '體驗創始包', 'Starter Pack', 1, 99, '原價', '-', true),
(2, '輕量增長包', 'Growth Pack', 3, 198, '66 折', '+50%', true),
(3, '超級矩陣包', 'Matrix Pack', 30, 1788, '60 折', '+66%', true),
(4, '超級節點包', 'Super Node Pack', 108, 5400, '50 折', '+98%', true),
(5, '創世財團包', 'Genesis Syndicate Pack', 360, 12000, '33 折(極致底價)', '+197%', true)
ON CONFLICT (id) DO NOTHING;

-- 開啟 RLS (Row Level Security) 允許公開讀取
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Packages are viewable by everyone" ON public.packages;
CREATE POLICY "Packages are viewable by everyone" ON public.packages FOR SELECT USING (true);
