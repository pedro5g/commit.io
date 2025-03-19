import { describe, it } from "node:test"
import {
  AuthProviders,
  BadRequestException,
  passwordToHash,
  prisma,
} from "@commit.oi/shared"
import { loginByEmailService } from "../src/models/services/login-by-email-service"
import assert from "node:assert"
import "./test-setup"

describe("[Login by email service] tests", () => {
  it("Should be able to login with valid credentials", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email3@gmail.com",
      password: "test_123",
    }
    await prisma.$transaction(async (ctx) => {
      const passwordHash = await passwordToHash(testData.password)
      const user = await ctx.user.create({
        data: {
          userName: testData.userName,
          email: testData.email,
          password: passwordHash,
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

    const response = await loginByEmailService({
      email: "email3@gmail.com",
      password: "test_123",
    })

    assert(response)
    assert(response.userAccount)
    assert(response.accessToken)
    assert(response.refreshToken)
  })

  it("Should not be able to login with invalid credentials", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email4@gmail.com",
      password: "test_123",
    }
    await prisma.$transaction(async (ctx) => {
      const passwordHash = await passwordToHash(testData.password)
      const user = await ctx.user.create({
        data: {
          userName: testData.userName,
          email: testData.email,
          password: passwordHash,
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

    let error = await loginByEmailService({
      email: "fake@gmail.com",
      password: "test_123",
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new BadRequestException("Invalid email or password"),
    )

    error = await loginByEmailService({
      email: "email4@gmail.com",
      password: "incorrect_password",
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new BadRequestException("Invalid email or password"),
    )
  })

  it("Should not be able to login if email was not verified", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email5@gmail.com",
      password: "test_123",
    }
    await prisma.$transaction(async (ctx) => {
      const passwordHash = await passwordToHash(testData.password)
      const user = await ctx.user.create({
        data: {
          userName: testData.userName,
          email: testData.email,
          password: passwordHash,
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

    const error = await loginByEmailService({
      email: testData.email,
      password: testData.password,
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new BadRequestException(
        "Please check your email box and confirm account",
      ),
    )
  })

  it("Should not be able to login by email, if user only have another providers", async () => {
    const userData = { userName: "jhon due 2", email: "email2@gmail.com" }
    await prisma.$transaction(async (ctx) => {
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

    const error = await loginByEmailService({
      email: userData.email,
      password: "1234567",
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new BadRequestException(`Please use social login`),
    )
  })
})
