"use server"

import { confirmEmailApi } from "@/lib/api/api"

export async function confirmAction(code: string) {
  try {
    const response = await confirmEmailApi(code)

    if (response.ok && response.statusCode === 200) {
      return { success: true, message: "Email verified successfully" }
    }

    if (!response.ok && response.errorCode === "ALREADY_USED") {
      return { success: true, message: "Email already verified" }
    }

    return {
      success: false,
      message: "Error verifying email, please try again later",
    }
  } catch (e) {
    console.log(e)
    return {
      message: "Error verifying email, please try again later",
    }
  }
}
