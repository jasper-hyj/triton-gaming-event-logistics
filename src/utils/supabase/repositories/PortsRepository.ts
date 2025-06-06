import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Port = {
    id: string;
};

export default class ItemsRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async getAll(): Promise<{ data: Port[] | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('ports').select('*');
        return { data, error };
    }

    async getById(id: string): Promise<{ data: Port | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('ports').select('*').eq('id', id).single();
        return { data, error };
    }


    async insert(port: Omit<Port, 'id'>) {
        return await this.supabase.from('ports').insert(port).select().single();
    }

    async update(id: string, updates: Partial<Port>) {
        return await this.supabase.from('ports').update(updates).eq('id', id).select().single();
    }

    async delete(id: string) {
        return await this.supabase.from('ports').delete().eq('id', id).select().single();
    }
}
