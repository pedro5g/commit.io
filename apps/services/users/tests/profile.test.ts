import { describe, it } from "node:test"
import {
  AuthProviders,
  NotFoundException,
  passwordToHash,
  prisma,
} from "@commit.oi/shared"
import assert from "node:assert"
import { profileService } from "../src/models/services/profile-service"

describe("[Profile service] tests", () => {
  it("Should be able to get user with current account infos", async () => {
    assert(profileService)
    const testData = {
      userName: "jhon doe",
      email: "email7@gmail.com",
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
    const user = await prisma.user.findUnique({
      where: {
        email: testData.email,
      },
    })

    assert(user)

    const { userAccount } = await profileService({
      userId: user.id,
      accountProvider: "EMAIL",
    })

    assert(userAccount)
    assert(userAccount.user)
    assert(userAccount.account)
    assert.strictEqual(userAccount.account.provider, "EMAIL")
  })

  it("Should not be able to get user and current account with id don't exists", async () => {
    const error = await profileService({
      userId: "fake_id",
      accountProvider: "EMAIL",
    }).catch((error) => error)
    assert(error)
    assert.strictEqual(error instanceof NotFoundException, true)
    assert.strictEqual(error.message, "User not found")
  })
})
