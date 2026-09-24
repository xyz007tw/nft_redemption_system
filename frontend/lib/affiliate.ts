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

export async function processAffiliateCommissions(walletAddress: string, refCode: string | null, packagePriceUSDT: number) {
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

  const referrerAddress = user.referrer_address;
  if (!referrerAddress) return null;

  let currentReferrer = referrerAddress;
  let distributedRate = 0; 

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

      await supabase.from('commissions').insert({
        wallet_address: currentReferrer,
        from_buyer: walletAddress,
        amount: commissionAmount,
        commission_type: commissionType
      });

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

  return referrerAddress;
}
