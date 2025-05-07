import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database.types"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const { pathname } = req.nextUrl

  // If user is not authenticated and trying to access protected routes
  if (!session) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/patient") ||
      pathname === "/verify-email"
    ) {
      const redirectUrl = new URL("/signin", req.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  }

  // If user is authenticated but trying to access auth pages
  if (session) {
    if (pathname === "/signin" || pathname === "/register" || pathname === "/staff-signin") {
      // Get user role
      const { data: patient } = await supabase.from("patients").select("id").eq("auth_id", session.user.id).single()

      if (patient) {
        return NextResponse.redirect(new URL("/patient/dashboard", req.url))
      }

      const { data: vaccinator } = await supabase
        .from("vaccinators")
        .select("id, role")
        .eq("auth_id", session.user.id)
        .single()

      if (vaccinator) {
        if (vaccinator.role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        } else {
          return NextResponse.redirect(new URL("/doctor/dashboard", req.url))
        }
      }
    }

    // Role-based access control
    if (pathname.startsWith("/admin")) {
      const { data: vaccinator } = await supabase
        .from("vaccinators")
        .select("role")
        .eq("auth_id", session.user.id)
        .eq("role", "admin")
        .single()

      if (!vaccinator) {
        return NextResponse.redirect(new URL("/signin", req.url))
      }
    }

    if (pathname.startsWith("/doctor")) {
      const { data: vaccinator } = await supabase
        .from("vaccinators")
        .select("id")
        .eq("auth_id", session.user.id)
        .single()

      if (!vaccinator) {
        return NextResponse.redirect(new URL("/signin", req.url))
      }
    }

    if (pathname.startsWith("/patient")) {
      const { data: patient } = await supabase.from("patients").select("id").eq("auth_id", session.user.id).single()

      if (!patient) {
        return NextResponse.redirect(new URL("/signin", req.url))
      }
    }
  }

  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
