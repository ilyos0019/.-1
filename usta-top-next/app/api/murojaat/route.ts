import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mijoz_ism, mijoz_tel, usta_id, xabar } = body;

    if (!mijoz_ism || !mijoz_tel || !usta_id) {
      return NextResponse.json({ error: "Barcha majburiy maydonlarni to'ldiring" }, { status: 400 });
    }

    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(mijoz_tel)) {
      return NextResponse.json({ error: "Telefon raqami +998 bilan boshlanishi va 9 ta raqamdan iborat bo'lishi kerak" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('murojaatlar')
      .insert([
        { mijoz_ism, mijoz_tel, usta_id, xabar }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Murojaat muvaffaqiyatli yuborildi", data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
