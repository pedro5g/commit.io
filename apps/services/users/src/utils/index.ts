import { randomUUID } from "node:crypto"

export const genRandomCode = () => {
  return randomUUID().replaceAll("-", "").trim().slice(0, 10)
}
