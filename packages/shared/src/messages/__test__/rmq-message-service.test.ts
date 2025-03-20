import { afterEach, beforeEach, describe, it } from "node:test"
import { RMQMessagesService } from ".."
import { env } from "shared/src/env"
import assert from "node:assert"

const QUEUE_NAME_TO_TEST = "test-queue"

let sut: RMQMessagesService

beforeEach(async () => {
  sut = new RMQMessagesService(env.RABBITMQ_CONNECTION_URL)
  await sut.start()
})
afterEach(async () => {
  await sut.disconnect()
})

describe("[AMQMessageService] unit tests", () => {
  it("should be able to init new instance of RMQMessageService", async () => {
    assert(sut)
  })

  it("should be able to assert queue", async () => {
    const { queue } = await sut.assertQueue(QUEUE_NAME_TO_TEST)
    assert.equal(queue, QUEUE_NAME_TO_TEST)
  })

  it("should be able to public message in queue", async () => {
    const wasSuccessfully = await sut.publishInQueue(
      QUEUE_NAME_TO_TEST,
      "message-test",
    )
    assert.equal(wasSuccessfully, true)
  })

  it("should be able to create one channel by queue", async () => {
    const queueNames = ["test-1", "test-2", "test-3"]

    assert.strictEqual(sut.channels.size, 0)

    await sut.assertQueue(queueNames[0])
    await sut.assertQueue(queueNames[1])
    await sut.assertQueue(queueNames[2])

    assert.strictEqual(sut.channels.size, 3)

    await sut.deleteQueue(queueNames[0])
    await sut.deleteQueue(queueNames[1])
    await sut.deleteQueue(queueNames[2])
  })

  it("should be able delete a channel", async () => {
    await sut.assertQueue("test-4")
    assert.strictEqual(sut.channels.size, 1)

    await sut.deleteQueue("test-4")
    assert.strictEqual(sut.channels.size, 0)
  })

  it("should be able to consume messages", async () => {
    const messages = [
      "test-1",
      "test-2",
      "test-3",
      "test-4",
      "test-5",
      "test-6",
      "test-7",
      "test-8",
      "test-9",
      "test-10",
      "test-11",
      "test-12",
      "test-13",
      "test-14",
      "test-15",
      "test-16",
      "test-17",
    ]

    await Promise.all(
      messages.map(async (msg) => sut.publishInQueue(QUEUE_NAME_TO_TEST, msg)),
    )

    const result: string[] = []
    await new Promise<void>(async (resolve) => {
      await sut.consume(
        QUEUE_NAME_TO_TEST,
        async (message) => {
          const content = message.content.toString()
          result.push(content)
          if (result.length === messages.length) {
            resolve()
          }
        },
        {
          initialDelay: 0,
          maxRetries: 0,
          separator: "-",
          onFailed(error) {},
        },
      )
    })

    await new Promise((res) => setTimeout(res, 500))

    assert.partialDeepStrictEqual(result, messages)
  })

  it("should retry failed messages with exponential backoff", async () => {
    await sut.publishInQueue(QUEUE_NAME_TO_TEST, "test")

    let receivedMessage = ""
    let retryAttempts = 0

    await new Promise<void>(async (resolve) => {
      await sut.consume(
        QUEUE_NAME_TO_TEST,
        async (msg) => {
          const content = msg.content.toString()
          retryAttempts++
          if (retryAttempts < 3) {
            assert.strictEqual(content, "")
            throw new Error("Simulated error")
          } else {
            receivedMessage = content
            resolve()
          }
        },
        {
          initialDelay: 1000,
          maxRetries: 3,
          separator: "-",
          onFailed: () => {},
        },
      )
    })

    await new Promise((res) => setTimeout(res, 500))
    assert.strictEqual(retryAttempts, 3)
    assert.strictEqual(receivedMessage, "test")
  })
})
