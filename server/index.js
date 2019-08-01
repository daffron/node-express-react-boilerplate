require('dotenv').config()

const env = require('./env.js')
const createApp = require('./app')

if (env.nodeEnv !== 'production' && env.nodeEnv !== 'development') {
  throw new Error('No Enviroment set')
}

const config = require('../knexfile')[env.nodeEnv]
const connection = require('knex')(config)
const app = createApp(connection)

app.listen(env.port, function() {
  console.log('Listening on port:', env.port)
  console.log(`Running in ${env.nodeEnv} enviroment`)
})
