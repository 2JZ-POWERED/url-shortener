import { Schema, Types } from 'mongoose'

const schema = new Schema({
  user: { type: Types.ObjectId, required: true },
  origin: { type: String, required: true },
  path: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  /* Total Views Count */
  clicked: { type: Number, required: true, default: 0 },
  firefox: { type: Number, required: true, default: 0 },
  chrome: { type: Number, required: true, default: 0 },
  safari: { type: Number, required: true, default: 0 },
  otherBrowsers: { type: Number, required: true, default: 0 },
  mobile: { type: Number, required: true, default: 0 },
  otherDevices: { type: Number, required: true, default: 0 },
  /* Unique Views Count */
  uClicked: { type: Number, required: true, default: 0 },
  uFirefox: { type: Number, required: true, default: 0 },
  uChrome: { type: Number, required: true, default: 0 },
  uSafari: { type: Number, required: true, default: 0 },
  uOtherBrowsers: { type: Number, required: true, default: 0 },
  uMobile: { type: Number, required: true, default: 0 },
  uOtherDevices: { type: Number, required: true, default: 0 },
})

schema.index({ path: 1, createdAt: -1 })
module.exports = schema
