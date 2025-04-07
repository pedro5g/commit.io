import { describe, it } from "node:test"
import {
  AuthProviders,
  NotFoundException,
  passwordToHash,
  prisma,
} from "@commit.oi/shared"
import assert from "node:assert"
import { profileService } from "../src/models/services/profile-service"
import "./test-setup"
import { updateUserProfileService } from "../src/models/services/update-user-profile"

describe("[Update user profile service] tests", () => {
  it("Should be able to update user profile", async () => {
    assert(profileService)
    const testData = {
      userName: "jhon doe",
      email: "email8@gmail.com",
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
    assert.strictEqual(user.bio, null)

    const { userUpdated } = await updateUserProfileService({
      id: user.id,
      userName: "name_updated",
      bio: "bio_updated",
    })

    assert(userUpdated)
    assert(userUpdated.bio)
    assert.strictEqual(userUpdated.bio, "bio_updated")
    assert.strictEqual(userUpdated.userName, "name_updated")
  })

  it("Should not be able to updated with invalid id", async () => {
    const error = await updateUserProfileService({
      id: "fake_id",
      userName: "name_updated",
      bio: "bio_updated",
    }).catch((error) => error)

    assert(error)
    assert.strictEqual(error instanceof NotFoundException, true)
    assert.strictEqual(error.message, "User not found")
  })
})
