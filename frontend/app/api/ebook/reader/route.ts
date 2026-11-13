import { NextResponse } from 'next/server';
import { generateStandaloneEBookHTML, type EBookExportLangMode } from '@/lib/ebookEngine';
import { verifyAdminRequest } from '@/lib/adminAuth';
import {
  hasPurchasedEBookInStore,
  loadEBookCloudStore,
  verifyEBookAccess
} from '@/lib/ebookAuth';

export const dynamic = 'force-dynamic';

function normalizeExportMode(raw: string): EBookExportLangMode {
  const m = (raw || '').toUpperCase().trim();
  if (m === 'ZH_ONLY' || m === 'ZH_TW' || m === 'ZH_CN' || m === 'ZH') return 'ZH_ONLY';
  if (m === 'EN_ONLY' || m === 'EN') return 'EN_ONLY';
  if (m === 'JA_ONLY' || m === 'JA') return 'JA_ONLY';
  return 'BILINGUAL';
}

function renderPaywallHtml(title: string, bookId: string, reason: string) {
  const safeBookId = encodeURIComponent(bookId || 'ebook-demo-001');
  const safeTitle = title.replace(/[<>&"]/g, '');
  const safeReason = reason.replace(/[<>&"]/g, '');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🔒 付費解鎖後方可閱讀｜${safeTitle}</title>
</head>
<body style="margin:0;background:#090d16;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;">
  <div style="max-width:560px;width:100%;background:#111827;border:1px solid #374151;border-radius:20px;padding:36px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.45);">
    <div style="font-size:48px;margin-bottom:12px;">🔒</div>
    <h1 style="margin:0 0 12px;font-size:24px;color:#fbbf24;">本電子書完整版需付費解鎖</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#d1d5db;line-height:1.6;">
      書名：<strong>${safeTitle}</strong><br/>${safeReason}
    </p>
    <p style="margin:0 0 24px;font-size:13px;color:#9ca3af;line-height:1.6;">
      若您剛透過 PayUni 信用卡 / PayPal / USDT 完成購買，請在書店頁面輸入購買信箱進行一鍵驗證，或點擊付款通知信中的專屬簽章連結直接開啟。
    </p>
    <a href="/ebook-store?book=${safeBookId}" style="display:inline-block;background:linear-gradient(90deg,#f59e0b,#ea580c);color:#0f172a;font-weight:800;font-size:15px;padding:14px 28px;border-radius:12px;text-decoration:none;">
      🛒 前往書店購買 / 驗證已購 Email 解鎖 ➔
    </a>
  </div>
</body>
</html>`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = (searchParams.get('bookId') || searchParams.get('book') || 'ebook-demo-001').trim();
  const cleanEmail = (searchParams.get('email') || '').toLowerCase().trim();
  const sig = (searchParams.get('sig') || '').trim();
  const exportMode: EBookExportLangMode = normalizeExportMode(searchParams.get('mode') || 'BILINGUAL');
  const autoPrint = searchParams.get('print') === '1' || searchParams.get('print') === 'true';

  const store = await loadEBookCloudStore();
  if (!store || !Array.isArray(store.books)) {
    return NextResponse.json({ error: 'E-Book catalog unavailable' }, { status: 503 });
  }

  const book = store.books.find((b) => b.id === bookId);
  if (!book) {
    return new NextResponse(renderPaywallHtml('查無此電子書', bookId, '找不到指定書號，請返回書店重新選購。'), {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store, no-cache, must-revalidate'
      }
    });
  }

  const adminCheck = await verifyAdminRequest(req);
  const isAdmin = adminCheck.authorized;
  const hasValidSig =
    Boolean(cleanEmail && sig) &&
    (verifyEBookAccess(cleanEmail, book.id, sig) || verifyEBookAccess(cleanEmail, 'ALL_VIP', sig));
  const hasDbPurchase = Boolean(cleanEmail) && hasPurchasedEBookInStore(store, cleanEmail, book.id);

  if (!isAdmin && book.status !== 'APPROVED_PUBLISHED') {
    return new NextResponse(renderPaywallHtml(book.title_zh || book.id, book.id, '本書尚在審核或未公開上架。'), {
      status: 403,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store, no-cache, must-revalidate'
      }
    });
  }

  if (!isAdmin && !hasValidSig && !hasDbPurchase) {
    return new NextResponse(
      renderPaywallHtml(
        book.title_zh || book.title_en || book.id,
        book.id,
        '未偵測到有效購書憑證或專屬簽章連結（HTTP 403 Forbidden）。'
      ),
      {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'private, no-store, no-cache, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      }
    );
  }

  const watermarkEmail = cleanEmail || (isAdmin ? 'SUPER_ADMIN_AUDIT' : 'VIP_READER');
  let html = generateStandaloneEBookHTML(book, watermarkEmail, exportMode);

  if (autoPrint) {
    html = html.replace(
      '</body>',
      '<script>window.addEventListener("load",function(){setTimeout(function(){window.print();},350);});</script></body>'
    );
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}
