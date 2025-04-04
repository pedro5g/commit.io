import { isServerSide } from "../utils"
import {
  FetchAdapterOpts,
  HttpClient,
  MethodsEnum,
  MethodType,
  RequesterFn,
} from "./types"

export function FetchAdapter(opts?: FetchAdapterOpts): RequesterFn {
  return async function requester<T>(
    url: string,
    method: MethodType,
    body?: unknown,
    headers?: Record<string, string>,
    retryAfterRefresh = true,
  ): Promise<T> {
    const { baseURL, ...rest } = opts || {}
    const _url = baseURL ? `${baseURL}${url}` : url

    let finalHeaders: Record<string, string> = {
      ...(headers || {}),
      "Content-Type": "application/json",
    }

    if (isServerSide()) {
      const { cookies } = await import("next/headers")
      const cookieStore = await cookies()
      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ")
      finalHeaders = {
        Cookie: cookieHeader,
        "X-Server-Request": "true",
        ...finalHeaders,
      }
    }

    try {
      const response = await fetch(_url, {
        method: method.toUpperCase(),
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
        ...rest,
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data

        if (
          ["AUTH_TOKEN_NOT_FOUND"].includes(errorData.errorCode) &&
          response.status === 401 &&
          retryAfterRefresh
        ) {
          const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_NEXT_APP_URL}/api/auth/refresh`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Cookie: finalHeaders.Cookie || "",
                "X-Fetch-Adapter": "true",
              },
            },
          )
          const refreshData = await refreshResponse.json()

          if (!refreshResponse.ok || !refreshData.success) {
            throw new Error("Refresh token failed")
          }
          return requester(url, method, body, headers, false)
        }
        throw errorData
      }

      return { ...data, statusCode: response.status } as T
    } catch (error) {
      console.log("Error on fetch", error)
      return Promise.reject(error)
    }
  }
}

/**
 * utility function that create a wrapper around a http client,
 * easily network requests
 *
 *
 * @param requester - it's a adapter that normalize params and return of data between unlike http clients
 * @returns returns the main request methods such as (GET, POST, DELETE ...)
 */
export function CreateHttpClientAdapter(requester: RequesterFn): HttpClient {
  return {
    requester,
    async GET<T>(url: string, headers?: Record<string, string>): Promise<T> {
      return this.requester<T>(url, MethodsEnum.GET, undefined, headers)
    },
    async POST<T, B = unknown>(
      url: string,
      body?: B,
      headers?: Record<string, string>,
    ): Promise<T> {
      return this.requester<T>(url, MethodsEnum.POST, body, {
        "Content-Type": "application/json",
        ...(headers || {}),
      })
    },
    async PUT<T, B = unknown>(
      url: string,
      body?: B,
      headers?: Record<string, string>,
    ): Promise<T> {
      return this.requester<T>(url, MethodsEnum.PUT, body, headers)
    },
    async DELETE<T>(url: string, headers?: Record<string, string>): Promise<T> {
      return this.requester<T>(url, MethodsEnum.DELETE, undefined, {
        "Content-Type": "application/json",
        ...(headers || {}),
      })
    },
    async PATCH<T, B = unknown>(
      url: string,
      body?: B,
      headers?: Record<string, string>,
    ): Promise<T> {
      return this.requester<T>(url, MethodsEnum.PATCH, body, {
        "Content-Type": "application/json",
        ...(headers || {}),
      })
    },
  }
}
