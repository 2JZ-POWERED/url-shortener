import mongoose from 'mongoose'
import Promise from 'bluebird'

import UserSchema from './User'
import AnalyticSchema from './Analytic'

mongoose.Promise = Promise

mongoose.connect('mongodb://mongo:27017/urlshortener', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

export const User = mongoose.model('User', UserSchema)
export const Analytic = mongoose.model('Analytic', AnalyticSchema)
