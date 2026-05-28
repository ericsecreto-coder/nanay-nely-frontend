import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/lib/types/database";

const customerProtectedRoutes = ["/dashboard"];
const customerAuthRoutes = ["/login", "/register", "/auth", "/forgot-password"];
const adminLoginRoute = "/admin/login";

async function getUserRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<UserRole> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return (data?.role as UserRole | undefined) ?? "customer";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === adminLoginRoute;
  const isAdminProtected = isAdminRoute && !isAdminLogin;

  const isCustomerProtected = customerProtectedRoutes.some((route) => pathname.startsWith(route));
  const isCustomerAuthRoute = customerAuthRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const role = user ? await getUserRole(supabase, user.id) : null;
  const isAdmin = role === "admin";

  if (!user && isAdminProtected) {
    const url = request.nextUrl.clone();
    url.pathname = adminLoginRoute;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAdminProtected && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.set("error", "admin_only");
    return NextResponse.redirect(url);
  }

  if (user && isAdminLogin && isAdmin) {
    const redirect = request.nextUrl.searchParams.get("redirect") ?? "/admin";
    const url = request.nextUrl.clone();
    url.pathname = redirect.startsWith("/admin") ? redirect : "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!user && isCustomerProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isCustomerProtected && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (user && isCustomerAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? "/admin" : "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
