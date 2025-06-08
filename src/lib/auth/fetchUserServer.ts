import { createSupabaseServerComponentClient } from "@/utils/supabase/server";
import { User } from "./User";

export async function fetchUserServer(): Promise<User | null> {
  const supabase = await createSupabaseServerComponentClient();

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
