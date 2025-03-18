import { Channel, Options } from "amqplib"

interface DelayOpts {
  separator: string
  prefix: string
  threshold: number
  round: number
}

const DEFAULT_OPTS: DelayOpts = {
  separator: ".",
  prefix: "delay",
  threshold: 10000,
  round: 1000,
}

declare module "amqplib" {
  export interface Channel {
    delay: (delayMs: number) => {
      publish: (
        exchange: string,
        routingKey: string,
        content: Buffer<ArrayBufferLike>,
        options?: Options.Publish,
      ) => Promise<boolean>
    }
  }
}

/**
 * @description fanout - sending the message all queue bided it
 */
const EXCHANGE_TYPE = "fanout"

export const delay = (channel: Channel, opts: DelayOpts = DEFAULT_OPTS) => {
  channel.delay = function (delayMs: number) {
    return {
      publish: async function (exchange, routingKey, content, options) {
        delayMs = Math.ceil(delayMs / opts.round) * opts.round

        const ttl = delayMs
        const time = {
          ms: 1000,
          s: 60,
          m: 60,
          h: 24,
          d: 30,
          mo: 12,
          y: 999999,
        }

        type TimeKeys = keyof typeof time

        const delayMsStr = Object.keys(time)
          .map((unit) => {
            const mod = delayMs % time[unit as TimeKeys]
            delayMs = Math.floor(delayMs / time[unit as TimeKeys])
            if (mod === 0) return ""
            return mod + unit
          })
          .reverse()
          .join("")

        const name = [opts.prefix, exchange, delayMsStr].join(opts.separator)

        return channel
          .assertExchange(name, EXCHANGE_TYPE, {
            durable: true,
            autoDelete: true,
          })
          .then(() => {
            return channel.assertQueue(name, {
              durable: true,
              autoDelete: true,
              arguments: {
                "x-dead-letter-exchange": exchange,
                "x-message-ttl": ttl,
                "x-expires": ttl + opts.threshold,
              },
            })
          })
          .then(() => {
            return channel.bindQueue(name, name, "#")
          })
          .then(() => {
            return channel.publish(name, routingKey, content, options)
          })
      },
    }
  }
}
