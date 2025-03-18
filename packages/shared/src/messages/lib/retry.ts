import { Channel, Message, Options } from "amqplib"
import { delay } from "./delay"

declare module "amqplib" {
  export interface Channel {
    retry: (msg: Message, error: unknown) => Promise<void>
  }
}

export interface RetryConfig {
  initialDelay: number
  maxRetries: number
  separator: string
  onFailed: (error?: unknown) => void
}

const DEFAULTS: RetryConfig = {
  initialDelay: 5000,
  maxRetries: 5,
  separator: "-",
  onFailed: () => void 0,
}

/**
 * @description fanout - sending the message all queue bided it
 */
const EXCHANGE_TYPE = "fanout"

export const retry = (channel: Channel, config: RetryConfig = DEFAULTS) => {
  delay(channel, {
    prefix: "delayed",
    separator: config.separator,
    threshold: 10000,
    round: 1000,
  })

  // mocking path
  // get original consume function with original context
  const _originalConsume = channel.consume.bind(channel)

  channel.consume = async function (queue: string, onMessage, options) {
    const retryExchange = `retry${config.separator}${queue}`
    await channel.assertExchange(retryExchange, EXCHANGE_TYPE, {
      durable: true,
    })
    await channel.bindQueue(queue, retryExchange, "#")

    async function _retry(
      msg: Message,
      retryCount: number,
      properties: object,
    ) {
      const delayAmount = Math.pow(2, retryCount - 1) * config.initialDelay
      return await channel
        .delay(delayAmount)
        .publish(retryExchange, msg.fields.routingKey, msg.content, properties)
    }

    async function attemptRetry(msg: Message, error: unknown) {
      try {
        const headers = msg.properties.headers || {}
        const retryCount = (headers["x-retries"] || 0) + 1
        console.log("x-retries", headers["x-retries"])
        if (retryCount >= config.maxRetries) {
          channel.reject(msg, false)
          config.onFailed(error)
        } else {
          console.log("retryCount", retryCount)
          headers["x-retries"] = retryCount
          const updatedProperties: Options.Publish = {
            ...msg.properties,
            headers,
          }
          await _retry(msg, retryCount, updatedProperties)
          channel.ack(msg)
        }
      } catch (error) {
        channel.nack(msg)
        throw error
      }
    }
    channel.retry = attemptRetry

    return _originalConsume(
      queue,
      async (msg) => {
        if (!msg) {
          return Promise.reject(
            new Error("Broker cancelled the consumer remotely"),
          )
        }
        try {
          await onMessage(msg)
          channel.ack(msg)
        } catch (err) {
          await attemptRetry(msg, err)
        }
      },
      options,
    )
  }
  return channel
}
