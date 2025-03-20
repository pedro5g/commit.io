import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { passwordForgetSchema } from "../../validators"
import { passwordForgetService } from "../services/password-forget-service"

export const passwordForgetController = asyncHandler(async (req, res) => {
  const { email } = passwordForgetSchema.parse(req.body)

  const { message } = await passwordForgetService({ email })

  res.status(HTTP_STATUS.OK).json({
    ok: true,
    message,
  })
})
