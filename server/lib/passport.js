const passport = require('passport')
const Auth0Strategy = require('passport-auth0')

const env = require('../env')
// ----------------------------------------------------------------------------
// serialisation / deserialisation

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

const auth0Credentials = {
  domain: env.auth0Domain,
  clientID: env.auth0ClientID,
  clientSecret: env.auth0ClientSecret,
  callbackURL: env.auth0CallbackURL,
  state: false,
}

function lookUpUser(accessToken, refreshToken, extraParams, profile, done) {
  done(null, profile)
}

const strategy = new Auth0Strategy(auth0Credentials, lookUpUser)

passport.use(strategy)

// ----------------------------------------------------------------------------

module.exports = passport
