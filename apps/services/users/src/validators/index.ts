import { z } from "zod"

const emailSchema = z.string().trim().email()
const passwordSchema = z.string().trim().min(6).max(255)

export const confirmEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .min(10, { message: "Invalid code" })
    .max(10, { message: "Invalid code" }),
})

export const registerByEmailSchema = z.object({
  userName: z.string().trim().min(3).max(255),
  email: emailSchema,
  password: passwordSchema,
})

export const loginByEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
