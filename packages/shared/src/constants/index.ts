export const AuthProviders = {
  EMAIL: "EMAIL",
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
} as const

export const Codes = {
  EMAIL_VERIFY: "EMAIL_VERIFY",
  RESET_PASSWORD: "RESET_PASSWORD",
} as const

export const EmailMethods = {
  SEND_EMAIL_VERIFY: "send-email-verify",
  SEND_PASSWORD_RESET: "send-password-reset",
} as const

export type AuthProvidersType = keyof typeof AuthProviders
export type CodesType = keyof typeof Codes
export type EmailMethodsType = (typeof EmailMethods)[keyof typeof EmailMethods]
