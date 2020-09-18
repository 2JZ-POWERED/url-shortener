import express from 'express'
import { addUser, getToken } from '../controllers/UserController'

const router = express.Router()
router.post('/signup', addUser)
router.post('/get-token', getToken)

module.exports = router
