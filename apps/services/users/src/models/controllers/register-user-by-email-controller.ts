import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { registerByEmailSchema } from "../../validators"
import { registerUserByEmailService } from "../services/register-user-by-email-service"

export const registerUserByEmailController = asyncHandler(async (req, res) => {
  const { userName, email, password } = registerByEmailSchema.parse(req.body)

  const { message } = await registerUserByEmailService({
    userName,
    email,
    password,
  })

  res.status(HTTP_STATUS.CREATED).json({
    ok: true,
    message,
  })
})
