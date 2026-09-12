-- =========================================================================
-- AI 自來客系統 (NFT Redemption System) - Supabase 資料庫建置腳本
-- 包含：會員上下線關係、訂單紀錄、25% 業務分潤帳本、服務核銷紀錄
-- =========================================================================

-- 1. NFT 用戶表 (包含推廣與上下線關係)
CREATE TABLE IF NOT EXISTS nft_users (
    wallet_address TEXT PRIMARY KEY,
    role TEXT DEFAULT 'Customer', -- 身分：'Customer' (一般客) 或是 'Affiliate' (推廣業務)
    referral_code TEXT UNIQUE NOT NULL, -- 該用戶專屬的 6 碼推薦碼
    referred_by TEXT REFERENCES nft_users(referral_code), -- 綁定上線的推薦碼 (永久鎖定)
    total_personal_sales NUMERIC DEFAULT 0, -- 個人直推總業績 (美金)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. NFT 訂單表 (記錄客戶購買套餐)
CREATE TABLE IF NOT EXISTS nft_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_wallet TEXT REFERENCES nft_users(wallet_address),
    package_name TEXT NOT NULL, -- 方案名稱 (例如 '3-Voucher Package')
    usd_amount NUMERIC NOT NULL, -- 實際結帳金額 (美金)
    payment_method TEXT NOT NULL, -- 金流方式 ('Web3_Polygon', 'BinancePay', 'MoonPay')
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 業務分潤帳本 (記錄極差、匹配與全球均分獎金)
CREATE TABLE IF NOT EXISTS nft_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_wallet TEXT REFERENCES nft_users(wallet_address), -- 領取獎金的業務
    order_id UUID REFERENCES nft_orders(id), -- 這筆獎金來自哪筆訂單
    commission_type TEXT NOT NULL, -- 獎金種類：'Differential' (極差), 'Match' (匹配), 'GlobalPool' (全球均分)
    amount_usd NUMERIC NOT NULL, -- 獎金金額 (美金)
    status TEXT DEFAULT 'Pending', -- 發放狀態：'Pending' (未結算), 'Paid' (月底已批次轉帳至錢包)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 服務核銷紀錄表 (與原有的影音/SEO腳本無縫對接)
CREATE TABLE IF NOT EXISTS nft_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT REFERENCES nft_users(wallet_address),
    service_chosen TEXT NOT NULL, -- 開通的服務 ('Plan_A_Article', 'Plan_B_Video', 'Plan_C_Dual')
    tx_hash TEXT, -- 區塊鏈上成功銷毀 NFT (Burn) 的交易憑證 (Transaction Hash)
    status TEXT DEFAULT 'Active', -- 'Active' (執行中), 'Expired' (已到期)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立索引加速查詢 (因應組織樹狀圖會頻繁往上查詢)
CREATE INDEX idx_users_referred_by ON nft_users(referred_by);
CREATE INDEX idx_commissions_affiliate ON nft_commissions(affiliate_wallet);
