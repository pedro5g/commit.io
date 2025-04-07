import { UserAccount } from "@/@types"

export type MethodType = "get" | "post" | "put" | "patch" | "delete"

export enum MethodsEnum {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PATCH = "patch",
  PUT = "put",
}
export type FetchAdapterOpts = RequestInit & {
  baseURL: string
}

export type RequesterFn = <T>(
  url: string,
  method: MethodType,
  body?: unknown,
  headers?: Record<string, string>,
) => Promise<T>

export type FetchAdapterType = (
  instance: typeof fetch,
  opts?: FetchAdapterOpts,
) => RequesterFn
export interface HttpClient {
  requester<T>(
    url: string,
    method: MethodType,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<T>
  GET<T>(url: string, headers?: Record<string, string>): Promise<T>
  POST<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>,
  ): Promise<T>
  PUT<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>,
  ): Promise<T>
  DELETE<T>(url: string, headers?: Record<string, string>): Promise<T>
  PATCH<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>,
  ): Promise<T>
}
export type BaseResponseType<T = {}> = {
  ok: boolean
  message: string
  statusCode: number
  errorCode?: string
} & T
export type RegisterUserBodyType = {
  userName: string
  email: string
  password: string
}
export type RegisterUserResponseType = BaseResponseType
export type ConfirmEmailResponseType = BaseResponseType

export type LoginResponseType = BaseResponseType<{
  userAccount: UserAccount
}>

export type ForgetPasswordBodyType = {
  email: string
}
export type ForgetPasswordResponseType = BaseResponseType

export type ResetPasswordBodyType = {
  password: string
  code: string
}

export type ResetPasswordResponseType = BaseResponseType

export type GetProfileResponseType = BaseResponseType<{
  userAccount: UserAccount
}>

export type UpdateUserProfileBodyType = {
  userName: string
  bio: string
}
export type UpdateUserProfileResponseType = BaseResponseType<
  UserAccount["user"]
>

export type LogOutResponseType = BaseResponseType
