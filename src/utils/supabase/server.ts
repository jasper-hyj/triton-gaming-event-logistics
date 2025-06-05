
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const createClient = (cookieStore: ReadonlyRequestCookies): SupabaseClient => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
};
