import { asyncHandler } from "@commit.oi/shared/src";
import { env } from "@commit.oi/shared/src";
import { logger } from "@commit.oi/shared/src";
import { express } from "@commit.oi/shared/src";

const app = express();

app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ message: "Server is running " });
  })
);

const PORT = env.USER_PORT;

app.listen(PORT, () => {
  logger.info(`User server is running at PORT ${PORT} 🚀🚀`);
});
