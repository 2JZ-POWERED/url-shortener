import bcrypt from 'bcrypt'
import { User } from '../models'
import jwt from '../utils/jwt'

async function addUser(req, res) {
  const { email, username, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(`${password}${salt}`, 10)
  await new User({
    email,
    username: username.toLowerCase(),
    password: hash,
    salt,
  }).save()
  return res.json({ email, username: username.toLowerCase() })
}

async function getToken(req, res) {
  const { username, email, password } = req.body
  try {
    const user = await User.findOne({ $or: [{ email: email || '' }, { username: (username || '').toLowerCase() }] })
    if (user) {
      const match = bcrypt.compareSync(`${password}${user.salt}`, user.password)
      if (match) {
        /* eslint no-underscore-dangle: 0 */
        const token = jwt.sign({ id: user._id })
        return res.json({ token })
      }
      return res.json({ err: 'Incorrect Password' })
    }
  } catch (error) {
    console.log(error)
  }
  return res.json({ err: 'ERR Not Found' })
}

async function checkAuth(req, res, next) {
  if (req.headers.authorization) {
    try {
      const { id } = jwt.verify(req.headers.authorization)
      const user = await User.findById(id)
      if (user) {
        req.user = user
        return next()
      }
    } catch (err) {
      return res.json({ error: 'Invalid Token' })
    }
  }
  return res.json({ error: 'Not Authenticated' })
}

module.exports = {
  addUser,
  getToken,
  checkAuth,
}
