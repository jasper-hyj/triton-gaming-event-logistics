import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ItemsRepository from '@/utils/supabase/repositories/ItemsRepository';
import { createSupabaseServerClient } from '@/utils/supabase/server';

type Context = {
    params: Promise<{
        itemId: string;
    }>;
};

export async function GET(_req: NextRequest, { params }: Context) {
    const { itemId } = await params;
    
    const supabase = await createSupabaseServerClient();

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
