import { redis } from '../utils/redis'
import { Analytic } from '../models'
import { URL_HSET } from '../settings'

const reportTemplate = {
  clicked: 0,
  firefox: 0,
  chrome: 0,
  safari: 0,
  otherBrowsers: 0,
  android: 0,
  ios: 0,
  windows: 0,
  linux: 0,
  otherOses: 0,
  mobile: 0,
  otherDevices: 0,
}

async function getAnalytics(req, res) {
  const { path } = req.params
  const today = await redis.hgetall(`${URL_HSET}:${path}`)
  delete today.user
  delete today.origin

  const records = await Analytic.find({ path }).sort({ createdAt: -1 }).limit(30)

  // the worst way to implement what an aggregate query does.. sorry for this s**t just wanted to implement the report
  const yesterday = records.slice(0, 1).reduce(
    (acc, curr) => {
      Object.keys(acc).forEach((k) => {
        acc[k] += curr[k]
      })
      return acc
    },
    { ...reportTemplate },
  )

  const lastweek = records.slice(0, 7).reduce(
    (acc, curr) => {
      Object.keys(acc).forEach((k) => {
        acc[k] += curr[k]
      })
      return acc
    },
    { ...reportTemplate },
  )

  const lastmonth = records.slice(0, 30).reduce(
    (acc, curr) => {
      Object.keys(acc).forEach((k) => {
        acc[k] += curr[k]
      })
      return acc
    },
    { ...reportTemplate },
  )

  return res.json({ results: { today, yesterday, lastweek, lastmonth } })
}

async function saveGatheredData(path) {
  const data = await redis.hgetall(`${URL_HSET}:${path}`)
  const sts = await new Analytic({
    user: data.user,
    path,
    origin: data.origin,
    clicked: parseInt(data.clicked || '0', 10),
    firefox: parseInt(data.Firefox || '0', 10),
    chrome: parseInt(data.Chrome || '0', 10),
    safari: parseInt(data.Safari || '0', 10),
    otherBrowsers: parseInt(data['other-browsers'] || '0', 10),
    android: parseInt(data.Android || '0', 10),
    ios: parseInt(data.iOS || '0', 10),
    windows: parseInt(data.Windows || '0', 10),
    linux: parseInt(data.Linux || '0', 10),
    otherOses: parseInt(data['other-oses'] || '0', 10),
    mobile: parseInt(data.mobile || '0', 10),
    otherDevices: parseInt(data['other-devices'] || '0', 10),
  }).save()
  const del = await redis.del(`${URL_HSET}:${path}`)
  const cre = await redis.hset(`${URL_HSET}:${path}`, 'user', data.user, 'origin', data.origin)
  console.log(`>>>>> Analytics record ${path} created. status: ${!!sts}, del: ${del}, cre: ${cre}`)
}
module.exports = {
  getAnalytics,
  saveGatheredData,
}
