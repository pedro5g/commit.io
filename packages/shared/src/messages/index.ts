import { Channel, connect, ChannelModel, Message } from "amqplib"
import { retry, RetryConfig } from "./lib"

export class RMQMessagesService {
  private connection!: ChannelModel
  public channel!: Channel

  constructor(private readonly uri: string) {}

  async start(): Promise<void> {
    this.connection = await connect(this.uri)
    this.channel = await this.connection.createChannel()
  }

  async disconnect(): Promise<void> {
    this.connection.close()
  }

  async publishInQueue(queue: string, message: string, opts?: object) {
    return this.channel.sendToQueue(queue, Buffer.from(message), opts)
  }

  async assertQueue(queue: string, opts?: object) {
    return this.channel.assertQueue(queue, opts)
  }

  async deleteQueue(queue: string) {
    await this.deleteQueue(queue)
  }

  async consume(
    queue: string,
    callback: (message: Message) => Promise<void>,
    config: RetryConfig,
  ) {
    retry(this.channel, config)
    this.channel.consume(queue, async (message) => {
      if (!message) return
      await callback(message)
    })
  }
}
