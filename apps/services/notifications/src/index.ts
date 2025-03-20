import { env, logger, RMQMessagesService } from "@commit.oi/shared"
import { emailVerifyJob, passwordResetJob } from "./jobs"
;(async () => {
  const rmqMessageService = new RMQMessagesService(env.RABBITMQ_CONNECTION_URL)
  await rmqMessageService.start()
  await Promise.all([
    emailVerifyJob(rmqMessageService),
    passwordResetJob(rmqMessageService),
  ])

  logger.info("Notification service is on")
})()
