import { describe, test } from "node:test"
import assert from "node:assert"
import { comparePasswords, passwordToHash } from "../hash"

describe("[HASH] unite test hasher functions", () => {
  test("[passwordToHash]", async () => {
    assert(passwordToHash)
    const password = "password_123456"
    /**
     * should be able to encrypt any text to hasher
     * and each hasher should not be equal
     */

    const passwordHasher1 = await passwordToHash(password)
    const passwordHasher2 = await passwordToHash(password)
    const passwordHasher3 = await passwordToHash(password)
    const passwordHasher4 = await passwordToHash(password)
    const passwordHasher5 = await passwordToHash(password)

    assert.notEqual(password, passwordHasher1)
    assert.notEqual(password, passwordHasher2)
    assert.notEqual(password, passwordHasher3)
    assert.notEqual(password, passwordHasher4)
    assert.notEqual(password, passwordHasher5)

    assert.notEqual(passwordHasher2, passwordHasher1)
    assert.notEqual(passwordHasher3, passwordHasher2)
    assert.notEqual(passwordHasher1, passwordHasher3)
    assert.notEqual(passwordHasher5, passwordHasher4)
    assert.notEqual(passwordHasher2, passwordHasher5)

    assert.strictEqual(passwordHasher1.split(".").length, 2)
  })

  test("[comparePassword]", async () => {
    const password = "password_123456"
    const passwordHasher1 = await passwordToHash(password)
    const passwordHasher2 = await passwordToHash(password)
    const passwordHasher3 = await passwordToHash(password)
    const passwordHasher4 = await passwordToHash(password)
    const passwordHasher5 = await passwordToHash(password)

    assert(comparePasswords)
    let match = await comparePasswords(password, passwordHasher1)
    assert.equal(match, true)
    match = await comparePasswords(password, passwordHasher2)
    assert.equal(match, true)
    match = await comparePasswords(password, passwordHasher3)
    assert.equal(match, true)
    match = await comparePasswords(password, passwordHasher4)
    assert.equal(match, true)
    match = await comparePasswords(password, passwordHasher5)
    assert.equal(match, true)

    match = await comparePasswords("incorrect_password", passwordHasher5)
    assert.equal(match, false)
  })
})
