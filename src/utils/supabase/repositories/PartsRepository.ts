import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Part = {
    id: string;
};

export default class PartsRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async getAll(): Promise<{ data: Part[] | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('parts').select('*');
        return { data, error };
    }

    async getById(id: string): Promise<{ data: Part | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('parts').select('*').eq('id', id).single();
        return { data, error };
    }


    async insert(part: Omit<Part, 'id'>) {
        return await this.supabase.from('parts').insert(part).select().single();
    }

    async update(id: string, updates: Partial<Part>) {
        return await this.supabase.from('parts').update(updates).eq('id', id).select().single();
    }

    async delete(id: string) {
        return await this.supabase.from('parts').delete().eq('id', id).select().single();
    }
}
