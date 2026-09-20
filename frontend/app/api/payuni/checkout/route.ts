import { NextResponse } from 'next/server';
import { PAYUNI_MERCHANT_ID, encryptTradeInfo, generateTradeSha } from '@/lib/payuni';

export async function POST(req: Request) {
  try {
    const { packageId, priceInUSDT, walletAddress, email, refCode } = await req.json();

    if (!PAYUNI_MERCHANT_ID) {
      return NextResponse.json({ error: 'PayUni is not configured' }, { status: 500 });
    }

    // Convert USDT to TWD (Fixed rate for now: 1 USDT = 32 TWD)
    const amountTWD = priceInUSDT * 32;
    const orderNo = `ORD${Date.now()}`;

    // Payload for PayUni
    const tradeData = {
      MerID: PAYUNI_MERCHANT_ID,
      MerTradeNo: orderNo,
      TradeAmt: amountTWD.toString(),
      ProdDesc: `WeiXiang AI Package ${packageId}`,
      TradeType: '1', // 1: 整合支付頁 (Credit Card / ATM / CVS)
      ReturnURL: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nft-redemption-system.onrender.com'}/dashboard`, 
      NotifyURL: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nft-redemption-system.onrender.com'}/api/payuni/callback`,
      UsrMail: email,
      // Pass our custom Web3 data in a custom field so we can process it in the callback
      CustomField1: walletAddress,
      CustomField2: refCode || '',
      CustomField3: packageId.toString(),
    };

    const TradeInfo = encryptTradeInfo(tradeData);
    const TradeSha = generateTradeSha(TradeInfo);

    return NextResponse.json({
      success: true,
      MerID: PAYUNI_MERCHANT_ID,
      TradeInfo,
      TradeSha,
      Version: '1.0'
    });
  } catch (error: any) {
    console.error('PayUni Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
