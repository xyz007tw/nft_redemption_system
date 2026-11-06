/**
 * 前端管理員 API 請求輔助函式
 * 自動附帶 Session Token 或 Admin Key 標頭
 */
export function getAdminHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const headers: Record<string, string> = {};

  const token = sessionStorage.getItem('wx_admin_token') || localStorage.getItem('wx_admin_token');
  if (token) {
    headers['x-admin-token'] = token;
  }

  const key = sessionStorage.getItem('wx_admin_key') || localStorage.getItem('wx_admin_key');
  if (key) {
    headers['x-admin-key'] = key;
  }

  return headers;
}

export function saveAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('wx_admin_token', token);
    localStorage.setItem('wx_admin_token', token);
  } catch {}
}

export function saveAdminKey(key: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('wx_admin_key', key);
    localStorage.setItem('wx_admin_key', key);
  } catch {}
}

export function clearAdminAuth() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem('wx_admin_token');
    localStorage.removeItem('wx_admin_token');
    sessionStorage.removeItem('wx_admin_key');
    localStorage.removeItem('wx_admin_key');
  } catch {}
}
