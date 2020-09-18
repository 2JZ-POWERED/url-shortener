import { Schema, Types } from 'mongoose'

const schema = new Schema({
  user: { type: Types.ObjectId, required: true },
  origin: { type: String, required: true },
  path: { type: String, required: true },
  clicked: { type: Number, required: true, default: 0 },
  firefox: { type: Number, required: true, default: 0 },
  chrome: { type: Number, required: true, default: 0 },
  safari: { type: Number, required: true, default: 0 },
  otherBrowsers: { type: Number, required: true, default: 0 },
  android: { type: Number, required: true, default: 0 },
  ios: { type: Number, required: true, default: 0 },
  windows: { type: Number, required: true, default: 0 },
  linux: { type: Number, required: true, default: 0 },
  otherOses: { type: Number, required: true, default: 0 },
  mobile: { type: Number, required: true, default: 0 },
  otherDevices: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

schema.index({ path: 1, createdAt: -1 })
module.exports = schema
