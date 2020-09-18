import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import analyticsRoutes from './routes/AnalyticsRoutes'
import urlRoutes from './routes/UrlRoutes'
import userRoutes from './routes/UserRoutes'
import { checkAuth } from './controllers/UserController'

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

console.log('Started...')
// import { saveGatheredData } from './controllers/AnalyticsController'
// saveGatheredData('ggle')
app.listen(3000)
