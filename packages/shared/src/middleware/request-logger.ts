import { NextFunction, Request, Response } from "express"
import { env } from "../env"
import { logger } from "../logger"

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { ip, method, url, headers } = req
  const id = new Date().getTime()

  let agtMsg = ""
  if (headers["user-agent"]) agtMsg += `_a=${headers["user-agent"]}`

  if (env.NODE_ENV !== "prod") {
    const msg = `[${ip}] {${method}} ${id} - Receiving ${url}`
    logger.info(`${msg}${agtMsg}`)
  }

  const started = new Date().getTime()

  res.on("finish", () => {
    const took = new Date().getTime() - started

    logger.info(
      `{req} [${ip}] ${method} ` +
        `${url}${agtMsg} : http=${res.statusCode} ${took}ms`,
    )
  })

  next()
}
