const cookieSession = require('cookie-session')
const dotenv = require('dotenv')
const path = require('path')

const express = require('express')
const morgan = require('morgan')
const forceSsl = require('force-ssl-heroku')
const helmet = require('helmet')
const bodyParser = require('body-parser')

// Load Passport
const passport = require('./lib/passport')

const env = require('./env')
const auth = require('./routes/auth')
const router = require('./routes/router')
const api = require('./routes/api')

dotenv.config()

const app = express()

app.use(forceSsl)
app.use(morgan(env.isProd ? 'combined' : 'dev'))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// config express-session
const sess = {
  name: 'session',
  keys: [ env.sessionKey ],
  secure: false,
  maxAge: 24 * 60 * 60 * 1000 * 7, // 24 * 7 hours
}

if (app.get('env') === 'production') {
  sess.secure = true // serve secure cookies, requires https
}

const publicDir = path.join(__dirname, '..', 'public')
app.use('/', express.static(publicDir, { maxAge: env.isProd ? '8 hours' : 0 }))

app.use(cookieSession(sess))
// Configure Passport to use Auth0
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user
  }

  next()
})

app.set('view engine', 'pug')
app.use('/', router)
app.use('/auth', auth)
app.use('/api/v1', api)

module.exports = function(db) {
  app.set('db', db)
  return app
}
