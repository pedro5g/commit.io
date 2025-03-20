import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { resetPasswordSchema } from "../../validators"
import { resetPasswordService } from "../services/reset-password-service"

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { code, password } = resetPasswordSchema.parse(req.body)

  const { message } = await resetPasswordService({ code, password })

  res.status(HTTP_STATUS.OK).json({
    ok: true,
    message,
  })
})
