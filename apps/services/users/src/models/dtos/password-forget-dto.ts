export interface PasswordForgetDTO {
  email: string
}

export interface ResetPasswordDTO {
  password: string
  code: string
}
