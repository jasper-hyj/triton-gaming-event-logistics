import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = await createSupabaseReqResClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect only /account and subpaths
  if (!user && request.nextUrl.pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

// Run middleware only on /account and subroutes (not on /)
export const config = {
  matcher: ["/account/:path*"],
};
