import { NextResponse, type NextRequest } from 'next/server'
import { createClient as updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function middleware(request: NextRequest) {
  // Update session to keep it alive
  const response = await updateSession(request)
  
  const { nextUrl } = request
  
  // Create a separate client just to read the user state for routing
  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Ignore - we let updateSession handle writing
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isLoginRoute = nextUrl.pathname === "/login";
  const isShareRoute = nextUrl.pathname.startsWith("/share");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isShareRoute) {
    return response;
  }

  if (isLoginRoute) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // To check if they are an admin, we check their role in the public.User table.
  if (isAdminRoute) {
    const { data: dbUser } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.jpg (logo file)
     * - logo.png (logo file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.jpg|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
