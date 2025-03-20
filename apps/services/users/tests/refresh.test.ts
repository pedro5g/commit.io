import { describe, it } from "node:test"
import {
  AuthProviders,
  passwordToHash,
  prisma,
  refreshTokenSignOptions,
  signJwtToken,
  UnauthorizedException,
} from "@commit.oi/shared"
import { loginByEmailService } from "../src/models/services/login-by-email-service"
import assert from "node:assert"
import { refreshService } from "../src/models/services/refresh-service"
import "./test-setup"
describe("[Refresh service] tests", () => {
  it("Should be able to create a new assessToken and refreshToken if refreshToken is valid", async () => {
    assert(refreshService)
    const testData = {
      userName: "jhon doe",
      email: "email@gmail.com",
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
      email: "email@gmail.com",
      password: "test_123",
    })

    assert(response)

    const result = await refreshService({ refreshToken: response.refreshToken })
    assert(result)
    assert(result.accessToken)
    assert(result.newRefreshToken)
  })

  it("Should not be able to request new assessToken and refreshToken with a invalid refreshToken", async () => {
    const invalidRefreshToken = signJwtToken(
      { userId: "fake_id" },
      { ...refreshTokenSignOptions, expiresIn: "1Millisecond" },
    )

    await new Promise<void>((res) => setTimeout(res, 200))

    const error = await await refreshService({
      refreshToken: invalidRefreshToken,
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new UnauthorizedException("Invalid refresh token"),
    )
  })
})
