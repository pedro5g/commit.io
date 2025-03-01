import { asyncHandler, env, express, logger } from "@commit.oi/shared"
const app = express()

app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ message: "Server is running " })
  }),
)

const PORT = env.USER_PORT

app.listen(PORT, () => {
  logger.info(`User server is running at PORT ${PORT} 🚀🚀`)
})
