import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { loginByEmailSchema } from "../../validators"
import { loginByEmailService } from "../services/login-by-email-service"

export const loginByEmailController = asyncHandler(async (req, res) => {
  const { email, password } = loginByEmailSchema.parse(req.body)

  const { userAccount, accessToken, refreshToken } = await loginByEmailService({
    email,
    password,
  })

  res
    .setAuthCookies({ accessToken, refreshToken })
    .status(HTTP_STATUS.OK)
    .json({
      message: "User logged successfully",
      userAccount,
    })
})
