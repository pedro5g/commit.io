import { AuthProvidersType } from "@commit.oi/shared"

export interface ProfileDTO {
  userId: string
  accountProvider: AuthProvidersType
}
