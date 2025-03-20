import { sendEmail } from "../mail"
import { passwordResetTemplate } from "../templates"

export const passwordResetService = async ({
  email,
  url,
}: {
  email: string
  url: string
}) => {
  await sendEmail({
    to: email,
    ...passwordResetTemplate(url),
  })
}
