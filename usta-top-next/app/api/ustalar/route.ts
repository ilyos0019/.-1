import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kasb = searchParams.get('kasb');
    const shahar = searchParams.get('shahar');

    let query = supabaseAdmin.from('ustalar').select('*').order('created_at', { ascending: false });

    if (kasb && kasb !== 'Barchasi') {
      query = query.eq('kasb', kasb);
    }
    
    if (shahar && shahar !== 'Barchasi') {
      query = query.eq('shahar', shahar);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ism, kasb, telefon, shahar, bio } = body;

    // Oddiy validation
    if (!ism || !kasb || !telefon || !shahar) {
      return NextResponse.json({ error: "Barcha majburiy maydonlarni to'ldiring" }, { status: 400 });
    }

    // Telefon raqam validatsiyasi (faqat O'zbekiston raqamlari uchun +998...)
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(telefon)) {
      return NextResponse.json({ error: "Telefon raqami +998 bilan boshlanishi va 9 ta raqamdan iborat bo'lishi kerak" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('ustalar')
      .insert([
        { ism, kasb, telefon, shahar, bio }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Usta muvaffaqiyatli qo'shildi", data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
