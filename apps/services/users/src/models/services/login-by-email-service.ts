import {
  BadRequestException,
  comparePasswords,
  prisma,
  refreshTokenSignOptions,
  signJwtToken,
  logger,
} from "@commit.oi/shared"
import { LoginByEmailDTO } from "../dtos/register-user-by-email-dto"
import { AccountQuery } from "../types/account"
import { messageServer } from "../.."

export const loginByEmailService = async ({
  email,
  password,
}: LoginByEmailDTO) => {
  const [account] = await prisma.$queryRawUnsafe<AccountQuery[]>(
    `
    SELECT  a."id" AS "accountId", a."email", a."avatar_url", 
    a."is_email_verified", a."provider", a."password", a."user_id",
    u."id", u."user_name", u."bio"  
    FROM "accounts" AS a JOIN "users" AS u ON a."user_id" = u."id" 
    WHERE a."email" = $1 LIMIT 1;
  `,
    email,
  )

  if (!account) {
    throw new BadRequestException("Invalid email or password")
  }

  if (!account.is_email_verified) {
    const ok = await messageServer.publishInQueue(
      "confirm-email",
      account.email,
    )

    if (ok) logger.info(`Message publish on [confirm-email] queue`)
    if (!ok) logger.error(`Error to publish message on [confirm-email] queue`)

    throw new BadRequestException(
      "Please check your email box and confirm account",
    )
  }

  if (!account.password) {
    throw new BadRequestException(
      `Please login with ${account.provider} provider`,
    )
  }

  const passwordMatch = comparePasswords(password, account.password)

  if (!passwordMatch) {
    throw new BadRequestException("Invalid email or password")
  }

  const accessToken = signJwtToken({
    userId: account.accountId,
  })
  const refreshToken = signJwtToken(
    {
      userId: account.accountId,
    },
    refreshTokenSignOptions,
  )

  return {
    userAccount: {
      user: {
        id: account.id,
        userName: account.user_name,
        bio: account.bio,
      },
      account: {
        id: account.accountId,
        email: account.email,
        avatarUrl: account.avatar_url,
        isEmailVerified: account.is_email_verified,
        provider: account.provider,
      },
    },
    accessToken,
    refreshToken,
  }
}
