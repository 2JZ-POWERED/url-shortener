import express from 'express'
import bodyParser from 'body-parser'

const app = express()
console.log('Started...')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.listen(3000)
