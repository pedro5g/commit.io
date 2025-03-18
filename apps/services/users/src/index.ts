import {
  cookieParser,
  cors,
  env,
  express,
  globalErrorHandler,
  logger,
  RMQMessagesService,
} from "@commit.oi/shared"
import { userRoutes } from "./routes"
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "./utils"

declare global {
  namespace Express {
    export interface Response {
      setAuthCookies: (data: {
        accessToken: string
        refreshToken: string
      }) => express.Response
    }
  }
}

const { USER_PORT, APP_ORIGEM, NODE_ENV, PREFIX_URL } = env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: APP_ORIGEM, credentials: true }))
app.use(cookieParser())

app.use((req, res, next) => {
  res.setAuthCookies = ({ accessToken, refreshToken }) => {
    res
      .cookie("assessToken", accessToken, getAccessTokenCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())

    return res
  }
  next()
})
app.use(`${PREFIX_URL}/user`, userRoutes)

app.use(globalErrorHandler)

export const rmqMessageService = new RMQMessagesService(
  env.RABBITMQ_CONNECTION_URL,
)

app.listen(USER_PORT, async () => {
  await rmqMessageService.start()
  logger.info(
    `User server is running at PORT ${USER_PORT} on ${NODE_ENV} mode 🚀🚀`,
  )
})
