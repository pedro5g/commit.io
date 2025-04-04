"use server"

import { State } from "@/@types"
import { forgetPasswordApi } from "@/lib/api/api"
import {
  forgetPasswordSchema,
  ForgetPasswordSchemaType,
} from "@/schemas/auth-schemas"

export async function forgetPasswordAction(
  preventState: State<ForgetPasswordSchemaType> | undefined,
  formData: FormData,
) {
  const data = Object.fromEntries(
    formData.entries(),
  ) as ForgetPasswordSchemaType

  const validadeFields = forgetPasswordSchema.safeParse(data)

  if (!validadeFields.success) {
    return {
      errors: validadeFields.error.flatten().fieldErrors,
      defaultValues: {
        email: data.email,
      },
      success: false,
      message: "Invalid form data",
    }
  }
  const { email } = validadeFields.data
  try {
    const response = await forgetPasswordApi({ email })

    if (response.ok) {
      return {
        success: response.ok,
        message: response.message,
        defaultValues: {
          email: data.email,
        },
      }
    }

    if (response.errorCode === "RESOURCE_NOT_FOUND") {
      return {
        success: response.ok,
        message: "ACCOUNT_NOT_FOUND",
        defaultValues: {
          email: data.email,
        },
      }
    }

    if (response.errorCode === "VERIFICATION_ERROR") {
      return {
        success: response.ok,
        message: "CONFIRM_EMAIL",
        defaultValues: {
          email: data.email,
        },
      }
    }
    return {
      success: response.ok,
      message: response.message,
      defaultValues: {
        email: data.email,
      },
    }
  } catch (error) {
    console.error("Error on forget password: ", error)
    return {
      message:
        "Oops, something wrong went request password reset, please try again more late",
      defaultValues: {
        email: data.email,
      },
    }
  }
}
