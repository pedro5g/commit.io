import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { confirmEmailSchema } from "../../validators"
import { confirmEmailService } from "../services/confirm-email-service"

export const confirmEmailController = asyncHandler(async (req, res) => {
  const { code } = confirmEmailSchema.parse(req.query)

  const { message } = await confirmEmailService({ code })

  res.status(HTTP_STATUS.OK).json({
    ok: true,
    message,
  })
})
