import { SupabaseClient } from "@supabase/supabase-js";

export default class BaseRepository<T extends { id: string }> {
  protected supabase: SupabaseClient;
  protected table: string;

  constructor(supabaseClient: SupabaseClient, table: string) {
    this.supabase = supabaseClient;
    this.table = table;
  }

  async getAll(): Promise<{ data: T[] | null; error: Error | null }> {
    const { data, error } = await this.supabase.from(this.table).select('*');
    return { data, error };
  }

  async getById(id: string): Promise<{ data: T | null; error: Error | null }> {
    const { data, error } = await this.supabase.from(this.table).select('*').eq('id', id).single();
    return { data, error };
  }

  async insert(item: Omit<T, 'id'>) {
    return await this.supabase.from(this.table).insert(item).select().single();
  }

  async update(id: string, updates: Partial<T>) {
    return await this.supabase.from(this.table).update(updates).eq('id', id).select().single();
  }

  async delete(id: string) {
    return await this.supabase.from(this.table).delete().eq('id', id).select().single();
  }
}
