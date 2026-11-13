import crypto from 'crypto';
import { decryptTradeInfo, generateTradeSha } from '@/lib/payuni';
import {
  hasPurchasedEBookInStore,
  loadEBookCloudStore,
  signEBookAccess
} from '@/lib/ebookAuth';

export const dynamic = 'force-dynamic';

function escapeHtml(input: string): string {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function handlePayUniReturn(req: Request) {
  const { searchParams } = new URL(req.url);
  let pkgId = searchParams.get('pkg') || '101';
  let productType = searchParams.get('type') || '';
  let email = (searchParams.get('email') || '').trim().toLowerCase();
  let bookId = (searchParams.get('book') || '').trim();
  let verifiedPaidByPost = false;

  if (req.method === 'POST') {
    try {
      const formData = await req.formData();
      const tradeInfo = String(formData.get('TradeInfo') || '');
      const tradeSha = String(formData.get('TradeSha') || '');
      if (tradeInfo && tradeSha) {
        const expectedSha = generateTradeSha(tradeInfo);
        const expBuf = Buffer.from(expectedSha || '', 'utf8');
        const recBuf = Buffer.from(tradeSha, 'utf8');
        if (expBuf.length > 0 && expBuf.length === recBuf.length && crypto.timingSafeEqual(expBuf, recBuf)) {
          const decrypted = decryptTradeInfo(tradeInfo);
          if (decrypted?.Status === '1') {
            verifiedPaidByPost = true;
            const decryptedEmail = String(decrypted.BuyerMail || decrypted.UsrMail || '').trim().toLowerCase();
            if (decryptedEmail) email = decryptedEmail;
            const rawCustom3 = String(decrypted.CustomField3 || '');
            const [cPkg, cType, , cBook] = rawCustom3.split('|');
            if (cPkg) pkgId = cPkg;
            if (cType) productType = cType;
            if (cBook) bookId = cBook;
          }
        }
      }
    } catch (err) {
      console.warn('[PayUni Return] Non-fatal POST form inspect warning:', err);
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nft1314.party';
  const isEbookOrder = productType === 'EBOOK_PURCHASE' || Number(pkgId) === 991 || Number(pkgId) === 992;
  const targetBook = bookId || 'ebook-demo-001';

  let signedReaderUrl = '';
  let signedPrintUrl = '';
  let storeUrl = `${siteUrl}/ebook-store?book=${encodeURIComponent(targetBook)}${email ? `&email=${encodeURIComponent(email)}` : ''}`;

  if (isEbookOrder && email) {
    let dbPurchased = false;
    if (!verifiedPaidByPost) {
      const store = await loadEBookCloudStore();
      dbPurchased = hasPurchasedEBookInStore(store, email, targetBook);
    }
    if (verifiedPaidByPost || dbPurchased) {
      const targetScope = Number(pkgId) === 992 ? 'ALL_VIP' : targetBook;
      const storeSig = signEBookAccess(email, targetScope);
      const bookSig = signEBookAccess(email, targetBook);
      if (bookSig) {
        signedReaderUrl = `${siteUrl}/api/ebook/reader?book=${encodeURIComponent(targetBook)}&email=${encodeURIComponent(email)}&sig=${encodeURIComponent(bookSig)}`;
        signedPrintUrl = `${signedReaderUrl}&print=1`;
      }
      if (storeSig) {
        storeUrl = `${siteUrl}/ebook-store?book=${encodeURIComponent(targetBook)}&email=${encodeURIComponent(email)}&sig=${encodeURIComponent(storeSig)}`;
      }
    }
  }

  const dashboardUrl = `${siteUrl}/dashboard?pkg=${encodeURIComponent(pkgId)}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
  const safeEmailText = escapeHtml(email || '您的付款信箱');

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PayUni 刷卡返回確認｜WeiXiang AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0a0a0f] text-white min-h-screen flex items-center justify-center p-4 font-sans">
  <div class="max-w-lg w-full bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
    <div class="w-20 h-20 bg-emerald-500/20 border border-emerald-400/50 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
      💳
    </div>
    <div class="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-400/30">
      PayUni 統一金流交易返回確認
    </div>
    <h1 class="text-2xl font-black mb-3">
      ${isEbookOrder ? '感謝購買 VIP 電子書！立即進入閱讀與下載' : '感謝購買！請前往會員中心領取教材與權限'}
    </h1>
    <p class="text-sm text-gray-300 mb-6 leading-relaxed">
      系統正在同步為付款信箱 <span class="text-emerald-400 font-bold font-mono">${safeEmailText}</span> 開通永久授權與寄送通知信。您可直接點擊下方按鈕立即領取：
    </p>

    <div class="space-y-3 mb-6">
      ${signedReaderUrl ? `
      <a href="${escapeHtml(signedReaderUrl)}" class="block w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-xl shadow-lg transition-all">
        📖 立即開啟防盜版獨立閱讀器（全文解鎖）
      </a>
      <a href="${escapeHtml(signedPrintUrl)}" class="block w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl shadow-lg transition-all">
        🖨️ 立即下載授權浮水印精裝 PDF
      </a>` : ''}
      <a href="${escapeHtml(isEbookOrder ? storeUrl : dashboardUrl)}" class="block w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl shadow-lg transition-all">
        ${isEbookOrder ? '📚 前往 VIP 電子書櫃檢視書籍與下載 PDF ➔' : '📥 前往會員中心立即下載已購教材 ➔'}
      </a>
      ${isEbookOrder ? `
      <a href="${escapeHtml(dashboardUrl)}" class="block w-full py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold rounded-xl transition-all">
        📊 查看會員數據與全部已解鎖下載
      </a>` : `
      <a href="https://vip.5208.uk/dashboard/" target="_blank" rel="noopener noreferrer" class="block w-full py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold rounded-xl transition-all">
        🎓 前往 AI 雲教室學習中心 (vip.5208.uk)
      </a>`}
    </div>

    <p class="text-xs text-gray-500">
      若銀行非同步入帳尚在 1~3 秒處理中，進入會員中心或書櫃點擊「驗證購買資格解鎖」即可同步開啟。
    </p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store, no-cache, must-revalidate'
    }
  });
}

export async function POST(req: Request) {
  return handlePayUniReturn(req);
}

export async function GET(req: Request) {
  return handlePayUniReturn(req);
}
