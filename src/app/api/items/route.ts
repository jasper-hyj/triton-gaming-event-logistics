// src/app/api/todos/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

type Item = {
    id: string,
    name: string,
    type: string,
    description: string,
    ports: string[],
    password: string,
    parts: string[],
    missings: string[],
    condition: string,
    source: string,
    provider: string,
    installations: string[],
    note: string,
};


export async function GET() {
    const cookieStore: ReadonlyRequestCookies = await cookies();
    const supabase: SupabaseClient = createClient(cookieStore);

    const { data: items, error }: { data: Item[] | null, error: Error | null } = await supabase
        .from('items')
        .select('*');


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items });
}
