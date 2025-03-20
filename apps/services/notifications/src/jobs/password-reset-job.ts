import { EmailMethods, logger, RMQMessagesService } from "@commit.oi/shared"
import { passwordResetService } from "../services"

export const passwordResetJob = async (messageService: RMQMessagesService) => {
  await messageService.assertQueue(EmailMethods.SEND_PASSWORD_RESET, {
    durable: true,
  })

  await messageService.consume(
    EmailMethods.SEND_PASSWORD_RESET,
    async (message) => {
      const { email, url } = JSON.parse(message.content.toString()) as {
        email: string
        url: string
      }

      await passwordResetService({ email, url })
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
