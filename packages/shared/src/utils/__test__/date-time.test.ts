import assert from "node:assert"
import { describe, test } from "node:test"
import { add, minutesAgo, minutesFromNow } from "../date-time"

describe("[DATE TIME] unite test date functions", () => {
  test("[add]", () => {
    assert(add)

    let sut = new Date()
    let time = sut.getTime()

    assert.strictEqual(
      new Date(time).setMilliseconds(new Date(time).getMilliseconds() + 1000),
      add(sut, { milliseconds: 1000 }).getTime(),
    )
    sut = new Date()
    time = sut.getTime()
    assert.strictEqual(
      new Date(time).setSeconds(new Date(time).getSeconds() + 10),
      add(sut, { seconds: 10 }).getTime(),
    )
    sut = new Date()
    time = sut.getTime()
    assert.strictEqual(
      new Date(time).setMinutes(new Date(time).getMinutes() + 30),
      add(sut, { minutes: 30 }).getTime(),
    )
    sut = new Date()
    time = sut.getTime()
    assert.strictEqual(
      new Date(time).setHours(new Date(time).getHours() + 5),
      add(sut, { hours: 5 }).getTime(),
    )
    sut = new Date()
    time = sut.getTime()
    assert.strictEqual(
      new Date(time).setDate(new Date(time).getDate() + 10),
      add(sut, { days: 10 }).getTime(),
    )
    sut = new Date()
    time = sut.getTime()
    assert.strictEqual(
      new Date(time).setMonth(new Date(time).getMonth() + 6),
      add(sut, { months: 6 }).getTime(),
    )
    sut = new Date()
    time = sut.getTime()
    assert.strictEqual(
      new Date(time).setFullYear(new Date(time).getFullYear() + 2),
      add(sut, { years: 2 }).getTime(),
    )
  })
  test("[minutesFromNow]", () => {
    assert(minutesFromNow)
    const now = new Date()

    now.setMinutes(now.getMinutes() + 120)
    assert.strictEqual(now.getMinutes(), minutesFromNow(120).getMinutes())
  })

  test("[minutesAgo]", () => {
    assert(minutesAgo)
    const now = new Date()

    now.setMinutes(now.getMinutes() - 120)
    assert.strictEqual(now.getMinutes(), minutesAgo(120).getMinutes())
  })
})
