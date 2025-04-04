import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/"]
const publicRoutes = [
  "/login",
  "/sign-up",
  "/confirm-account",
  "/forgot-password",
  "/rest-password",
  "/email-confirmation",
]
const REFRESH_PATH = "/api/auth/refresh"

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const hasAccessToken = request.cookies.has("accessToken")
  const hasRefreshToken = request.cookies.has("refreshToken")

  const isFetchAdapterCall = request.headers.get("X-Fetch-Adapter") === "true"
  const isServerRequest = request.headers.get("X-Server-Request") === "true"

  if (isProtectedRoute && !hasAccessToken && !isFetchAdapterCall) {
    if (hasRefreshToken) {
      const url = request.nextUrl.clone()
      url.pathname = REFRESH_PATH
      return NextResponse.rewrite(url, { request })
    }
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  if (
    isServerRequest &&
    !hasAccessToken &&
    hasRefreshToken &&
    !path.startsWith("/api")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = REFRESH_PATH
    return NextResponse.rewrite(url, { request })
  }

  if (isPublicRoute && hasAccessToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  return NextResponse.next()
}
