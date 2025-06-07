import { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "../../utils/supabase/client";
import { createSupabaseServerComponentClient } from "../../utils/supabase/server";

export default class UsersRepository {
  private supabase: SupabaseClient;

  static async createServer(): Promise<UsersRepository> {
    const supabase = await createSupabaseServerComponentClient();
    return new UsersRepository(supabase);
  }

  static createClient(): UsersRepository {
    const supabase = createSupabaseBrowserClient();
    return new UsersRepository(supabase);
  }

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async getBySession(): Promise<User | undefined> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) return undefined;
    return data.user;
  }
}
