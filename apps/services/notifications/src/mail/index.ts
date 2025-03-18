import { env } from "@commit.oi/shared"
import { Resend } from "resend"

export const resend = new Resend(env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  text: string
  html: string
  from?: string
}

const mailer_sender =
  env.NODE_ENV === "dev" ? `no-reply <onboarding@resend.dev>` : `no-reply <>`

export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = mailer_sender,
}: SendEmailParams) {
  return new Promise(async (resolver, reject) => {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      text,
      subject,
      html,
    })

    if (error) {
      return reject(error)
    }
    return resolver(data)
  })
}
