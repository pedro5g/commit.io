import { describe, it } from "node:test"
import {
  AuthProviders,
  BadRequestException,
  Codes,
  ErrorCode,
  HTTP_STATUS,
  HttpException,
  NotFoundException,
  prisma,
} from "@commit.oi/shared"
import { passwordForgetService } from "../src/models/services/password-forget-service"
import assert from "node:assert"
import "./test-setup"

describe("[Password forget services] tests", () => {
  it("Should be able to create a reset password code", async () => {
    assert(passwordForgetService)
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

    const response = await passwordForgetService({ email: testData.email })
    assert.deepStrictEqual(response, {
      message: "Check your email box and reset your password",
    })

    const resetCode = await prisma.code.findFirst({
      where: {
        type: Codes.RESET_PASSWORD,
        userId: user.id,
      },
    })

    assert(resetCode)
    assert.strictEqual(resetCode.type, Codes.RESET_PASSWORD)
  })
  it("Should not be able to request to many reset password", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email2@gmail.com",
      password: "test_123",
    }
    await prisma.$transaction(async (ctx) => {
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
    })

    await passwordForgetService({ email: testData.email })
    await passwordForgetService({ email: testData.email })
    await passwordForgetService({ email: testData.email })
    const error = await passwordForgetService({ email: testData.email }).catch(
      (err) => err,
    )

    assert.partialDeepStrictEqual(
      error,
      new HttpException(
        "Too many request, try again later",
        HTTP_STATUS.TOO_MANY_REQUESTS,
        ErrorCode.AUTH_TOO_MANY_ATTEMPTS,
      ),
    )
  })

  it("Should not be able to request reset password if email is not verified", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email3@gmail.com",
      password: "test_123",
    }
    const user = await prisma.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          userName: testData.userName,
          email: testData.email,
          password: testData.password,
          isEmailVerified: false,
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

    const error = await passwordForgetService({ email: testData.email }).catch(
      (err) => err,
    )
    assert.partialDeepStrictEqual(
      error,
      new BadRequestException(
        "Please check your email box and confirm account",
      ),
    )

    const resetCode = await prisma.code.findFirst({
      where: {
        type: Codes.RESET_PASSWORD,
        userId: user.id,
      },
    })

    assert.strictEqual(resetCode, null)
  })

  it("Should not be able to request reset password, if user don't have email account", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email4@gmail.com",
      password: "test_123",
    }
    const user = await prisma.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          userName: testData.userName,
          email: testData.email,
          isEmailVerified: false,
        },
      })
      await ctx.account.create({
        data: {
          provider: AuthProviders.GOOGLE,
          providerId: testData.email,
          userId: user.id,
        },
      })
      return user
    })

    const error = await passwordForgetService({ email: testData.email }).catch(
      (err) => err,
    )
    assert.partialDeepStrictEqual(
      error,
      new BadRequestException("Use social login"),
    )

    const resetCode = await prisma.code.findFirst({
      where: {
        type: Codes.RESET_PASSWORD,
        userId: user.id,
      },
    })

    assert.strictEqual(resetCode, null)
  })

  it("Should not be able to request reset password with invalid email", async () => {
    const error = await passwordForgetService({
      email: "fake_email",
    }).catch((err) => err)
    assert.partialDeepStrictEqual(
      error,
      new NotFoundException("User not found"),
    )
  })
})
