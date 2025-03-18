import { sendEmail } from "../mail"
import { verifyEmailTemplate } from "../templates"

export const confirmEmailService = async ({
  email,
  url,
}: {
  email: string
  url: string
}) => {
  await sendEmail({
    to: email,
    ...verifyEmailTemplate(url),
  })
}
