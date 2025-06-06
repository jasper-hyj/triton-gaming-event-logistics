import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Port = {
    id: string;
};

export type Part = {
    id: string;
};

export type Item = {
    id: string;
    name: string;
    type: string;
    description: string;
    password: string;
    condition: string;
    source: string;
    provider: string;
    installations: string[];
    note: string;
    created_at: string;
    ports: Port[];
    parts: Part[];
    missings: Part[];
};

export default class ItemsRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    // ----- View-based reads -----

    async getAllItems(): Promise<{ data: Item[] | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('view_items').select('*');
        return { data, error };
    }

    async getItemById(id: string): Promise<{ data: Item | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('view_items').select('*').eq('id', id).single();
        return { data, error };
    }

    // ----- Items -----

    async insertItem(item: Omit<Item, 'id' | 'created_at' | 'ports' | 'parts' | 'missings'>) {
        return await this.supabase.from('items').insert(item).select().single();
    }

    async updateItem(id: string, updates: Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>) {
        return await this.supabase.from('items').update(updates).eq('id', id).select().single();
    }

    async deleteItem(id: string) {
        return await this.supabase.from('items').delete().eq('id', id).select().single();
    }

    // ----- Ports -----

    async insertPort(port: Omit<Port, 'id'>) {
        return await this.supabase.from('ports').insert(port).select().single();
    }

    async updatePort(id: string, updates: Partial<Port>) {
        return await this.supabase.from('ports').update(updates).eq('id', id).select().single();
    }

    async deletePort(id: string) {
        return await this.supabase.from('ports').delete().eq('id', id).select().single();
    }

    // ----- Parts -----

    async insertPart(part: Omit<Part, 'id'>) {
        return await this.supabase.from('parts').insert(part).select().single();
    }

    async updatePart(id: string, updates: Partial<Part>) {
        return await this.supabase.from('parts').update(updates).eq('id', id).select().single();
    }

    async deletePart(id: string) {
        return await this.supabase.from('parts').delete().eq('id', id).select().single();
    }

    // ----- Linking: item_ports -----

    async linkItemToPort(itemId: string, portId: string) {
        return await this.supabase.from('item_ports').insert({ item_id: itemId, port: portId });
    }

    async unlinkItemFromPort(itemId: string, portId: string) {
        return await this.supabase.from('item_ports').delete().match({ item_id: itemId, port: portId });
    }

    // ----- Linking: item_parts -----

    async linkItemToPart(itemId: string, partId: string) {
        return await this.supabase.from('item_parts').insert({ item_id: itemId, part: partId });
    }

    async unlinkItemFromPart(itemId: string, partId: string) {
        return await this.supabase.from('item_parts').delete().match({ item_id: itemId, part: partId });
    }

    // ----- Linking: item_missings -----

    async linkItemToMissing(itemId: string, partId: string) {
        return await this.supabase.from('item_missings').insert({ item_id: itemId, part: partId });
    }

    async unlinkItemFromMissing(itemId: string, partId: string) {
        return await this.supabase.from('item_missings').delete().match({ item_id: itemId, part: partId });
    }
}
