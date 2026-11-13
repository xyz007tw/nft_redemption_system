import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pkgId = searchParams.get('pkg') || '101';
  const email = searchParams.get('email') || '';
  const bookId = searchParams.get('book') || '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nft1314.party';
  const encodedEmail = email ? encodeURIComponent(email) : '';
  const dashboardUrl = encodedEmail ? `${siteUrl}/dashboard?email=${encodedEmail}&pkg=${encodeURIComponent(pkgId)}` : `${siteUrl}/dashboard?pkg=${encodeURIComponent(pkgId)}`;
  const ebookStoreUrl = bookId
    ? `${siteUrl}/ebook-store?book=${encodeURIComponent(bookId)}${encodedEmail ? `&email=${encodedEmail}` : ''}`
    : `${siteUrl}/ebook-store${encodedEmail ? `?email=${encodedEmail}` : ''}`;

  const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PayPal 付款成功！｜WeiXiang AI 學院</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0a0a0f] text-white min-h-screen flex items-center justify-center p-4 font-sans">
  <div class="max-w-lg w-full bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.25)]">
    <div class="w-20 h-20 bg-emerald-500/20 border border-emerald-400/50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">
      🎉
    </div>
    <div class="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
      🅿️ PayPal 款項已確認收訖
    </div>
    <h1 class="text-2xl md:text-3xl font-black mb-3">恭喜您！教材與權限已成功開通</h1>
    <p class="text-sm text-gray-300 mb-6 leading-relaxed">
      感謝您的購買！系統已為信箱 <span class="text-emerald-400 font-bold font-mono">${email || '您的付款信箱'}</span> 開通專屬權限，免密登入連結與 4 語系下載通行證已同步發送至您的信箱（若未立即收到，亦可直接在下方進入下載與閱讀）。
    </p>

    <div class="space-y-3 mb-6">
      <a
        href="${dashboardUrl}"
        class="block w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-xl shadow-lg transition-all"
      >
        📥 前往會員中心立即下載已購課程與電子書 ➔
      </a>
      <a
        href="${ebookStoreUrl}"
        class="block w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all"
      >
        📖 前往 VIP 電子書店驗證開讀 / 匯出 PDF
      </a>
      <a
        href="https://vip.5208.uk/dashboard/"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full py-3.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold rounded-xl transition-all"
      >
        🎓 進入 VIP 創客實戰雲教室 (vip.5208.uk)
      </a>
      <a
        href="${siteUrl}/#tutor-courses"
        class="block w-full py-2.5 text-sm text-gray-400 hover:text-white transition-all"
      >
        ← 返回官網 AI頂配教材專區
      </a>
    </div>
  </div>
</body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
