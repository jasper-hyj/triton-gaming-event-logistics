import { cookies } from 'next/headers';
import ItemsRepository from '@/utils/supabase/repositories/ItemsRepository';
import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';



export async function GET(_req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    const itemsRepo = new ItemsRepository(supabase);
    const { data, error } = await itemsRepo.getAll();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ items: data });
}