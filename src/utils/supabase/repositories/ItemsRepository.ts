import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Part } from './PartsRepository';
import { Port } from './PortsRepository';


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

    async getAll(): Promise<{ data: Item[] | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('view_items').select('*');
        return { data, error };
    }

    async getById(id: string): Promise<{ data: Item | null; error: Error | null }> {
        const { data, error } = await this.supabase.from('view_items').select('*').eq('id', id).single();
        return { data, error };
    }

    // ----- Items -----

    async insert(item: Omit<Item, 'id' | 'created_at' | 'ports' | 'parts' | 'missings'>) {
        return await this.supabase.from('items').insert(item).select().single();
    }

    async update(id: string, updates: Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>) {
        return await this.supabase.from('items').update(updates).eq('id', id).select().single();
    }

    async delete(id: string) {
        return await this.supabase.from('items').delete().eq('id', id).select().single();
    }

    // ----- Linking: item_ports -----

    async linkItemToPort(itemId: string, portId: string) {
        return await this.supabase.from('item_ports').insert({ item_id: itemId, port: portId });
    }

    async unlinkItemFromPort(itemId: string, portId: string) {
        return await this.supabase.from('item_ports').delete().match({ item_id: itemId, port: portId });
    }

    async unlinkItemFromAllPort(itemId: string) {
        return await this.supabase.from('item_ports').delete().match({ item_id: itemId });
    }

    async linkItemToAllPort(itemId: string, portIds: Set<string>) {
        const inserts = Array.from(portIds).map((portId) => ({
            item_id: itemId,
            port: portId,
        }));
        return await this.supabase.from('item_ports').insert(inserts);
    }

    // ----- Linking: item_parts -----

    async linkItemToPart(itemId: string, partId: string) {
        return await this.supabase.from('item_parts').insert({ item_id: itemId, part: partId });
    }

    async unlinkItemFromPart(itemId: string, partId: string) {
        return await this.supabase.from('item_parts').delete().match({ item_id: itemId, part: partId });
    }

    async unlinkItemFromAllPart(itemId: string) {
        return await this.supabase.from('item_parts').delete().match({ item_id: itemId });
    }

    async linkItemToAllPart(itemId: string, partIds: Set<string>) {
        const inserts = Array.from(partIds).map((partId) => ({
            item_id: itemId,
            part: partId,
        }));
        return await this.supabase.from('item_parts').insert(inserts);
    }

    // ----- Linking: item_missings -----

    async linkItemToMissing(itemId: string, partId: string) {
        return await this.supabase.from('item_missings').insert({ item_id: itemId, part: partId });
    }

    async unlinkItemFromMissing(itemId: string, partId: string) {
        return await this.supabase.from('item_missings').delete().match({ item_id: itemId, part: partId });
    }

    async unlinkItemFromAllMissing(itemId: string) {
        return await this.supabase.from('item_missings').delete().match({ item_id: itemId });
    }

    async linkItemToAllMissing(itemId: string, missingIds: Set<string>) {
        const inserts = Array.from(missingIds).map((partId) => ({
            item_id: itemId,
            part: partId,
        }));
        return await this.supabase.from('item_missings').insert(inserts);
    }
}
