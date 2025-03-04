import { cookieParser, cors, env, express, logger } from "@commit.oi/shared"

const { USER_PORT, APP_ORIGEM, NODE_ENV } = env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: APP_ORIGEM, credentials: true }))
app.use(cookieParser())

app.listen(USER_PORT, () => {
  logger.info(`User server is running at PORT ${USER_PORT} on ${NODE_ENV} mode 🚀🚀`)
})
