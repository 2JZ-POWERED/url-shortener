import express from 'express'
import { addUrl, redirectUrl } from '../controllers/UrlController'
import { checkAuth } from '../controllers/UserController'

const router = express.Router()
router.post('/url/add', checkAuth, addUrl)
router.get('/:path', redirectUrl)

module.exports = router
