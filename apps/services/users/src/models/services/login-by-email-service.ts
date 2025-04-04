import {
  BadRequestException,
  comparePasswords,
  prisma,
  refreshTokenSignOptions,
  signJwtToken,
  logger,
  AuthProviders,
  Codes,
  env,
  EmailMethods,
} from "@commit.oi/shared"
import { LoginByEmailDTO } from "../dtos/register-user-by-email-dto"
import { genRandomCode } from "../../utils"
import { rmqMessageService } from "../../broker"

export const loginByEmailService = async ({
  email,
  password,
}: LoginByEmailDTO) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      userName: true,
      email: true,
      password: true,
      bio: true,
      isEmailVerified: true,
      accounts: {
        where: {
          provider: AuthProviders.EMAIL,
        },
        select: {
          id: true,
          provider: true,
          avatarUrl: true,
        },
      },
    },
  })

  if (!user) {
    throw new BadRequestException("Invalid email or password")
  }

  if (!user.password) {
    throw new BadRequestException(`Please use social login`)
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
    )
  }

  const passwordMatch = await comparePasswords(password, user.password)

  if (!passwordMatch) {
    throw new BadRequestException("Invalid email or password")
  }

  const accessToken = signJwtToken({
    userId: user.id,
    name: user.userName,
    email: user.email,
    accountProvider: "EMAIL",
  })
  const refreshToken = signJwtToken(
    {
      userId: user.id,
      accountProvider: "EMAIL",
    },
    refreshTokenSignOptions,
  )

  return {
    userAccount: {
      user: {
        id: user.id,
        userName: user.userName,
        bio: user.bio,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      account: {
        id: user.accounts[0].id,
        provider: user.accounts[0].provider,
        avatarUrl: user.accounts[0].avatarUrl,
      },
    },
    accessToken,
    refreshToken,
  }
}
