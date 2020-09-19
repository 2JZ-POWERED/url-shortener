import Crypto from 'crypto'
import { redis } from '../utils/redis'
import UAParser from 'ua-parser-js'
import { BASE_URL, URL_HSET, VISIT_TIMEOUT } from '../settings'

function randomString() {
  return Crypto.randomBytes(32).toString('base64').slice(0, 5)
}

async function getOrGenUrl(path) {
  if (path) {
    const x = await redis.hexists(`${URL_HSET}:${path}`, 'origin')
    if (!x) return path
    throw Error('Exists')
  } else {
    let newPath
    do {
      newPath = randomString()
      /* eslint-disable */
    } while (!(await redis.hgetall(`${URL_HSET}:${newPath}`)))
    return newPath
  }
}

async function addUrl(req, res) {
  const { user } = req
  const { origin, path } = req.body
  let newPath
  try {
    newPath = await getOrGenUrl(path)
    await redis.hset(`${URL_HSET}:${newPath}`, 'user', user._id.toString(), 'origin', origin)
  } catch (err) {
    if (err.message == 'Exists') return res.json({ error: { message: 'Path Exists.' } })
    console.log(err)
    return res.json({ error: { message: 'ERROR' } })
  }
  return res.json({ data: { origin, shortUrl: `${BASE_URL}${newPath}` } })
}

async function clicked(path, ua, unique) {
  const u = unique ? 'u-' : ''
  await redis.hincrby(`${URL_HSET}:${path}`, `${u}clicked`, 1)
  if (['Firefox', 'Chrome', 'Safari'].indexOf(ua.browser.name) != -1) await redis.hincrby(`${URL_HSET}:${path}`, `${u}${ua.browser.name}`, 1)
  else await redis.hincrby(`${URL_HSET}:${path}`, `${u}other-browsers`, 1)
  if (ua.device.type == 'mobile') await redis.hincrby(`${URL_HSET}:${path}`, `${u}${ua.device.type}`, 1)
  else await redis.hincrby(`${URL_HSET}:${path}`, `${u}other-devices`, 1)
}

async function redirectUrl(req, res) {
  const { path } = req.params
  const url = await redis.hget(`${URL_HSET}:${path}`, 'origin')
  if (url) {
    const ua = UAParser(req.headers['user-agent'])
    if (!req.cookies[path]) {
      await clicked(path, ua, true)
      res.cookie(path, 'visited', { maxAge: VISIT_TIMEOUT })
    }
    await clicked(path, ua, false)
    return res.redirect(url)
  }
  return res.sendStatus(404)
}

module.exports = {
  addUrl,
  redirectUrl,
}
