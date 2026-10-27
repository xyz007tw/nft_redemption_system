import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

const TIERS = [
  { threshold: 15000, rate: 0.10 }, // > $15,000 ➔ 10% 推廣級差
  { threshold: 6000, rate: 0.06 },  // > $6,000 ~ $15,000 ➔ 6% 推廣級差
  { threshold: 600, rate: 0.03 },   // > $600 ~ $6,000 ➔ 3% 推廣級差
  { threshold: 0, rate: 0.0 }       // <= $600 ➔ 0%
];

// 官方預設頂階領袖節點（當自然流量訪客無推薦碼、或資料庫暫無達標 10% 領袖時，自動作為最高 10% 級差與 10% 對等綁定節點）
const OFFICIAL_TOP_LEADER_WALLET =
  process.env.OFFICIAL_TOP_LEADER_WALLET || '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc';

/**
 * 依據個人累積業績認定級差分潤等級：
 * - > $600 ~ $6,000 ➔ 3% 推廣級差
 * - > $6,000 ~ $15,000 ➔ 6% 推廣級差
 * - > $15,000 ➔ 10% 推廣級差
 */
export function getCommissionRate(totalSales: number) {
  if (totalSales > 15000) return 0.10;
  if (totalSales > 6000) return 0.06;
  if (totalSales >= 600) return 0.03;
  return 0;
}

export function getCommissionTierLabel(totalSales: number): '10%' | '6%' | '3%' | '0%' {
  if (totalSales > 15000) return '10%';
  if (totalSales > 6000) return '6%';
  if (totalSales >= 600) return '3%';
  return '0%';
}

/**
 * 尋找系統中最高階 (10%，業績 >= 15,000) 的推廣領袖作為「非推廣者（自然流量）訪客」的自動綁定上線
 * 確保每一筆訂單 100% 觸發並完整撥出 25% 推廣服務費（10% 級差獎金 + 10% 對等獎金 + 5% 永久均分全球分紅）
 */
async function resolveTopTierLeaderForOrganicVisitor(excludeWallet: string): Promise<string> {
  try {
    const { data: topLeaders } = await supabase
      .from('users')
      .select('wallet_address, total_sales, referrer_address')
      .gt('total_sales', 15000)
      .neq('wallet_address', excludeWallet)
      .order('total_sales', { ascending: false })
      .limit(1);

    if (topLeaders && topLeaders.length > 0 && topLeaders[0].wallet_address) {
      return topLeaders[0].wallet_address;
    }

    // 若目前資料庫尚無 >= 15000 的用戶，取全系統業績最高者或官方預設頂階領袖節點，並確保官方頂階節點存在於資料庫
    const { data: highestUser } = await supabase
      .from('users')
      .select('wallet_address, total_sales')
      .neq('wallet_address', excludeWallet)
      .order('total_sales', { ascending: false })
      .limit(1);

    if (highestUser && highestUser.length > 0 && highestUser[0].wallet_address) {
      return highestUser[0].wallet_address;
    }
  } catch (e) {
    console.warn('[Affiliate] resolveTopTierLeaderForOrganicVisitor fallback:', e);
  }

  // 確保官方預設頂階領袖節點存在且具備 > $15,000 頂階 10% 資格
  try {
    await supabase.from('users').upsert(
      {
        wallet_address: OFFICIAL_TOP_LEADER_WALLET,
        status: 'ACTIVE',
        has_purchased: true,
        total_sales: 15001,
        referrer_address: OFFICIAL_TOP_LEADER_WALLET
      },
      { onConflict: 'wallet_address' }
    );
  } catch {
    // ignore
  }

  return OFFICIAL_TOP_LEADER_WALLET;
}

export async function processAffiliateCommissions(
  walletAddress: string,
  refCode: string | null,
  packagePriceUSDT: number,
  productType?: string
) {
  let matchedReferrer: string | null = null;
  if (refCode && refCode.trim() !== '') {
    const cleanRef = refCode.trim().replace(/^0x/i, '');
    const { data: potentialReferrer } = await supabase
      .from('users')
      .select('wallet_address')
      .ilike('wallet_address', `0x${cleanRef}%`)
      .neq('wallet_address', walletAddress)
      .limit(1)
      .maybeSingle();

    if (potentialReferrer?.wallet_address) {
      matchedReferrer = potentialReferrer.wallet_address;
    }
  }

  const { data: existingUser } = await supabase
    .from('users')
    .select('referrer_address, total_sales')
    .eq('wallet_address', walletAddress)
    .maybeSingle();

  let finalReferrer = existingUser?.referrer_address || matchedReferrer;

  // 🔥 核心鐵律：若為「非推廣者的訪客（無 refCode 且尚未綁定上線）」下訂單，
  // 系統自動去綁定推廣最高的 10% 級差獎金領袖，確保 10% 級差、10% 對等獎金及永久 5% 全球分紅全額啟動！
  const isAutoBoundOrganic = !finalReferrer;
  if (!finalReferrer) {
    finalReferrer = await resolveTopTierLeaderForOrganicVisitor(walletAddress);
  }

  // 🔥 自消費併入「級差分潤資格認定累積業績」規則：
  // 所有微享 NFT 數位產品、斗內贊助 (SPONSOR)、眾籌、电子書加盟 ($990/$330)、AI頂配教材與客製化服務等「自消費」金額，
  // 一律累加至買家本人的 total_sales 內，作為認定 3% ($600~$6,000) / 6% ($6,000~$15,000) / 10% (>=$15,000) 級差等級的資格依據！
  // （例如：斗內 $3 + 成為電子書加盟商 $990 = 自消費 $993，累積業績落在 $600~$6,000，自動晉升 3% 推廣級差等級！）
  // ⚠️ 注意：自消費僅計入「級差資格認定業績」，絕對不會發放 25% 推廣佣金給買家自己（只有真正推廣他人時才依該等級領取佣金）。
  const updatedBuyerTotalSales = Number((Number(existingUser?.total_sales || 0) + Number(packagePriceUSDT || 0)).toFixed(2));

  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert(
      {
        wallet_address: walletAddress,
        status: 'ACTIVE',
        has_purchased: true,
        total_sales: updatedBuyerTotalSales,
        referrer_address: finalReferrer
      },
      { onConflict: 'wallet_address' }
    )
    .select()
    .single();

  if (userError) throw userError;

  // 1. 如果是斗內贊助 (SPONSOR) 或買家純自消費資格升級項目，已完成買家本人業績累積與上線綁定；斗內不發放 25% 推廣佣金
  if (productType === 'SPONSOR') {
    return user.referrer_address;
  }

  const referrerAddress = user.referrer_address || finalReferrer;
  if (!referrerAddress) return null;

  let currentReferrer: string | null = referrerAddress;
  let distributedRate = 0;
  const visitedWallets = new Set<string>();

  // 2. 無限代級差獎金 (最頂 10%) & 對等獎金 (100% 匹配被推薦人的級差獎金)
  while (currentReferrer && distributedRate < TIERS[0].rate && !visitedWallets.has(currentReferrer)) {
    visitedWallets.add(currentReferrer);

    const { data: refUser } = await supabase
      .from('users')
      .select('referrer_address, total_sales')
      .eq('wallet_address', currentReferrer)
      .maybeSingle();

    if (!refUser) break;

    // 若為系統自動綁定之非推廣者訪客訂單，或該上線已是最高階領袖，確保最高 10% 級差完整釋放
    const rawRate = getCommissionRate(Number(refUser.total_sales || 0));
    const myRate = isAutoBoundOrganic && distributedRate === 0 ? TIERS[0].rate : rawRate;
    const diffRate = Number((myRate - distributedRate).toFixed(4));

    if (diffRate > 0) {
      const commissionAmount = Number((packagePriceUSDT * diffRate).toFixed(2));
      const commissionType = distributedRate === 0 ? 'DIRECT' : 'DIFFERENTIAL';

      // (A) 發放級差 / 直推獎金 (最高 10%)
      await supabase.from('commissions').insert({
        wallet_address: currentReferrer,
        from_buyer: walletAddress,
        amount: commissionAmount,
        commission_type: commissionType
      });

      // (B) 發放 100% 對等獎金 (MATCHING，最高 10%：被推薦人領多少級差，其推薦人或頂階領袖就領多少)
      const matchingRecipient =
        refUser.referrer_address && refUser.referrer_address !== ''
          ? refUser.referrer_address
          : currentReferrer;

      await supabase.from('commissions').insert({
        wallet_address: matchingRecipient,
        from_buyer: walletAddress,
        amount: commissionAmount,
        commission_type: 'MATCHING'
      });

      if (commissionType === 'DIRECT') {
        await supabase
          .from('users')
          .update({ total_sales: Number(refUser.total_sales || 0) + packagePriceUSDT })
          .eq('wallet_address', currentReferrer);
      }

      distributedRate = myRate;
    }

    currentReferrer = refUser.referrer_address;
  }

  // 若向上追溯完畢後，級差獎金尚未發滿 10%（例如組織鏈路頂端尚未達 10%），剩餘差額自動歸屬最高 10% 頂階領袖並同步發放對應 100% 對等獎金
  if (distributedRate < TIERS[0].rate) {
    const remainingRate = Number((TIERS[0].rate - distributedRate).toFixed(4));
    const topLeaderWallet = await resolveTopTierLeaderForOrganicVisitor(walletAddress);
    const remainingCommission = Number((packagePriceUSDT * remainingRate).toFixed(2));

    if (remainingCommission > 0) {
      await supabase.from('commissions').insert({
        wallet_address: topLeaderWallet,
        from_buyer: walletAddress,
        amount: remainingCommission,
        commission_type: distributedRate === 0 ? 'DIRECT' : 'DIFFERENTIAL'
      });

      await supabase.from('commissions').insert({
        wallet_address: topLeaderWallet,
        from_buyer: walletAddress,
        amount: remainingCommission,
        commission_type: 'MATCHING'
      });
    }
  }

  // 3. 永久 5% 全球領袖均分 (GLOBAL_POOL) - 均分給所有達成 10% 級差條件 (業績 > $15,000) 的領袖
  let { data: globalLeaders } = await supabase
    .from('users')
    .select('wallet_address')
    .gt('total_sales', 15000);

  if (!globalLeaders || globalLeaders.length === 0) {
    const fallbackLeader = await resolveTopTierLeaderForOrganicVisitor(walletAddress);
    globalLeaders = [{ wallet_address: fallbackLeader }];
  }

  if (globalLeaders && globalLeaders.length > 0) {
    const globalPoolAmount = Number((packagePriceUSDT * 0.05).toFixed(2)); // 永久 5% 全球分紅
    const splitAmount = Number((globalPoolAmount / globalLeaders.length).toFixed(2));

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
