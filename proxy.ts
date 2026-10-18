import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        if (headers) {
          const entries =
            headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers;
          for (const key of ["cache-control", "expires", "pragma"]) {
            const value = entries[key] ?? entries[key.replace(/\b\w/g, (c) => c.toUpperCase())];
            if (value) supabaseResponse.headers.set(key, value);
          }
        }
      },
    },
  });

  await supabase.auth.getClaims();

  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/subscribe");

  if (isProtected) {
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin", "/admin/:path*", "/subscribe", "/login", "/register", "/create/:path*", "/auth/:path*"],
};
