import { User } from "./User";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export async function fetchUserClient(): Promise<User | null> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error || !profile) return null;

  return User.from(authUser, profile);
}
