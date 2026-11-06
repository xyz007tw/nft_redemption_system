import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import {
  SUPERADMIN_WALLET,
  ADMIN_SECRET_KEY,
  createAdminSessionToken,
  verifyAdminSessionToken,
  isWalletAuthorizedAdmin
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/wx_admin_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1].trim()) : req.headers.get('x-admin-token');

    if (!token) {
      return NextResponse.json({ authenticated: false, error: 'No active admin session' }, { status: 401 });
    }

    const result = verifyAdminSessionToken(token);
    if (!result.valid || !result.wallet) {
      return NextResponse.json({ authenticated: false, error: result.error || 'Invalid session' }, { status: 401 });
    }

    const isAuth = await isWalletAuthorizedAdmin(result.wallet);
    if (!isAuth) {
      return NextResponse.json({ authenticated: false, error: 'Wallet not in admin whitelist' }, { status: 403 });
    }

    return NextResponse.json({
      authenticated: true,
      wallet: result.wallet,
      role: result.role,
      isSuperAdmin: result.wallet.toLowerCase() === SUPERADMIN_WALLET
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, signature, timestamp, adminKey } = body;

    // 途徑 1：透過管理員密鑰 (Admin Secret Key) 直接鑑權
    if (adminKey && adminKey === ADMIN_SECRET_KEY) {
      const token = createAdminSessionToken(SUPERADMIN_WALLET, 'superadmin');
      const res = NextResponse.json({
        success: true,
        token,
        wallet: SUPERADMIN_WALLET,
        role: 'superadmin',
        message: '✅ 管理員密鑰驗證成功！已建立專屬管理階段。'
      });
      // 設定 HttpOnly、SameSite Cookie (有效 7 天)
      res.cookies.set('wx_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });
      return res;
    }

    // 途徑 2：透過 Web3 錢包簽名鑑權 (無密碼密碼學驗證)
    if (walletAddress && signature && timestamp) {
      const tsNum = Number(timestamp);
      const now = Date.now();
      if (isNaN(tsNum) || Math.abs(now - tsNum) > 10 * 60 * 1000) {
        return NextResponse.json({ success: false, error: '簽署時間已過期，請重新嘗試 (Timestamp expired)' }, { status: 400 });
      }

      const expectedMessage = `Weixiang Admin Auth: ${walletAddress.toLowerCase()} at ${timestamp}`;
      const isValid = await verifyMessage({
        address: walletAddress as `0x${string}`,
        message: expectedMessage,
        signature: signature as `0x${string}`
      });

      if (!isValid) {
        return NextResponse.json({ success: false, error: '錢包簽章驗證失敗 (Invalid signature)' }, { status: 401 });
      }

      const isAuth = await isWalletAuthorizedAdmin(walletAddress);
      if (!isAuth) {
        return NextResponse.json({
          success: false,
          error: `錢包地址 (${walletAddress}) 不在系統管理員白名單內 (Access Denied)`
        }, { status: 403 });
      }

      const role = walletAddress.toLowerCase() === SUPERADMIN_WALLET ? 'superadmin' : 'admin';
      const token = createAdminSessionToken(walletAddress, role);
      const res = NextResponse.json({
        success: true,
        token,
        wallet: walletAddress.toLowerCase(),
        role,
        message: `✅ 管理員身分 (${role}) 密碼學簽署驗證成功！`
      });
      res.cookies.set('wx_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });
      return res;
    }

    return NextResponse.json({
      success: false,
      error: '請提供有效的錢包簽章或管理員密鑰 (Missing credentials)'
    }, { status: 400 });
  } catch (error: any) {
    console.error('[Admin Auth API Error]:', error);
    return NextResponse.json({ success: false, error: error.message || '驗證失敗' }, { status: 500 });
  }
}

// 登出清理 Session Cookie
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: '已安全登出管理員工作階段' });
  res.cookies.set('wx_admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
  return res;
}
