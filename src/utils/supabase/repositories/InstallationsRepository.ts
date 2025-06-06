import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Installation = {
    id: string;
    platform: string;
    size: number;
};

export default class InstallationsRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async getAll(): Promise<{ data: Installation[] | null; error: Error | null }> {
        return await this.supabase.from('installations').select('*');
    }

    async getById(id: string): Promise<{ data: Installation | null; error: Error | null }> {
        return await this.supabase.from('installations').select('*').eq('id', id).single();
    }


    async insert(Installation: Omit<Installation, 'id'>) {
        return await this.supabase.from('installations').insert(Installation).select().single();
    }

    async update(id: string, updates: Partial<Installation>) {
        return await this.supabase.from('installations').update(updates).eq('id', id).select().single();
    }

    async delete(id: string) {
        return await this.supabase.from('installations').delete().eq('id', id).select().single();
    }
}
