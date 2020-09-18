import { Schema } from 'mongoose'

const schema = new Schema({
  email: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = schema
