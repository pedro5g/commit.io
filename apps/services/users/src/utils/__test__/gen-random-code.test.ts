import test, { describe } from "node:test"
import { genRandomCode } from "../index"
import assert from "node:assert"

describe("[GenRandomCode]", () => {
  test("should be generate unique code with 10 length without symbols", () => {
    assert(genRandomCode)
    assert.equal(genRandomCode().length, 10)
    assert.equal(genRandomCode().split("-").length, 1)
  })
})
