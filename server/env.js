const apex = process.env.APEX
const protocol = process.env.PROTOCOL || 'https'
const baseUrl = `${protocol}://${apex}`
const port = process.env.PORT || '3000'

const env = {
  // app
  nodeEnv: process.env.NODE_ENV,
  apex,
  protocol,
  baseUrl,
  apiUrl: `${baseUrl}/api/v1`,
  port,
  sessionKey: process.env.SESSION_KEY,

  // heroku
  herokuReleaseVersion: process.env.HEROKU_RELEASE_VERSION,

  // database
  databaseUrl: process.env.DATABASE_URL,

  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0ClientID: process.env.AUTH0_CLIENT_ID,
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
  auth0CallbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/auth/callback',
}

// add a few extra helpers to make life easier
env.isProd = env.nodeEnv === 'production' || env.nodeEnv === 'staging'
env.isDev = !env.isProd // 'development', 'testing/test', 'whatever'

// delete known env vars so other packages can't read them (just in case)
// `NODE_ENV` - don't delete
delete process.env.APEX
delete process.env.PROTOCOL
delete process.env.PORT
delete process.env.SESSION_KEY
delete process.env.DATABASE_URL

if (env.isDev) {
  console.log('+++ ENV +++')
  console.log('env:', env)
  console.log('--- ENV ---')
}

module.exports = env
