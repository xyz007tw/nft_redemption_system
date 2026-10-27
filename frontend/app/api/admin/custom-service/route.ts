import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { processAffiliateCommissions, getCommissionTierLabel } from '@/lib/affiliate';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export interface CustomServiceOrderRecord {
  id: string;
  clientWallet: string;
  clientEmail: string;
  referrerCode: string;
  referrerWallet: string;
  serviceTitle: string;
  contractNote: string;
  amountUSDT: number;
  createdAt: string;
  status: 'FINAL_PAYMENT_CONFIRMED';
}

const LOCAL_CUSTOM_ORDERS_PATH = path.join(process.cwd(), 'data', 'custom_service_orders.json');

function readLocalCustomOrders(): CustomServiceOrderRecord[] {
  try {
    if (fs.existsSync(LOCAL_CUSTOM_ORDERS_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_CUSTOM_ORDERS_PATH, 'utf8'));
    }
  } catch {
    // ignore
  }
  return [];
}

function writeLocalCustomOrders(records: CustomServiceOrderRecord[]) {
  try {
    const dir = path.dirname(LOCAL_CUSTOM_ORDERS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_CUSTOM_ORDERS_PATH, JSON.stringify(records, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Custom Service Orders] Local write skipped:', e);
  }
}

export async function GET() {
  try {
    const { data: dbUsers } = await supabase
      .from('users')
      .select('*')
      .order('total_sales', { ascending: false });

    const localRecords = readLocalCustomOrders();

    // 依客戶或推薦人彙整客製化服務業績
    const customSalesByWallet: Record<string, number> = {};
    for (const rec of localRecords) {
      if (rec.clientWallet) {
        const k = rec.clientWallet.toLowerCase();
        customSalesByWallet[k] = (customSalesByWallet[k] || 0) + Number(rec.amountUSDT || 0);
      }
      if (rec.referrerWallet && rec.referrerWallet.toLowerCase() !== rec.clientWallet?.toLowerCase()) {
        const rk = rec.referrerWallet.toLowerCase();
        customSalesByWallet[rk] = (customSalesByWallet[rk] || 0) + Number(rec.amountUSDT || 0);
      }
    }

    const users = (dbUsers || []).map((u: any) => {
      const wKey = String(u.wallet_address || '').toLowerCase();
      const customSales = Number(u.custom_service_sales || customSalesByWallet[wKey] || 0);
      const courseSales = Number(u.course_sales || 0);
      const total = Number(u.total_sales || 0);
      const crowdfundSales =
        u.crowdfund_sales !== undefined
          ? Number(u.crowdfund_sales)
          : Math.max(0, total - courseSales - customSales);
      const sponsorSales = Number(u.sponsor_sales || 0);
      const effectiveSales = Math.max(total, crowdfundSales + courseSales + customSales);

      return {
        wallet_address: u.wallet_address,
        wallet: u.wallet_address
          ? `${u.wallet_address.substring(0, 6)}...${u.wallet_address.substring(u.wallet_address.length - 4)}`
          : '-',
        email: u.email || '-',
        tier: getCommissionTierLabel(effectiveSales),
        directs: u.direct_count || 0,
        crowdfund_sales: crowdfundSales,
        course_sales: courseSales,
        custom_service_sales: customSales,
        sponsor_sales: sponsorSales,
        total_sales: effectiveSales
      };
    });

    return NextResponse.json({
      success: true,
      users,
      customServiceOrders: localRecords
    });
  } catch (err: any) {
    console.error('[Custom Service API GET Error]:', err);
    return NextResponse.json({
      success: true,
      users: [],
      customServiceOrders: readLocalCustomOrders()
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientIdentifier, // 客戶 Email 或 0x 錢包地址
      referrerCode,     // 選填：指定推薦人代碼或錢包（若留空，系統將依既有上線或自動綁定最高 10% 領袖）
      serviceTitle,     // 客製化專案名稱（如：AI 影片導購系統企業客製版）
      contractNote,     // 協議與尾款備註
      amountUSDT        // 已收齊尾款之總金額 (USDT)
    } = body;

    const cleanAmount = Number(amountUSDT || 0);
    if (!clientIdentifier || String(clientIdentifier).trim() === '') {
      return NextResponse.json({ success: false, error: '請輸入指定客戶的 Email 或 0x 錢包地址' }, { status: 400 });
    }
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      return NextResponse.json({ success: false, error: '請輸入有效的客製化服務結案金額 (USDT > 0)' }, { status: 400 });
    }

    const rawClient = String(clientIdentifier).trim();
    let clientWallet = '';
    let clientEmail = '';

    if (rawClient.startsWith('0x') && rawClient.length >= 10) {
      clientWallet = rawClient.toLowerCase();
      const { data: uByWallet } = await supabase
        .from('users')
        .select('email, wallet_address')
        .ilike('wallet_address', `${rawClient}%`)
        .maybeSingle();
      if (uByWallet?.wallet_address) clientWallet = uByWallet.wallet_address;
      if (uByWallet?.email) clientEmail = uByWallet.email;
    } else {
      clientEmail = rawClient.toLowerCase();
      const { data: uByEmail } = await supabase
        .from('users')
        .select('wallet_address, email')
        .eq('email', clientEmail)
        .maybeSingle();
      if (uByEmail?.wallet_address) {
        clientWallet = uByEmail.wallet_address;
      } else {
        const hash = crypto.createHash('sha256').update(clientEmail).digest('hex');
        clientWallet = '0x' + hash.substring(0, 40);
      }
    }

    // 執行 25% 聯盟推廣分潤與客戶自消費級差累積認定 (productType = 'CUSTOM_SERVICE')
    let settledReferrerWallet = '';
    try {
      const refResult = await processAffiliateCommissions(
        clientWallet,
        referrerCode ? String(referrerCode).trim() : null,
        cleanAmount,
        'CUSTOM_SERVICE'
      );
      settledReferrerWallet = refResult || '';

      if (clientEmail) {
        await supabase
          .from('users')
          .update({ email: clientEmail })
          .eq('wallet_address', clientWallet);
      }
    } catch (commErr) {
      console.warn('[Custom Service Commission Warning]:', commErr);
    }

    const newRecord: CustomServiceOrderRecord = {
      id: `CS-${Date.now()}`,
      clientWallet,
      clientEmail: clientEmail || '-',
      referrerCode: referrerCode ? String(referrerCode).trim() : '系統自動追溯 / 頂階 10% 領袖綁定',
      referrerWallet: settledReferrerWallet || '系統自動結算',
      serviceTitle: serviceTitle ? String(serviceTitle).trim() : 'AI 客製化系統建置與串接專案',
      contractNote: contractNote ? String(contractNote).trim() : '已完成協議簽訂、成品驗收並收齊尾款',
      amountUSDT: cleanAmount,
      createdAt: new Date().toISOString(),
      status: 'FINAL_PAYMENT_CONFIRMED'
    };

    const existingRecords = readLocalCustomOrders();
    const updatedRecords = [newRecord, ...existingRecords];
    writeLocalCustomOrders(updatedRecords);

    return NextResponse.json({
      success: true,
      record: newRecord,
      customServiceOrders: updatedRecords,
      message: `✅ 已成功將「${newRecord.serviceTitle} ($${cleanAmount.toLocaleString()} USDT)」指定予客戶 (${clientEmail || clientWallet}) 並計入推廣業績與 25% 分潤結算！`
    });
  } catch (error: any) {
    console.error('[Custom Service API POST Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || '客製化服務業績登錄失敗' },
      { status: 500 }
    );
  }
}
