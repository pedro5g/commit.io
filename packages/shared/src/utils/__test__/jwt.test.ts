import assert from "node:assert"
import test, { describe } from "node:test"
import { signJwtToken, verifyJwtToken } from "../jwt"

const isString = (value: unknown) => {
  return Boolean(value && Object.prototype.toString.call(value) === "[object String]")
}

describe("[JWT] unite test jwt functions", () => {
  test("[signJwtToken]", () => {
    assert(signJwtToken)
    const token = signJwtToken({ userId: "fake_user_id" })

    assert.equal(isString(token), true)

    const jwtParts = token.split(".")
    assert.equal(jwtParts.length, 3)

    const [, payload] = jwtParts

    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))

    assert.strictEqual(decodedPayload.userId, "fake_user_id")
  })

  test("[verifyJwtToken]", () => {
    assert(verifyJwtToken)
    const token = signJwtToken({ userId: "fake_user_id" })

    const { payload } = verifyJwtToken(token)
    assert(payload?.userId)
    assert(payload.userId, "fake_user_id")
  })
})
