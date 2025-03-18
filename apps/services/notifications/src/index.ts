import { env, logger, RMQMessagesService } from "@commit.oi/shared"
import { emailVerifyJob } from "./jobs"
;(async () => {
  const rmqMessageService = new RMQMessagesService(env.RABBITMQ_CONNECTION_URL)
  await rmqMessageService.start()
  await emailVerifyJob(rmqMessageService)

  logger.info("Notification service is on")
})()
