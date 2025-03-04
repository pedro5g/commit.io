import { randomBytes, scrypt } from "node:crypto"
import { promisify } from "node:util"

const promiseScrypt = promisify(scrypt)

const KEY_LEN = 32

export const passwordToHash = async (password: string) => {
  const salt = randomBytes(8).toString("hex")
  const hash = (await promiseScrypt(password, salt, KEY_LEN)) as Buffer

  return `${salt}.${hash.toString("hex")}`
}

export const comparePasswords = async (password: string, passwordHash: string) => {
  const [salt, hash] = passwordHash.split(".")
  // hub -> hash under test
  const hub = (await promiseScrypt(password, salt, KEY_LEN)) as Buffer

  return hash === hub.toString("hex")
}
