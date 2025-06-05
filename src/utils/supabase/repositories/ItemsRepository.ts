import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Item = {
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

export default class ItemsRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async getAll(): Promise<{ data: Item[] | null; error: Error | null }> {
        const { data, error } = await this.supabase
            .from('items')
            .select('*');
        return { data, error };
    }

    async getById(itemId: string): Promise<{ data: Item | null; error: Error | null }> {
        const { data, error } = await this.supabase
            .from('items')
            .select('*')
            .eq('id', itemId)
            .single();
        return { data, error };
    }

    async insert(item: Omit<Item, 'id'>): Promise<{ data: Item | null; error: Error | null }> {
        const { data, error } = await this.supabase
            .from('items')
            .insert(item)
            .select()
            .single();
        return { data, error };
    }

    async update(itemId: string, updates: Partial<Item>): Promise<{ data: Item | null; error: Error | null }> {
        const { data, error } = await this.supabase
            .from('items')
            .update(updates)
            .eq('id', itemId)
            .select()
            .single();
        return { data, error };
    }

    async delete(itemId: string): Promise<{ data: Item | null; error: Error | null }> {
        const { data, error } = await this.supabase
            .from('items')
            .delete()
            .eq('id', itemId)
            .select()
            .single();
        return { data, error };
    }
}
