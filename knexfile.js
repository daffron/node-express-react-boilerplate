require('dotenv').config()
const env = require('./server/env.js')

module.exports = {

  development: {
    client: 'pg',
    connection: env.databaseUrl,
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    seeds: {
      directory: './tests/seeds',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: env.databaseUrl,
    migrations: {
      tableName: 'knex_migrations',
    },
  }

}
