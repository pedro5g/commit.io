import { CookieParser } from "@/lib/utils"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const currentPath = request.nextUrl.pathname
  const isFetchAdapterCall = request.headers.get("X-Fetch-Adapter") === "true"

  const cookieStore = await cookies()
  const _cookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_USER_API_URL}/auth/refresh`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: _cookies || "",
        },
      },
    )

    const response = await res.json()

    if (!res.ok || !response.ok) {
      if (isFetchAdapterCall) {
        return NextResponse.json({ error: "Refresh failed" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/login", request.nextUrl))
    }

    const setCookieHeader = res.headers.getSetCookie()

    if (setCookieHeader) {
      const _cookies = CookieParser.parser(setCookieHeader)
      _cookies.forEach((cookie) => {
        cookieStore.set(cookie.key, cookie.value, cookie.opts)
      })
    }

    if (isFetchAdapterCall) {
      return NextResponse.json({ success: true }, { status: 200 })
    }
    return NextResponse.redirect(new URL(currentPath, request.nextUrl))
  } catch (error) {
    console.error("Erro on route /api/auth/refresh", error)
    if (isFetchAdapterCall) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      )
    }
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }
}
