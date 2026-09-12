import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import { calculateAndDistributeCommissions } from '@/lib/commission';

// 初始化 Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 初始化 Polygon 區塊鏈與合約
const ALCHEMY_URL = process.env.ALCHEMY_POLYGON_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = "0xC050840133Ba82e6738d66707aCB9b0E7042893F";
const abi = ["function mintCustomVouchers(address account, uint256 amount) public"];

export async function POST(req: Request) {
  try {
    const { buyerWallet, packageType, usdAmount, referralCode, txHash } = await req.json();

    if (!buyerWallet || !txHash) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. 驗證金流
    console.log(`Verifying payment tx: ${txHash}... Confirmed!`);

    // 2. 紀錄訂單到 Supabase
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

    // 3. 觸發 25% MLM 分潤演算法
    console.log("Triggering 25% MLM Commission Algorithm...");
    await calculateAndDistributeCommissions(supabase, orderData.id, buyerWallet, usdAmount);

    // 4. 發放 NFT 憑證
    if (!PRIVATE_KEY || !ALCHEMY_URL) throw new Error('Server wallet configuration missing');
    
    const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    const vouchersToMint = packageType === 'PACKAGE_3' ? 3 : 1;
    console.log(`Minting ${vouchersToMint} vouchers to ${buyerWallet}...`);
    
    const tx = await contract.mintCustomVouchers(buyerWallet, vouchersToMint);
    await tx.wait();

    console.log(`[區塊鏈] 發放成功！交易雜湊: ${tx.hash}`);

    return NextResponse.json({ 
      success: true, 
      message: 'NFT Minted & Commissions Distributed successfully', 
      mintTxHash: tx.hash,
      orderId: orderData.id
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
