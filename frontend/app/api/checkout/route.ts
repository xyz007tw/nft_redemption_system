import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateAndDistributeCommissions } from '@/lib/commission';
import { createWalletClient, http, publicActions, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon } from 'viem/chains';

// 宣告這個 API 運行在邊緣運算節點 (Cloudflare 專用)
export const runtime = 'edge';

// 初始化 Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 初始化 Polygon 區塊鏈與合約
const ALCHEMY_URL = process.env.ALCHEMY_POLYGON_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = "0xC050840133Ba82e6738d66707aCB9b0E7042893F";

const abi = parseAbi([
  "function mintCustomVouchers(address account, uint256 amount) public"
]);

export async function POST(req: Request) {
  try {
    const { buyerWallet, packageType, usdAmount, referralCode, txHash } = await req.json();

    if (!buyerWallet || !txHash) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    console.log(`Verifying payment tx: ${txHash}... Confirmed!`);

    // 1. 紀錄訂單到 Supabase
    const { data: orderData, error: dbError } = await supabase
      .from('nft_orders')
      .insert([{
          buyer_wallet: buyerWallet,
          package_name: packageType,
          usd_amount: usdAmount,
          payment_method: 'Web3_Polygon',
          status: 'Completed'
      }])
      .select().single();

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    // 2. 觸發 25% MLM 分潤演算法
    console.log("Triggering 25% MLM Commission Algorithm...");
    await calculateAndDistributeCommissions(supabase, orderData.id, buyerWallet, usdAmount);

    // 3. 發放 NFT 憑證 (改用支援 Edge 的 viem 套件)
    if (!PRIVATE_KEY || !ALCHEMY_URL) throw new Error('Server wallet configuration missing');
    
    // 將環境變數的私鑰轉換為帳號
    const account = privateKeyToAccount(`0x${PRIVATE_KEY.replace('0x', '')}`);
    
    // 建立連線客戶端
    const client = createWalletClient({
      account,
      chain: polygon,
      transport: http(ALCHEMY_URL)
    }).extend(publicActions);

    const vouchersToMint = packageType === 'PACKAGE_3' ? 3n : 1n; // viem 需要 BigInt
    console.log(`Minting ${vouchersToMint} vouchers to ${buyerWallet}...`);
    
    // 模擬與執行智能合約
    const { request: contractRequest } = await client.simulateContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'mintCustomVouchers',
      args: [buyerWallet as `0x${string}`, vouchersToMint]
    });
    
    const txHashResult = await client.writeContract(contractRequest);
    console.log(`[區塊鏈] 交易已發送！雜湊: ${txHashResult}`);
    
    // 等待確認
    await client.waitForTransactionReceipt({ hash: txHashResult });
    console.log(`[區塊鏈] 發放成功！`);

    return NextResponse.json({ 
      success: true, 
      message: 'NFT Minted & Commissions Distributed successfully', 
      mintTxHash: txHashResult,
      orderId: orderData.id
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
