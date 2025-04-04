import {
  add,
  BadRequestException,
  Codes,
  EmailMethods,
  env,
  ErrorCode,
  HTTP_STATUS,
  HttpException,
  logger,
  minutesAgo,
  NotFoundException,
  prisma,
} from "@commit.oi/shared"
import { PasswordForgetDTO } from "../dtos/password-forget-dto"
import { genRandomCode } from "../../utils"
import { rmqMessageService } from "../../broker"

export const passwordForgetService = async ({ email }: PasswordForgetDTO) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new NotFoundException("User not found")
  }

  if (!user.password) {
    throw new BadRequestException("Use social login")
  }

  if (!user.isEmailVerified) {
    let url = ""
    const verifyCode = await prisma.code.findFirst({
      where: {
        userId: user.id,
        type: Codes.EMAIL_VERIFY,
      },
      select: {
        code: true,
      },
    })
    if (env.NODE_ENV !== "test") {
      if (!verifyCode) {
        const code = genRandomCode()
        await prisma.code.create({
          data: {
            userId: user.id,
            code,
            type: Codes.EMAIL_VERIFY,
          },
        })
        url = `${env.APP_ORIGEM}/confirm-account?code=${code}`
      } else {
        url = `${env.APP_ORIGEM}/confirm-account?code=${verifyCode.code}`
      }

      const ok = await rmqMessageService.publishInQueue(
        EmailMethods.SEND_EMAIL_VERIFY,
        JSON.stringify({
          email,
          url,
        }),
      )

      if (ok) logger.info(`Message publish on [confirm-email] queue`)
      if (!ok) logger.error(`Error to publish message on [confirm-email] queue`)
    }
    throw new BadRequestException(
      "Please check your email box and confirm account",
      ErrorCode.VERIFICATION_ERROR,
    )
  }

  const THREE_MINUTES_AGO = minutesAgo(3)
  const MAX_ATTEMPTS = 3

  const countForgetCodes = await prisma.code.count({
    where: {
      userId: user.id,
      type: Codes.RESET_PASSWORD,
      createdAt: { gt: THREE_MINUTES_AGO },
    },
  })

  if (countForgetCodes >= MAX_ATTEMPTS) {
    throw new HttpException(
      "Too many request, try again later",
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ErrorCode.AUTH_TOO_MANY_ATTEMPTS,
    )
  }

  const ONE_HOUR_FROM_NOW = add(new Date(), { hours: 1 })
  const validateCode = await prisma.code.create({
    data: {
      userId: user.id,
      code: genRandomCode(),
      type: Codes.RESET_PASSWORD,
      expiresAt: ONE_HOUR_FROM_NOW,
    },
  })

  const resetLink = `${env.APP_ORIGEM}/reset-password?code=${
    validateCode.code
  }&exp=${ONE_HOUR_FROM_NOW.getTime()}`

  if (env.NODE_ENV !== "test") {
    const ok = await rmqMessageService.publishInQueue(
      EmailMethods.SEND_PASSWORD_RESET,
      JSON.stringify({
        email,
        url: resetLink,
      }),
    )

    if (ok) logger.info(`Message publish on ["send-password-reset"] queue`)
    if (!ok)
      logger.error(`Error to publish message on ["send-password-reset"] queue`)
  }

  return { message: "Check your email box and reset your password" }
}
