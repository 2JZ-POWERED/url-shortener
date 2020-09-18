import { redis } from '../utils/redis'
import { Analytic } from '../models'
import { URL_HSET } from '../settings'

async function getAnalytics(req, res) {
  const { path, from } = req.params

  return res.json({ error: { path, from, email: req.user.email } })
}

async function saveGatheredData(path) {
  const data = await redis.hgetall(`${URL_HSET}:${path}`)
  const sts = await new Analytic({
    user: data.user,
    path,
    origin: data.origin,
    clicked: parseInt(data.clicked, 10),
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
  console.log(`>>>>> Analytics record created. status: ${!!sts}, del: ${del}, cre: ${cre}`)
}
module.exports = {
  getAnalytics,
  saveGatheredData,
}
