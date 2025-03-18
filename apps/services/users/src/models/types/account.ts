import { AuthProvidersType } from "@commit.oi/shared"

export type AccountQuery = {
  id: string
  user_name: string
  bio: string | null
  accountId: string
  email: string
  password: string
  avatar_url: string | null
  is_email_verified: boolean
  provider: AuthProvidersType
}
