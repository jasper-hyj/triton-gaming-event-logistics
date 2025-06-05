import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import ItemsRepository from '@/utils/supabase/repositories/ItemsRepository';

type Context = {
    params: {
        itemId: string;
    };
};

export async function GETItem(_req: NextRequest, { params }: Context) {
    const { itemId } = params;

    const cookieStore = await cookies();
    const supabase: SupabaseClient = createClient(cookieStore);

    const itemsRepo = new ItemsRepository(supabase);

    const { data: item, error } = await itemsRepo.getById(itemId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
}
