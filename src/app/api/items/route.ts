// src/app/api/todos/route.ts
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import ItemsRepository from '@/utils/supabase/repositories/ItemsRepository';
import { NextRequest } from 'next/server';



export async function GET(_req: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const itemsRepo = new ItemsRepository(supabase);
    const { data, error } = await itemsRepo.getAllItems();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ items: data });
}