import { SupabaseClient } from '@supabase/supabase-js';

// 定義不同等級的極差趴數 (可依據您的業務制度自由修改)
const TIERS = [
  { threshold: 0, rate: 0.03 },      // 3% (初階業務)
  { threshold: 600, rate: 0.06 },    // 6% (中階主任)
  { threshold: 6000, rate: 0.10 }    // 10% (高階總監)
];

export async function calculateAndDistributeCommissions(
  supabase: SupabaseClient,
  orderId: string,
  buyerWallet: string,
  usdAmount: number
) {
  console.log(`開始結算訂單 ${orderId} 的 25% 獎金池...`);

  // ==========================================
  // 1. 提撥 5% 進入全球均分池 (Global Pool)
  // ==========================================
  const globalPoolAmount = usdAmount * 0.05;
  await supabase.from('nft_commissions').insert({
    affiliate_wallet: 'GLOBAL_POOL_TREASURY',
    order_id: orderId,
    commission_type: 'GlobalPool',
    amount_usd: globalPoolAmount
  });

  // 取得買家的直推上線
  const { data: buyer } = await supabase.from('nft_users').select('referred_by').eq('wallet_address', buyerWallet).single();
  
  if (!buyer || !buyer.referred_by) {
    console.log("此訂單無推薦人，剩餘極差與匹配獎金歸入公司公積金。");
    return;
  }

  // ==========================================
  // 2. 遞迴向上追溯 10% 極差獎金 (Differential)
  // ==========================================
  let currentReferrerCode = buyer.referred_by;
  let remainingDifferential = 0.10; // 總極差池上限 10%
  let previousRate = 0;
  
  let currentGeneration = 1;
  let firstUplineWallet = null;
  let firstUplineEarned = 0;

  // 限制追溯深度最大 10 代，避免資料庫無窮迴圈
  while (currentReferrerCode && remainingDifferential > 0 && currentGeneration <= 10) {
    const { data: upline } = await supabase.from('nft_users').select('wallet_address, total_personal_sales, referred_by').eq('referral_code', currentReferrerCode).single();
    
    if (!upline) break;

    // 計算該上線目前的級別與應得趴數
    const uplineRate = TIERS.slice().reverse().find(t => upline.total_personal_sales >= t.threshold)?.rate || 0.03;

    // 只有當上線的趴數「大於」下線的趴數，才能賺取中間的極差利潤
    if (uplineRate > previousRate) {
      const differentialToPay = Math.min(uplineRate - previousRate, remainingDifferential);
      const earnedAmount = usdAmount * differentialToPay;

      if (earnedAmount > 0) {
        // 發放極差獎金寫入帳本
        await supabase.from('nft_commissions').insert({
          affiliate_wallet: upline.wallet_address,
          order_id: orderId,
          commission_type: 'Differential',
          amount_usd: earnedAmount
        });

        remainingDifferential -= differentialToPay;
        
        // 紀錄直屬第一代賺了多少錢，用來發放 100% 匹配獎給第二代
        if (currentGeneration === 1) {
          firstUplineWallet = upline.wallet_address;
          firstUplineEarned = earnedAmount;
        }
      }
      previousRate = uplineRate;
    }

    currentReferrerCode = upline.referred_by;
    currentGeneration++;
  }

  // ==========================================
  // 3. 發放 100% 輔導匹配獎 (Match Bonus)
  // ==========================================
  // 規則：上線 (第二代) 可以 100% 複製下線 (第一代) 賺到的極差獎金，上限為整筆訂單的 10%
  if (firstUplineWallet && firstUplineEarned > 0) {
    const { data: firstUpline } = await supabase.from('nft_users').select('referred_by').eq('wallet_address', firstUplineWallet).single();
    
    if (firstUpline && firstUpline.referred_by) {
      const { data: secondUpline } = await supabase.from('nft_users').select('wallet_address').eq('referral_code', firstUpline.referred_by).single();
      
      if (secondUpline) {
        const matchCap = usdAmount * 0.10; // 最高 10% 封頂
        const matchAmount = Math.min(firstUplineEarned, matchCap);

        await supabase.from('nft_commissions').insert({
          affiliate_wallet: secondUpline.wallet_address,
          order_id: orderId,
          commission_type: 'Match',
          amount_usd: matchAmount
        });
      }
    }
  }

  console.log("💎 25% 獎金池已精準結算並分配至各業務錢包！");
}
