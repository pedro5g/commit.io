"use server"

import { State } from "@/@types"
import { resetPasswordApi } from "@/lib/api/api"
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/schemas/auth-schemas"
import { redirect, RedirectType } from "next/navigation"

export async function resetPasswordAction(
  preventState: State<ResetPasswordSchemaType> | undefined,
  formData: FormData,
) {
  const data = {
    ...Object.fromEntries(formData.entries()),
    code: preventState?.defaultValues.code,
  } as ResetPasswordSchemaType

  const validatedFields = resetPasswordSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      defaultValues: {
        password: data.password,
        confirmPassword: data.confirmPassword,
        code: data.code,
      },
      message: "Invalid form data",
    }
  }

  const { password, code } = validatedFields.data

  try {
    const response = await resetPasswordApi({ password, code })

    if (!response.ok) {
      return {
        defaultValues: {
          password: data.password,
          confirmPassword: data.confirmPassword,
          code: data.code,
        },
        message: response.message,
      }
    }
  } catch (error) {
    console.error("Error on reset password", error)
    return {
      defaultValues: {
        password: data.password,
        confirmPassword: data.confirmPassword,
        code: data.code,
      },
      message: "Error reset password, please try again late",
    }
  }

  redirect("/login", RedirectType.replace)
}
