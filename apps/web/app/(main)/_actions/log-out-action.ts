"use server"

import { logOutApi } from "@/lib/api/api"
import { redirect, RedirectType } from "next/navigation"

export async function logOutAction() {
  try {
    await logOutApi()
  } catch (e) {
    console.log(e)
    return
  }

  redirect("/login", RedirectType.replace)
}
