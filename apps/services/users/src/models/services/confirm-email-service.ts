import { BadRequestException, Codes, logger, prisma } from "@commit.oi/shared"
import { ConfirmEmailDTO } from "../dtos/confirm-email-dto"

export const confirmEmailService = async ({ code }: ConfirmEmailDTO) => {
  const verifyCode = await prisma.code.findUnique({
    where: { code, type: Codes.EMAIL_VERIFY },
  })

  if (!verifyCode) {
    throw new BadRequestException("Email already verified")
  }

  try {
    await prisma.$transaction(async (ctx) => {
      await ctx.user.update({
        where: { id: verifyCode.userId },
        data: { isEmailVerified: true },
      })
      await ctx.code.delete({
        where: {
          userId: verifyCode.userId,
          code: verifyCode.code,
          type: Codes.EMAIL_VERIFY,
        },
      })
    })
    return { message: "Email confirmed successfully" }
  } catch (e) {
    logger.error("Error verifying email", e)
    throw new BadRequestException(
      "Error verifying email, please try again later",
    )
  }
}
