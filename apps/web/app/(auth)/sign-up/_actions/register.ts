"use server"

import { State } from "@/@types"
import { registerUserApi } from "@/lib/api/api"
import { registerSchema, RegisterSchemaType } from "@/schemas/auth-schemas"
import { redirect, RedirectType } from "next/navigation"

export async function registerAction(
  preventState: State<RegisterSchemaType> | undefined,
  formData: FormData,
) {
  const data = Object.fromEntries(formData.entries()) as RegisterSchemaType

  const validadeFields = registerSchema.safeParse(data)

  if (!validadeFields.success) {
    return {
      errors: validadeFields.error.flatten().fieldErrors,
      defaultValues: {
        userName: data.userName || "",
        email: data.email || "",
        password: data.password || "",
        confirmPassword: data.confirmPassword || "",
      },
      message: "Invalid form data",
    }
  }
  const { userName, email, password } = validadeFields.data
  try {
    const response = await registerUserApi({ userName, email, password })

    if (!response.ok) {
      return {
        message: response.message,
        defaultValues: {
          userName: data.userName || "",
          email: data.email || "",
          password: data.password || "",
          confirmPassword: data.confirmPassword || "",
        },
      }
    }
  } catch (error) {
    console.error("Error on register user", error)
    return {
      message:
        "Oops, something wrong went register user, please try again more late",
      defaultValues: {
        userName: data.userName || "",
        email: data.email || "",
        password: data.password || "",
        confirmPassword: data.confirmPassword || "",
      },
    }
  }

  redirect(`/email-confirmation?email=${email}`, RedirectType.replace)
}
