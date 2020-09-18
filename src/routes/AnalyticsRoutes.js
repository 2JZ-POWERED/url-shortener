import express from 'express'
import { getAnalytics } from '../controllers/AnalyticsController'

const router = express.Router()
router.post('/:path', getAnalytics)

module.exports = router
