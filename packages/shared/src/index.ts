import { Response as IResponse } from "express"
import { AuthProvidersType } from "./constants"

export * from "./exceptions"
export * from "./middleware"
export * from "./logger"
export * from "./utils"
export * from "./env"
export * from "./dirname"
export * from "./db"
export * from "./constants"
export * from "./messages"

export { default as express } from "express"
export { Router } from "express"
export { default as cors } from "cors"
export { default as cookieParser } from "cookie-parser"
export * from "jsonwebtoken"
export * from "amqplib"
export * from "@prisma/client"

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string
        name: string
        email: string
        accountProvider: AuthProvidersType
      }
    }
    export interface Response {
      setAuthCookies: (data: {
        accessToken: string
        refreshToken: string
      }) => IResponse
    }
  }
}
