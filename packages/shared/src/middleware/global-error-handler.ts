import { ErrorRequestHandler, Response } from "express"
import { HTTP_STATUS } from "../utils/http-status"
import z from "zod"
import { AppError } from "../exceptions"
import { logger } from "../logger"

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }))
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    ok: false,
    message: "Validation failed",
    errors,
  })
}
export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  logger.error(`Error on PATH: ${req.path}`)

  if (error instanceof SyntaxError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      ok: false,
      message: "Invalid Json format, please check your request body",
    })
  }

  if (error instanceof z.ZodError) {
    formatZodError(res, error)
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      ok: false,
      message: error.message,
      errorCode: error.errorCode,
    })
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    ok: false,
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  })
}
