import { env, RMQMessagesService } from "@commit.oi/shared"

export const rmqMessageService = new RMQMessagesService(
  env.RABBITMQ_CONNECTION_URL,
)
