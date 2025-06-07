// hooks/useCurrentUser.ts
import { useFetch } from "./useFetch";
import UsersRepository from "@/lib/repositories/UsersRepository";
import { User } from "@supabase/supabase-js";

// Client hook - returns { data, loading, error }
export default function useUserClient(): {
  data: User | undefined;
  loading: boolean;
  error: string | null;
} {
  const repo = UsersRepository.createClient();
  return useFetch<User | undefined>(
    () => repo.getBySession().then((user) => ({ data: user, error: null })),
    undefined,
  );
}
