import { z } from "zod"

const emailSchema = z.string().trim().email()
const passwordSchema = z.string().trim().min(6).max(255)
const codeSchema = z
  .string()
  .trim()
  .min(10, { message: "Invalid code" })
  .max(10, { message: "Invalid code" })
const userNameSchema = z.string().trim().min(3).max(255)

export const confirmEmailSchema = z.object({
  code: codeSchema,
})

export const registerByEmailSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const loginByEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const passwordForgetSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  code: codeSchema,
  password: passwordSchema,
})

export const updateUserProfileSchema = z.object({
  userName: userNameSchema,
  bio: z.string().trim(),
})
