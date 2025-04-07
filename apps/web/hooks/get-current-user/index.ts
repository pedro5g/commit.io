import { isServerSide } from "@/lib/utils"
import * as Server from "./server"
import * as Client from "./client"

export const getCurrentUser = () =>
  isServerSide() ? Server.getCurrentUser() : Client.getCurrentUser()
