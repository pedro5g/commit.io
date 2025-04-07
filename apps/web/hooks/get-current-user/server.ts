import { UserAccount } from "@/@types"
import { getProfileApi } from "@/lib/api/api"
import { cookies } from "next/headers"

export const getCurrentUser = async () => {
  const cookieStore = await cookies()

  const account = cookieStore.get("user-account")?.value

  if (!account) {
    const { userAccount } = await getProfileApi()
    cookieStore.set("user-account", JSON.stringify(userAccount))
    return userAccount
  }

  return JSON.parse(account) as UserAccount
}
