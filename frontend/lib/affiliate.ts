import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

const TIERS = [
  { threshold: 15000, rate: 0.10 }, // 10%
  { threshold: 6000, rate: 0.06 },  // 6%
  { threshold: 600, rate: 0.03 },   // 3%
  { threshold: 0, rate: 0.0 }       // 0%
];

function getCommissionRate(totalSales: number) {
  for (const tier of TIERS) {
    if (totalSales >= tier.threshold) return tier.rate;
  }
  return 0;
}

export async function processAffiliateCommissions(walletAddress: string, refCode: string | null, packagePriceUSDT: number, productType?: string) {
  let matchedReferrer = null;
  if (refCode) {
    const { data: potentialReferrer } = await supabase
      .from('users')
      .select('wallet_address')
      .ilike('wallet_address', `0x${refCode}%`)
      .single();
      
    if (potentialReferrer) {
      matchedReferrer = potentialReferrer.wallet_address;
    }
  }

  const { data: existingUser } = await supabase.from('users').select('referrer_address').eq('wallet_address', walletAddress).single();
  const finalReferrer = existingUser?.referrer_address || matchedReferrer;

  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert({ 
      wallet_address: walletAddress, 
      status: 'ACTIVE',
      has_purchased: true,
      ...(existingUser ? {} : { referrer_address: finalReferrer })
    }, { onConflict: 'wallet_address' })
    .select()
    .single();

  if (userError) throw userError;

  // 1. 如果是斗內贊助 (SPONSOR)，不啟動任何推廣分潤，但仍完成綁定
  if (productType === 'SPONSOR') {
    return user.referrer_address;
  }

  const referrerAddress = user.referrer_address;
  if (!referrerAddress) return null;

  let currentReferrer = referrerAddress;
  let distributedRate = 0; 

  // 2. 無限代級差獎金 (最頂 10%) & 對等獎金 (100% 匹配被推薦人的級差獎金)
  while (currentReferrer && distributedRate < TIERS[0].rate) {
    const { data: refUser } = await supabase
      .from('users')
      .select('referrer_address, total_sales')
      .eq('wallet_address', currentReferrer)
      .single();

    if (!refUser) break;

    const myRate = getCommissionRate(refUser.total_sales);
    const diffRate = myRate - distributedRate;

    if (diffRate > 0) {
      const commissionAmount = packagePriceUSDT * diffRate;
      const commissionType = distributedRate === 0 ? 'DIRECT' : 'DIFFERENTIAL';

      // 發放級差 / 直推獎金
      await supabase.from('commissions').insert({
        wallet_address: currentReferrer,
        from_buyer: walletAddress,
        amount: commissionAmount,
        commission_type: commissionType
      });

      // 發放對等獎金 (被推薦人領多少，推薦人就領多少)
      if (refUser.referrer_address) {
        await supabase.from('commissions').insert({
          wallet_address: refUser.referrer_address,
          from_buyer: walletAddress,
          amount: commissionAmount,
          commission_type: 'MATCHING'
        });
      }

      if (commissionType === 'DIRECT') {
        await supabase
          .from('users')
          .update({ total_sales: refUser.total_sales + packagePriceUSDT })
          .eq('wallet_address', currentReferrer);
      }

      distributedRate = myRate;
    }

    currentReferrer = refUser.referrer_address;
  }

  // 3. 全球領袖獎 (5%) - 均分給所有達成 10% 級差條件 (業績 >= 15000) 的領袖
  const { data: globalLeaders } = await supabase
    .from('users')
    .select('wallet_address')
    .gte('total_sales', 15000);

  if (globalLeaders && globalLeaders.length > 0) {
    const globalPoolAmount = packagePriceUSDT * 0.05; // 5%
    const splitAmount = globalPoolAmount / globalLeaders.length;
    
    for (const leader of globalLeaders) {
      await supabase.from('commissions').insert({
        wallet_address: leader.wallet_address,
        from_buyer: walletAddress,
        amount: splitAmount,
        commission_type: 'GLOBAL_POOL'
      });
    }
  }

  return referrerAddress;
}
