'use strict'
import { createClient } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore : ReadonlyRequestCookies = await cookies();
  const supabase : SupabaseClient = createClient(cookieStore);

  return (<></>
  );
}
