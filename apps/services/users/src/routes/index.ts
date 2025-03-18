import { Router } from "@commit.oi/shared"
import { registerUserByEmailController } from "../models/controllers/register-user-by-email-controller"
import { loginByEmailController } from "../models/controllers/login-by-email-controller"

const userRoutes = Router()

userRoutes.post("/register/email", registerUserByEmailController)
userRoutes.post("/login", loginByEmailController)

export { userRoutes }
