// routes/auth.js

const express = require('express')
const router = express.Router()
const passport = require('passport')
const dotenv = require('dotenv')
const querystring = require('querystring')

const env = require('../env')

const db = require('../db/userQueries.js')
const config = require('../../knexfile')[env.nodeEnv]
const conn = require('knex')(config)
const crypto = require('../../lib/crypto.js')

dotenv.config()

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile',
}), function(req, res) {
  res.redirect('/')
})

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function(req, res, next) {
  passport.authenticate('auth0', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) return res.redirect('/auth/login')
    req.logIn(user, async err => {
      if (err) return next(err)

      const profile = req.user._json
      const id = profile.sub
      let returnTo = req.session.returnTo
      delete req.session.returnTo
      try {
        let user = await db.getUserByUserId(conn, id)

        if (!user) {
          returnTo = '/confirm_names'
          const newUser = {
            fee: 30,
            first_name: profile.given_name,
            last_name: profile.family_name,
            avatar: profile.picture,
            email: profile.email,
            unique: crypto.createUnique(),
            id: id,
          }
          user = await db.addNewUser(conn, newUser)
          user = user[0]
        }

        console.log('USER::', user)

        if (!user.names_confirmed) {
          returnTo = '/confirm_names'
        }

        if (!user.phone) {
          returnTo = '/more_details'
        }

        req.session.user = user
      } catch (err) {
        return next(err)
      }

      res.redirect(returnTo || '/')
    })
  })(req, res, next)
})

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout()

  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: env.baseUrl,
  })
  const logoutURL = `https://${env.auth0Domain}/logout?${searchString}`

  res.redirect(logoutURL)
})

module.exports = router
