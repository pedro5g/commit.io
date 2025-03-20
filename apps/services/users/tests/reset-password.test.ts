import assert from "node:assert"
import { describe, it } from "node:test"
import { resetPasswordService } from "../src/models/services/reset-password-service"
import {
  AuthProviders,
  Codes,
  comparePasswords,
  minutesAgo,
  NotFoundException,
  prisma,
} from "@commit.oi/shared"
import { passwordForgetService } from "../src/models/services/password-forget-service"
import { genRandomCode } from "../src/utils"
import "./test-setup"

describe("[Reset password service] tests", () => {
  it("Should be able reset password", async () => {
    assert(resetPasswordService)
    const testData = {
      userName: "jhon doe",
      email: "email@gmail.com",
      password: "test_123",
    }
    const user = await prisma.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          userName: testData.userName,
          email: testData.email,
          password: testData.password,
          isEmailVerified: true,
        },
      })
      await ctx.account.create({
        data: {
          provider: AuthProviders.EMAIL,
          providerId: testData.email,
          userId: user.id,
        },
      })

      return user
    })

    await passwordForgetService({ email: testData.email })

    let resetCode = await prisma.code.findFirst({
      where: {
        type: Codes.RESET_PASSWORD,
        userId: user.id,
      },
    })

    assert(resetCode)
    const response = await resetPasswordService({
      code: resetCode.code,
      password: "new_password",
    })

    assert.deepStrictEqual(response, {
      message: "Password redefined successfully",
    })

    resetCode = await prisma.code.findFirst({
      where: {
        type: Codes.RESET_PASSWORD,
        userId: user.id,
      },
    })

    assert.strictEqual(resetCode, null)

    const updatedUser = await prisma.user.findUnique({
      where: { email: testData.email },
    })

    assert(updatedUser)
    assert(updatedUser.password)
    const wasMatch = await comparePasswords(
      "new_password",
      updatedUser.password,
    )
    assert.strictEqual(wasMatch, true)
  })

  it("Should not be able reset password with invalid code", async () => {
    let error = await resetPasswordService({
      code: "fake_code",
      password: "new_password",
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new NotFoundException("Invalid or expired verification code"),
    )

    const testData = {
      userName: "jhon doe",
      email: "email2@gmail.com",
      password: "test_123",
    }
    const user = await prisma.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          userName: testData.userName,
          email: testData.email,
          password: testData.password,
          isEmailVerified: true,
        },
      })
      await ctx.account.create({
        data: {
          provider: AuthProviders.EMAIL,
          providerId: testData.email,
          userId: user.id,
        },
      })

      return user
    })
    const code = await prisma.code.create({
      data: {
        userId: user.id,
        code: genRandomCode(),
        type: Codes.RESET_PASSWORD,
        expiresAt: minutesAgo(120), // 2h ago
      },
    })

    error = await resetPasswordService({
      code: code.code,
      password: "new_password",
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new NotFoundException("Invalid or expired verification code"),
    )
  })
})
