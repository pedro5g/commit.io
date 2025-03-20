import { Channel, connect, ChannelModel, Message } from "amqplib"
import { retry, RetryConfig } from "./lib"

export class RMQMessagesService {
  private connection!: ChannelModel
  public channels = new Map<string, Channel>()

  constructor(private readonly uri: string) {}

  async start(): Promise<void> {
    this.connection = await connect(this.uri)
  }

  async disconnect(): Promise<void> {
    this.connection.close()
  }

  async getChannel(queue: string, opts?: object) {
    if (!this.channels.has(queue)) {
      const channel = await this.connection.createChannel()
      await channel.assertQueue(queue, { ...opts, durable: true })
      this.channels.set(queue, channel)
    }
    return this.channels.get(queue) as Channel
  }

  async publishInQueue(queue: string, message: string, opts?: object) {
    const channel = await this.getChannel(queue)
    return channel.sendToQueue(queue, Buffer.from(message), opts)
  }

  async assertQueue(queue: string, opts?: object) {
    const channel = await this.getChannel(queue)
    return channel.assertQueue(queue, { ...opts, durable: true })
  }

  async deleteQueue(queue: string) {
    const channel = await this.getChannel(queue)
    await channel.deleteQueue(queue)
    this.channels.delete(queue)
  }

  async consume(
    queue: string,
    callback: (message: Message) => Promise<void>,
    config: RetryConfig,
  ) {
    const channel = await this.getChannel(queue)
    retry(channel, config)
    channel.consume(queue, async (message) => {
      if (!message) return
      await callback(message)
    })
  }
}
