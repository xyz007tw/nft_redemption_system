import crypto from 'crypto';
import { verifyMessage } from 'viem';
import { createClient } from '@supabase/supabase-js';

export const SUPERADMIN_WALLET = '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc'.toLowerCase();
export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'wx_chief_architect_2026_godmode';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
);

/**
 * 簽署管理員工作階段 Session Token (HMAC-SHA256)
 * 預設有效期間 7 天
 */
export function createAdminSessionToken(wallet: string, role = 'admin', expiresInMs = 7 * 24 * 60 * 60 * 1000): string {
  const payload = {
    wallet: wallet.toLowerCase().trim(),
    role,
    exp: Date.now() + expiresInMs
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET_KEY).update(data).digest('base64url');
  return `${data}.${hmac}`;
}

/**
 * 驗證管理員工作階段 Session Token
 */
export function verifyAdminSessionToken(token: string): { valid: boolean; wallet?: string; role?: string; error?: string } {
  if (!token || !token.includes('.')) {
    return { valid: false, error: 'Token 格式錯誤 (Missing delimiter)' };
  }
  const [data, signature] = token.split('.');
  const expectedHmac = crypto.createHmac('sha256', ADMIN_SECRET_KEY).update(data).digest('base64url');
  if (expectedHmac !== signature) {
    return { valid: false, error: 'Token 簽章無效 (Signature mismatch)' };
  }
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > Number(payload.exp || 0)) {
      return { valid: false, error: 'Token 已過期 (Expired)' };
    }
    return { valid: true, wallet: payload.wallet, role: payload.role };
  } catch {
    return { valid: false, error: 'Token 資料解析失敗 (Corrupted payload)' };
  }
}

/**
 * 查核錢包地址是否名列管理員白名單
 * (包含 Deployer 最高管理者 0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc 與 admin_users 資料表)
 */
export async function isWalletAuthorizedAdmin(wallet: string): Promise<boolean> {
  const clean = wallet.toLowerCase().trim();
  if (!clean.startsWith('0x')) return false;
  if (clean === SUPERADMIN_WALLET) return true;

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('wallet_address', clean)
      .maybeSingle();

    return !error && !!data;
  } catch (err) {
    console.warn('[AdminAuth] Supabase admin_users check error:', err);
    return false;
  }
}

/**
 * 全方位後端 API 鑑權守門員 (Unified API Guard)
 * 依序查驗：
 * 1. 管理員專屬密鑰 (x-admin-key / Bearer Token)
 * 2. 簽章 Session Token (x-admin-token 或 Cookie: wx_admin_token)
 * 3. 即時 Web3 錢包訊息簽章 (x-admin-wallet + x-admin-signature + x-admin-timestamp)
 */
export async function verifyAdminRequest(req: Request): Promise<{
  authorized: boolean;
  reason?: string;
  wallet?: string;
  role?: string;
}> {
  // 1. 查驗直接密鑰 (Master Secret Key / Service Role Key)
  const authHeader = req.headers.get('authorization') || '';
  const adminKey = req.headers.get('x-admin-key') || (authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '');
  if (adminKey) {
    if (adminKey === ADMIN_SECRET_KEY || (SUPABASE_SERVICE_ROLE_KEY && adminKey === SUPABASE_SERVICE_ROLE_KEY)) {
      return { authorized: true, role: 'superadmin', wallet: SUPERADMIN_WALLET };
    }
  }

  // 2. 查驗 Session Token (Header 或 Cookie)
  const tokenHeader = req.headers.get('x-admin-token');
  let cookieToken = '';
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/wx_admin_token=([^;]+)/);
  if (match) {
    cookieToken = decodeURIComponent(match[1].trim());
  }

  const sessionToken = tokenHeader || cookieToken;
  if (sessionToken) {
    const tokenResult = verifyAdminSessionToken(sessionToken);
    if (tokenResult.valid && tokenResult.wallet) {
      const isAuth = await isWalletAuthorizedAdmin(tokenResult.wallet);
      if (isAuth) {
        return { authorized: true, wallet: tokenResult.wallet, role: tokenResult.role || 'admin' };
      }
    }
  }

  // 3. 查驗 Web3 錢包即時簽署 (Timestamp 容錯 10 分鐘，防範重放攻擊)
  const headerWallet = req.headers.get('x-admin-wallet');
  const headerSig = req.headers.get('x-admin-signature');
  const headerTs = req.headers.get('x-admin-timestamp');

  if (headerWallet && headerSig && headerTs) {
    const tsNum = Number(headerTs);
    const now = Date.now();
    if (!isNaN(tsNum) && Math.abs(now - tsNum) < 10 * 60 * 1000) {
      try {
        const expectedMessage = `Weixiang Admin Auth: ${headerWallet.toLowerCase()} at ${headerTs}`;
        const isValid = await verifyMessage({
          address: headerWallet as `0x${string}`,
          message: expectedMessage,
          signature: headerSig as `0x${string}`
        });

        if (isValid) {
          const isAuth = await isWalletAuthorizedAdmin(headerWallet);
          if (isAuth) {
            return {
              authorized: true,
              wallet: headerWallet.toLowerCase(),
              role: headerWallet.toLowerCase() === SUPERADMIN_WALLET ? 'superadmin' : 'admin'
            };
          }
        }
      } catch (err) {
        console.warn('[AdminAuth] Web3 signature verification failed:', err);
      }
    }
  }

  return {
    authorized: false,
    reason: '⛔ 存取被拒：後台管理 API 鑑權失敗，請確認已登入管理員錢包或提供有效憑證 (401 Unauthorized)'
  };
}
