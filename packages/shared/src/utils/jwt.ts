import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken"
import { env } from "../env"

export type AccessTokenPayload = {
  userId: string
}

export type RefreshTokenPayload = {
  userId: string
}

type SignOptsAndSecret = SignOptions & {
  secret: string
}

const defaults: SignOptions = {
  audience: ["user"],
}

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: env.JWT_EXPIRES_IN,
  secret: env.JWT_PUBLIC_SECRET,
}

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: env.REFRESH_EXPIRES_IN,
  secret: env.REFRESH_SECRET,
}

export const signJwtToken = (payload: AccessTokenPayload | RefreshTokenPayload, options?: SignOptsAndSecret) => {
  const { secret, ...opts } = options || accessTokenSignOptions
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  })
}

export const verifyJwtToken = <T extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string },
) => {
  try {
    const { secret = env.JWT_PUBLIC_SECRET, ...opts } = options || {}
    const payload = jwt.verify(token, secret, { ...defaults, ...opts }) as T
    return { payload }
  } catch (e: unknown) {
    const message = e && typeof e === "object" && "message" in e ? e?.message : e
    return {
      error: message,
    }
  }
}
