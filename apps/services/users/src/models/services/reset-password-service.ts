import {
  BadRequestException,
  Codes,
  env,
  logger,
  NotFoundException,
  passwordToHash,
  prisma,
} from "@commit.oi/shared"
import { ResetPasswordDTO } from "../dtos/password-forget-dto"

export const resetPasswordService = async ({
  password,
  code,
}: ResetPasswordDTO) => {
  const resetCode = await prisma.code.findUnique({
    where: { code, type: Codes.RESET_PASSWORD, expiresAt: { gt: new Date() } },
  })

  if (!resetCode) {
    throw new NotFoundException("Invalid or expired verification code")
  }

  try {
    await prisma.$transaction(async (ctx) => {
      const passwordHash = await passwordToHash(password)

      await ctx.user.update({
        where: {
          id: resetCode.userId,
        },
        data: {
          password: passwordHash,
        },
      })
      await ctx.code.deleteMany({
        where: {
          userId: resetCode.userId,
          type: Codes.RESET_PASSWORD,
        },
      })
    })
    return { message: "Password redefined successfully" }
  } catch (e) {
    if (env.NODE_ENV !== "test") logger.error("Error to try reset password", e)
    throw new BadRequestException("Error reset password, please try again late")
  }
}
