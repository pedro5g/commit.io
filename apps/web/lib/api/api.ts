import { CreateHttpClientAdapter, FetchAdapter } from "./http-adapter"
import {
  ConfirmEmailResponseType,
  ForgetPasswordBodyType,
  ForgetPasswordResponseType,
  GetProfileResponseType,
  RegisterUserBodyType,
  RegisterUserResponseType,
  ResetPasswordBodyType,
  ResetPasswordResponseType,
} from "./types"

const USER_API_URL = process.env.NEXT_PUBLIC_USER_API_URL

export const fetchAdapter = FetchAdapter()
export const requester = CreateHttpClientAdapter(fetchAdapter)

export const registerUserApi = async <B = RegisterUserBodyType>(body: B) =>
  await requester.POST<RegisterUserResponseType, B>(
    `${USER_API_URL}/register/email`,
    body,
  )
export const confirmEmailApi = async (code: string) =>
  await requester.PUT<ConfirmEmailResponseType>(
    `${USER_API_URL}/verify/email?code=${code}`,
  )

export const forgetPasswordApi = async <B = ForgetPasswordBodyType>(body: B) =>
  await requester.PATCH<ForgetPasswordResponseType, B>(
    `${USER_API_URL}/password-forget`,
    body,
  )

export const resetPasswordApi = async <B = ResetPasswordBodyType>(body: B) =>
  await requester.PATCH<ResetPasswordResponseType, B>(
    `${USER_API_URL}/reset-password`,
    body,
  )

export const getProfileApi = async () =>
  await requester.GET<GetProfileResponseType>(`${USER_API_URL}/profile`)
