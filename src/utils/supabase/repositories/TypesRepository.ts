import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Type = {
    id: string;
};

export default class TypesRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async getAll(): Promise<{ data: Type[] | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('types').select('*');
        return { data, error };
    }

    async getById(id: string): Promise<{ data: Type | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('types').select('*').eq('id', id).single();
        return { data, error };
    }

    async insert(part: Omit<Type, 'id'>) {
        return await this.supabase.from('types').insert(part).select().single();
    }

    async update(id: string, updates: Partial<Type>) {
        return await this.supabase.from('types').update(updates).eq('id', id).select().single();
    }

    async delete(id: string) {
        return await this.supabase.from('types').delete().eq('id', id).select().single();
    }
}
