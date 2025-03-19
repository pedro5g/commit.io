import { describe, it } from "node:test"
import { registerUserByEmailService } from "../src/models/services/register-user-by-email-service"
import { BadRequestException, Codes, prisma } from "@commit.oi/shared"
import { confirmEmailService } from "../src/models/services/confirm-email-service"
import assert from "node:assert"
import "./test-setup"
describe("[Confirm email service] tests", () => {
  it("Should be able to verify email", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email@gmail.com",
      password: "test_123",
    }

    await registerUserByEmailService(testData)

    let userOnDatabase = await prisma.user.findUnique({
      where: {
        email: testData.email,
      },
    })

    let verifyCode = await prisma.code.findFirst({
      where: {
        userId: userOnDatabase?.id,
        type: Codes.EMAIL_VERIFY,
      },
    })

    const response = await confirmEmailService({
      code: verifyCode?.code as string,
    })

    assert(response)
    assert.deepStrictEqual(response, {
      message: "Email confirmed successfully",
    })

    userOnDatabase = await prisma.user.findUnique({
      where: {
        email: testData.email,
      },
    })
    verifyCode = await prisma.code.findFirst({
      where: {
        userId: userOnDatabase?.id,
        type: Codes.EMAIL_VERIFY,
      },
    })

    assert.strictEqual(userOnDatabase?.isEmailVerified, true)
    assert.strictEqual(verifyCode, null)
  })

  it("Should not be able reuse a verify code", async () => {
    const testData = {
      userName: "jhon doe",
      email: "email1@gmail.com",
      password: "test_123",
    }

    await registerUserByEmailService(testData)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: testData.email,
      },
    })

    const verifyCode = await prisma.code.findFirst({
      where: {
        userId: userOnDatabase?.id,
        type: Codes.EMAIL_VERIFY,
      },
    })

    await confirmEmailService({
      code: verifyCode?.code as string,
    })

    const error = await confirmEmailService({
      code: verifyCode?.code as string,
    }).catch((err) => err)

    assert.partialDeepStrictEqual(
      error,
      new BadRequestException("Email already verified"),
    )
  })
})
