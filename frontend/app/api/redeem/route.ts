import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key' // Use service role for backend logic
);

const NFT_PRICE = 990; // USDT

// 極差獎金門檻設定 (未來可改為從系統設定讀取)
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

export async function POST(request: Request) {
  try {
    const { walletAddress, refCode } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    // 尋找推薦人完整的錢包地址
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

    // 1. 確認並更新買家的帳號狀態為 ACTIVE
    // 只有當新會員第一次建立時，才會寫入 referrer_address
    const { data: existingUser } = await supabase.from('users').select('referrer_address').eq('wallet_address', walletAddress).single();
    
    const finalReferrer = existingUser?.referrer_address || matchedReferrer;

    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({ 
        wallet_address: walletAddress, 
        status: 'ACTIVE',
        ...(existingUser ? {} : { referrer_address: finalReferrer })
      }, { onConflict: 'wallet_address' })
      .select()
      .single();

    if (userError) throw userError;

    const referrerAddress = user.referrer_address;

    // 如果沒有推薦人，就不發放獎金 (或者可以設計歸屬給總部)
    if (!referrerAddress) {
      return NextResponse.json({ success: true, message: 'Activated without referrer' });
    }

    // 2. 處理獎金與極差計算
    let currentReferrer = referrerAddress;
    let distributedRate = 0; // 已經發放出去的 % 數，用來計算極差

    while (currentReferrer && distributedRate < TIERS[0].rate) {
      // 取得上線的資料
      const { data: refUser } = await supabase
        .from('users')
        .select('referrer_address, total_sales')
        .eq('wallet_address', currentReferrer)
        .single();

      if (!refUser) break;

      const myRate = getCommissionRate(refUser.total_sales);
      const diffRate = myRate - distributedRate;

      // 如果有極差利潤可以拿
      if (diffRate > 0) {
        const commissionAmount = NFT_PRICE * diffRate;
        const commissionType = distributedRate === 0 ? 'DIRECT' : 'DIFFERENTIAL';

        // 寫入獎金明細
        await supabase.from('commissions').insert({
          wallet_address: currentReferrer,
          from_buyer: walletAddress,
          amount: commissionAmount,
          commission_type: commissionType
        });

        // 將業績加給最原始的直推人 (如果是極差上線，通常不累加業績，只抽 % 數)
        if (commissionType === 'DIRECT') {
          await supabase
            .from('users')
            .update({ total_sales: refUser.total_sales + NFT_PRICE })
            .eq('wallet_address', currentReferrer);
        }

        distributedRate = myRate; // 更新已發放的最高 % 數
      }

      // 繼續往上找推薦人
      currentReferrer = refUser.referrer_address;
    }

    return NextResponse.json({ success: true, message: 'Commission calculated and account activated' });

  } catch (error: any) {
    console.error('Commission Calculation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
