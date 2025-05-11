import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const protedPath = ["/shopkeeper", "/admin", "/order"]

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // 受保護路徑
  const isProtectedPath = protedPath.some((path) => pathname.startsWith(path))
  
  // 未登入且訪問受保護路徑，重定向到登入頁面並帶上 callbackUrl
  if (!token && isProtectedPath) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin 可以訪問所有頁面
  if (token?.role === "admin") {
    return NextResponse.next()
  }

  // Shopkeeper不能訪問 /admin
  if (token?.role === "shopkeeper" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/shopkeeper/:path*", "/admin/:path*", "/order/:path*"], 
}
