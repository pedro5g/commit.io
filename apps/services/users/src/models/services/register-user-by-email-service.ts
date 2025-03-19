import {
  AuthProviders,
  BadRequestException,
  Codes,
  EmailMethods,
  env,
  logger,
  passwordToHash,
  prisma,
} from "@commit.oi/shared"
import { RegisterUserByEmailDTO } from "../dtos/register-user-by-email-dto"
import { genRandomCode } from "../../utils"
import { rmqMessageService } from "../../broker"

export const registerUserByEmailService = async ({
  userName,
  email,
  password,
}: RegisterUserByEmailDTO) => {
  const userExists = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      userName: true,
      email: true,
      bio: true,
      accounts: {
        select: {
          id: true,
          provider: true,
        },
      },
    },
  })

  if (userExists) {
    const hasEmailAccount = userExists.accounts.some(
      ({ provider }) => provider === "EMAIL",
    )
    if (hasEmailAccount) {
      throw new BadRequestException(
        "You already have an account, please to do login",
      )
    }

    try {
      await prisma.$transaction(async (ctx) => {
        const passwordHash = await passwordToHash(password)
        await ctx.user.update({
          where: { id: userExists.id },
          data: {
            password: passwordHash,
          },
        })
        await ctx.account.create({
          data: {
            provider: AuthProviders.EMAIL,
            providerId: email,
            userId: userExists.id,
          },
        })
      })

      return { message: "Registered successfully" }
    } catch (error) {
      if (env.NODE_ENV !== "test") {
        logger.error("Error to create email account", error)
      }
      throw new BadRequestException(
        "Oh no, something went wrong while trying to register your account, please try again later",
      )
    }
  }

  try {
    await prisma.$transaction(async (ctx) => {
      const passwordHash = await passwordToHash(password)
      const user = await ctx.user.create({
        data: {
          userName,
          email,
          password: passwordHash,
        },
      })
      await ctx.account.create({
        data: {
          provider: AuthProviders.EMAIL,
          providerId: email,
          userId: user.id,
        },
      })
      const code = genRandomCode()
      await ctx.code.create({
        data: {
          userId: user.id,
          code,
          type: Codes.EMAIL_VERIFY,
        },
      })
      const url = `${env.APP_ORIGEM}/confirm-account?code=${code}`

      if (env.NODE_ENV !== "test") {
        const ok = await rmqMessageService.publishInQueue(
          EmailMethods.SEND_EMAIL_VERIFY,
          JSON.stringify({
            email,
            url,
          }),
        )

        if (ok) logger.info(`Message publish on [confirm-email] queue`)
        if (!ok)
          logger.error(`Error to publish message on [confirm-email] queue`)
      }
    })

    return { message: "Please check your email box and confirm account" }
  } catch (error) {
    if (env.NODE_ENV !== "test") {
      logger.error("Error to create email account", error)
    }
    throw new BadRequestException(
      "Oh no, something went wrong while trying to register your account, please try again later",
    )
  }
}
