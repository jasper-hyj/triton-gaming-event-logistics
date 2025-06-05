import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

type Item = {
    id: string;
    name: string;
    type: string;
    description: string;
    ports: string[];
    password: string;
    parts: string[];
    missings: string[];
    condition: string;
    source: string;
    provider: string;
    installations: string[];
    note: string;
};

export async function GET(
    req: Request,
    context: { params: { itemId: string } }
) {
    const { itemId } = context.params;
    const cookieStore: ReadonlyRequestCookies = await cookies();
    const supabase: SupabaseClient = createClient(cookieStore);

    const { data: item, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item });
}
