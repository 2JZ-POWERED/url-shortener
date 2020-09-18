import express from 'express'
import { getAnalytics } from '../controllers/AnalyticsController'

const router = express.Router()
router.post('/:path/:from', getAnalytics)

module.exports = router
