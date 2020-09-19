import { redis } from '../utils/redis'
import { Analytic } from '../models'
import { URL_HSET } from '../settings'

const reportTemplate = {
  clicked: 0,
  firefox: 0,
  chrome: 0,
  safari: 0,
  otherBrowsers: 0,
  mobile: 0,
  otherDevices: 0,
  uClicked: 0,
  uFirefox: 0,
  uChrome: 0,
  uSafari: 0,
  uOtherBrowsers: 0,
  uMobile: 0,
  uOtherDevices: 0,
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
    mobile: parseInt(data.mobile || '0', 10),
    otherDevices: parseInt(data['other-devices'] || '0', 10),
    uClicked: parseInt(data['u-clicked'] || '0', 10),
    uFirefox: parseInt(data['u-Firefox'] || '0', 10),
    uChrome: parseInt(data['u-Chrome'] || '0', 10),
    uSafari: parseInt(data['u-Safari'] || '0', 10),
    uOtherBrowsers: parseInt(data['u-other-browsers'] || '0', 10),
    uMobile: parseInt(data['u-mobile'] || '0', 10),
    uOtherDevices: parseInt(data['u-other-devices'] || '0', 10),
  }).save()
  const del = await redis.del(`${URL_HSET}:${path}`)
  const cre = await redis.hset(`${URL_HSET}:${path}`, 'user', data.user, 'origin', data.origin)
  console.log(`>>>>> Analytics record ${path} created. status: ${!!sts}, del: ${del}, cre: ${cre}`)
}
module.exports = {
  getAnalytics,
  saveGatheredData,
}
