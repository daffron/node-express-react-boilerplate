const express = require('express')
const router = express.Router()
const env = require('../env')
const db = require('../db/userQueries.js')
const config = require('../../knexfile')[env.nodeEnv]
const conn = require('knex')(config)

const secured = require('./middleware/secured')

router.use(secured())

router.get('/get-user', async(req, res) => {
  const id = req.session.user.id

  try {
    const user = await db.getUserByUserId(conn, id)

    res.json({
      ok: true,
      user,
    })
  } catch (err) {
    res.json({
      ok: false,
      msg: 'Unable to get user.',
      error: err,
    })
  }
})

router.get('/get-accounts', async(req, res) => {
  const id = req.session.user.id

  try {
    const accounts = await db.getAccountsByUserId(conn, id)

    res.json({
      ok: true,
      accounts,
    })
  } catch (err) {
    res.json({
      ok: false,
      msg: 'Unable to get accounts.',
      error: err,
    })
  }
})

module.exports = router
