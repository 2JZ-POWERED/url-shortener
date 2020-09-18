import express from 'express'
import bodyParser from 'body-parser'
import Promise from 'bluebird'
import { CronJob } from 'cron'
import cookieParser from 'cookie-parser'
import analyticsRoutes from './routes/AnalyticsRoutes'
import urlRoutes from './routes/UrlRoutes'
import userRoutes from './routes/UserRoutes'
import { redis } from './utils/redis'
import { saveGatheredData } from './controllers/AnalyticsController'
import { checkAuth } from './controllers/UserController'
import { URL_HSET } from './settings'

const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(cookieParser())

app.use('/user', userRoutes)
app.use('/', urlRoutes)
app.use('/analytics', checkAuth, analyticsRoutes)

console.log('Started... ')
const job = new CronJob(
  '01 55 23 */1 * *',
  async () => {
    console.log('Job Started!')
    const k = await redis.keys(`${URL_HSET}:*`)
    await Promise.each(k, (path) => saveGatheredData(path.split(':')[1]))
    console.log('Job Ended!')
  },
  null,
  true,
  'Asia/Tehran',
)
job.start()
app.listen(3000)
