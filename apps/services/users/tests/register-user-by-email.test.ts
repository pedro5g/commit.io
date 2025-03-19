import { describe, it } from "node:test"
import { registerUserByEmailService } from "../src/models/services/register-user-by-email-service"
import assert from "node:assert"
import {
  AuthProviders,
  BadRequestException,
  Codes,
  prisma,
} from "@commit.oi/shared"
import "./test-setup"

describe("[Register user by email service] tests", () => {
  it("Should be able to register new account with email provider", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email@gmail.com",
      password: "test_123",
    }

    assert(registerUserByEmailService)

    const response = await registerUserByEmailService(testData)

    assert.deepStrictEqual(response, {
      message: "Please check your email box and confirm account",
    })

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: testData.email,
      },
    })

    assert(userOnDatabase)
    assert(userOnDatabase.password)
    assert.strictEqual(userOnDatabase.password?.split(".").length, 2)

    const accountOnDataBase = await prisma.account.findFirst({
      where: {
        userId: userOnDatabase.id,
        provider: AuthProviders.EMAIL,
      },
    })

    assert(accountOnDataBase)
    assert.strictEqual(accountOnDataBase.provider, AuthProviders.EMAIL)

    const verifyCode = await prisma.code.findFirst({
      where: {
        userId: userOnDatabase.id,
        type: Codes.EMAIL_VERIFY,
      },
    })

    assert(verifyCode)
    assert.strictEqual(verifyCode.code.length, 10)
  })

  it("Should not be able to register account with same email", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email@gmail.com",
      password: "test_123",
    }

    const error = await registerUserByEmailService(testData).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new BadRequestException(
        "You already have an account, please to do login",
      ),
    )
  })

  it("Should be able to create an account with email and update password in user, if user already exists but with another provider", async () => {
    const userData = { userName: "jhon due 2", email: "email2@gmail.com" }

    const user = await prisma.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          userName: userData.userName,
          email: userData.email,
        },
      })
      await ctx.account.create({
        data: {
          provider: AuthProviders.GOOGLE,
          providerId: "lajsfdklajfklajlk",
          userId: user.id,
        },
      })

      return user
    })

    assert(user)
    assert.strictEqual(user.password, null)

    const result = await registerUserByEmailService({
      ...userData,
      password: "test_123",
    })

    assert.deepStrictEqual(result, { message: "Registered successfully" })

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    })

    assert(userOnDatabase)
    assert(userOnDatabase.password)
    assert.strictEqual(userOnDatabase.password?.split(".").length, 2)

    const accountOnDataBase = await prisma.account.findFirst({
      where: {
        userId: userOnDatabase.id,
        provider: AuthProviders.EMAIL,
      },
    })

    assert(accountOnDataBase)
    assert.strictEqual(accountOnDataBase.provider, AuthProviders.EMAIL)

    const verifyCode = await prisma.code.findFirst({
      where: {
        userId: userOnDatabase.id,
        type: Codes.EMAIL_VERIFY,
      },
    })

    assert.strictEqual(verifyCode, null)
  })
})
