import { Analytic } from '../models'

async function getAnalytics(req, res) {
  const { path, from } = req.params

  return res.json({ error: { path, from, email: req.user.email } })
}

module.exports = {
  getAnalytics,
}
