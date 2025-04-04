import { AuthProvidersType } from "@commit.oi/shared"

export type State<T extends {}> = {
  errors?: {
    [K in keyof T]?: string[] | undefined
  }
  message: string
  success?: boolean
  defaultValues: T
}

export type UserAccount = {
  user: {
    id: string
    userName: string
    bio: string | null
    email: string
    isEmailVerified: boolean
  }
  account: {
    id: string
    provider: AuthProvidersType
    avatarUrl: string | null
  }
}
