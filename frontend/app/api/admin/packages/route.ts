import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, packages: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name_zh, name_en, amount, price, discount_text, roi_text, is_active } = body;

    if (!id || !name_zh || !price) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('packages')
      .upsert({
        id: Number(id),
        name_zh,
        name_en,
        amount: Number(amount),
        price: Number(price),
        discount_text: discount_text || '',
        roi_text: roi_text || '',
        is_active: is_active ?? true
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, package: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
