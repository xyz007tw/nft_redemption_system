import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: '請輸入有效的電子郵件地址' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(cleanEmail).digest('hex');
    const derivedAddress = '0x' + hash.substring(0, 40);

    // 檢查資料庫是否已存在此信箱或此衍生地址
    const { data: userByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    const { data: userByAddress } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', derivedAddress)
      .maybeSingle();

    const existingUser = userByEmail || userByAddress;

    if (!existingUser) {
      // 若尚未建立，自動建立此使用者的基礎帳號，讓小白也能立刻取得推廣碼
      await supabase.from('users').upsert({
        wallet_address: derivedAddress,
        email: cleanEmail,
        status: 'ACTIVE',
        has_purchased: false,
        total_sales: 0
      }, { onConflict: 'wallet_address' });
    }

    return NextResponse.json({
      success: true,
      userAddress: existingUser?.wallet_address || derivedAddress,
      email: cleanEmail
    });
  } catch (error: any) {
    console.error('Email Login Error:', error);
    return NextResponse.json({ success: false, error: error.message || '登入處理失敗' }, { status: 500 });
  }
}
