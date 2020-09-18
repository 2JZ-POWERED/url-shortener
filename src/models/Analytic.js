import { Schema, Types } from 'mongoose'

const schema = new Schema({
  user: { type: Types.ObjectId, required: true },
  origin: { type: String, required: true },
  path: { type: String, unique: true, required: true },
  clicked: { type: Number, required: true },
  firefox: { type: Number, required: true },
  chrome: { type: Number, required: true },
  safari: { type: Number, required: true },
  otherBrowsers: { type: Number, required: true },
  android: { type: Number, required: true },
  ios: { type: Number, required: true },
  windows: { type: Number, required: true },
  linux: { type: Number, required: true },
  otherOses: { type: Number, required: true },
  mobile: { type: Number, required: true },
  otherDevices: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

schema.index({ user: 1, path: 1, createdAt: -1 })
module.exports = schema
