"use server"

import { State } from "@/@types"
import { LoginResponseType } from "@/lib/api/types"
import { CookieParser } from "@/lib/utils"
import { loginSchema, LoginSchemaType } from "@/schemas/auth-schemas"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(
  preventState: State<LoginSchemaType> | undefined,
  formData: FormData,
) {
  const data = Object.fromEntries(formData.entries()) as LoginSchemaType

  const validadeFields = loginSchema.safeParse(data)

  if (!validadeFields.success) {
    return {
      errors: validadeFields.error.flatten().fieldErrors,
      defaultValues: {
        email: data.email || "",
        password: data.password || "",
      },
      message: "Invalid form data",
    }
  }

  const { email, password } = validadeFields.data

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_API_URL}/login`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    )

    const responseData = (await response.json()) as LoginResponseType

    if (response.status !== 200 && !responseData.ok) {
      return {
        message: responseData.message as string,
        defaultValues: {
          email: data.email || "",
          password: data.password || "",
        },
      }
    }
    const setCookieHeader = response.headers.getSetCookie()

    if (setCookieHeader) {
      const _cookies = CookieParser.parser(setCookieHeader)

      _cookies.forEach(async (cookie) => {
        ;(await cookies()).set(cookie.key, cookie.value, cookie.opts)
      })
      ;(await cookies()).set(
        "user-account",
        JSON.stringify(responseData.userAccount),
      )
    }
  } catch (error) {
    console.error("Error on login", error)
    return {
      message: "Oops, something wrong went login, please try again more late",
      defaultValues: {
        email: data.email || "",
        password: data.password || "",
      },
    }
  }

  redirect("/")
}
