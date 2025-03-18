import { EmailMethods, logger, RMQMessagesService } from "@commit.oi/shared"
import { confirmEmailService } from "../services/confirm-email-service"

export const emailVerifyJob = async (messageService: RMQMessagesService) => {
  await messageService.assertQueue(EmailMethods.SEND_EMAIL_VERIFY)

  await messageService.consume(
    EmailMethods.SEND_EMAIL_VERIFY,
    async (message) => {
      const { email, url } = JSON.parse(message.content.toString()) as {
        email: string
        url: string
      }

      await confirmEmailService({ email, url })
    },
    {
      initialDelay: 5000,
      maxRetries: 5,
      separator: "-",
      onFailed: (error) => {
        logger.error("error on sending verify email", error)
      },
    },
  )
}
