import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // Lấy token từ cookies
    const token = request.cookies.get("auth-token")?.value

    // Các route cần authentication
    const protectedRoutes = ["/", "/product", "/transaction", "/customer", "/category", "/staff", "/report"]

    // Các route auth (không cần token)
    const authRoutes = ["/auth/login"]

    const { pathname } = request.nextUrl

    // Nếu đang ở auth routes và đã có token -> redirect về dashboard
    if (authRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    // Nếu đang ở protected routes và chưa có token -> redirect về login
    if (protectedRoutes.includes(pathname) && !token) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}
