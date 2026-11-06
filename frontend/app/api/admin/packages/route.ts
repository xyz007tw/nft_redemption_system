import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { packPackageMeta, unpackPackageRow } from '@/lib/packageMeta';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    // 🛡️ 排除內部免遷移雲端 JSON Store 系統保留行 (id >= 900000 或 __SYSTEM_)
    const userFacing = (data || []).filter((p: any) => {
      if (typeof p.id === 'number' && p.id >= 900000) return false;
      if (typeof p.name_zh === 'string' && p.name_zh.startsWith('__')) return false;
      if (typeof p.discount_text === 'string' && p.discount_text.includes('SYSTEM_')) return false;
      return true;
    });
    const unpacked = userFacing.map(unpackPackageRow);
    return NextResponse.json({ success: true, packages: unpacked });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 🛡️ 後台管理 API 權限查核
    const { verifyAdminRequest } = await import('@/lib/adminAuth');
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.reason || 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      name_zh,
      name_en,
      amount,
      price,
      discount_text,
      roi_text,
      is_active,
      product_type,
      course_link,
      promo_html_zh,
      promo_html_en
    } = body;

    if (!id || !name_zh || !price) {
      return NextResponse.json({ success: false, error: 'Missing required fields (id, name_zh, price)' }, { status: 400 });
    }

    const packedRoi = packPackageMeta(roi_text, {
      roi_display: roi_text || '',
      product_type: product_type || 'NFT_REDEEM',
      course_link: course_link || null,
      promo_html_zh: promo_html_zh || null,
      promo_html_en: promo_html_en || null
    });

    // Try saving with extended columns first
    let { data, error } = await supabase
      .from('packages')
      .upsert({
        id: Number(id),
        name_zh,
        name_en: name_en || name_zh,
        amount: Number(amount || 1),
        price: Number(price),
        discount_text: discount_text || '',
        roi_text: packedRoi,
        is_active: is_active ?? true,
        product_type: product_type || 'NFT_REDEEM',
        course_link: course_link || null
      }, { onConflict: 'id' })
      .select()
      .single();

    // Automatic fallback to base schema if extended columns aren't migrated in Supabase
    if (error) {
      const fallback = await supabase
        .from('packages')
        .upsert({
          id: Number(id),
          name_zh,
          name_en: name_en || name_zh,
          amount: Number(amount || 1),
          price: Number(price),
          discount_text: discount_text || '',
          roi_text: packedRoi,
          is_active: is_active ?? true
        }, { onConflict: 'id' })
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw error;

    return NextResponse.json({ success: true, package: unpackPackageRow(data) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
