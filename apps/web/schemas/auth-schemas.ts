import { z } from "zod"

export const userNameSchema = z
  .string()
  .trim()
  .min(3, { message: "Name must be at least 3 characters long" })
  .max(255, { message: "Name must be maximum 255 characters" })

export const emailSchema = z.string().trim().email()
export const passwordSchema = z
  .string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(255, { message: "Password must be maximum 255 characters" })
export const codeSchema = z
  .string()
  .trim()
  .min(10, { message: "Invalid code" })
  .max(10, { message: "Invalid code" })

export const registerSchema = z
  .object({
    userName: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    (args) => {
      return args.password === args.confirmPassword
    },
    { message: "Password does not match", path: ["confirmPassword"] },
  )

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const forgetPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    code: codeSchema,
  })
  .refine(
    (args) => {
      return args.password === args.confirmPassword
    },
    { message: "Password does not match", path: ["confirmPassword"] },
  )

export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type ForgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
