import { Router, isAuthenticated } from "@commit.oi/shared"
import { registerUserByEmailController } from "../models/controllers/register-user-by-email-controller"
import { loginByEmailController } from "../models/controllers/login-by-email-controller"
import { confirmEmailController } from "../models/controllers/confirm-email-controller"
import { passwordForgetController } from "../models/controllers/password-forget-controller"
import { resetPasswordController } from "../models/controllers/reset-password-controller"
import { refreshController } from "../models/controllers/refresh-controller"
import { profileController } from "../models/controllers/profile-controller"
import { updateUserProfileController } from "../models/controllers/update-user-profile-controller"
import { logOutController } from "../models/controllers/log-out-controller"

const userRoutes = Router()

userRoutes.post("/register/email", registerUserByEmailController)
userRoutes.post("/login", loginByEmailController)
userRoutes.get("/auth/refresh", refreshController)
userRoutes.put("/verify/email", confirmEmailController)
userRoutes.patch("/password-forget", passwordForgetController)
userRoutes.patch("/reset-password", resetPasswordController)
userRoutes.get("/log-out", isAuthenticated, logOutController)

userRoutes.get("/profile", isAuthenticated, profileController)
userRoutes.put("/profile/update", isAuthenticated, updateUserProfileController)

export { userRoutes }
