
const express = require('express')
const { check } = require('express-validator/check')
const router = express.Router()
const PhoneNumber = require('awesome-phonenumber')
const ms = require('ms')
const moment = require('moment')

const env = require('../env')
const db = require('../db/userQueries.js')
const config = require('../../knexfile')[env.nodeEnv]
const conn = require('knex')(config)

const secured = require('./middleware/secured')
const sms = require('../lib/sms.js')
const crypto = require('../../lib/crypto.js')
const WAValidator = require('wallet-address-validator')

router.get('/', secured(), (req, res) => {
  res.render('index', { title: 'Welcome to Cryptosaver' })
})

router.get('/confirm_names', secured(), async(req, res, next) => {
  try {
    const id = req.session.user.id
    const user = await db.getUserByUserId(conn, id)

    res.render('confirm-names', {
      user,
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/confirm_names', secured(), [
  check('first_name').trim().escape(),
  check('last_name').trim().escape(),
  check('middle_names').trim().escape(),
], async(req, res, next) => {
  try {
    const { first_name, middle_names, last_name } = req.body
    const id = req.session.user.id

    const update = {
      first_name,
      middle_names,
      last_name,
      names_confirmed: true,
    }

    await db.updateUser(conn, update, id)

    res.redirect('/more_details')
  } catch (err) {
    return next(err)
  }
})

router.get('/more_details', secured(), async(req, res, next) => {
  try {
    const id = req.session.user.id
    const user = await db.getUserByUserId(conn, id)

    res.render('more-details', {
      user,
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/more_details', secured(), [
  check('phone').trim().escape().exists(),
  check('dob').trim().escape().exists(),
], async(req, res, next) => {
  try {
    const { phone, dob } = req.body
    const dateOfBirth = moment(dob).format('DD/MM/YYYY')
    const phoneNumber = new PhoneNumber(phone, 'AU').getNumber('e164')

    const dobRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/

    if (!dobRegex.test(dateOfBirth)) return next('Invalid date of birth provided - ', dob)

    const id = req.session.user.id

    const update = {
      phone: phoneNumber,
      dob: dateOfBirth,
      sms_token: crypto.createSMSToken(),
      sms_token_expires: Date.now() + ms('1 hour'),
    }

    await db.updateUser(conn, update, id)

    // TODO: Put sms messages in a que
    const smsBody = `Please use ${update.sms_token} to verify your Cryptosaver account`
    sms.sendVerificationText(smsBody, phoneNumber, err => {
      if (err) return next(err)
    })

    res.redirect('/confirm_mobile')
  } catch (err) {
    next(err)
  }
})

router.get('/confirm_mobile', secured(), async(req, res, next) => {
  try {
    const id = req.session.user.id
    const user = await db.getUserByUserId(conn, id)

    if (user.sms_verified) return res.redirect('/wallet')

    res.render('confirm-mobile', {
      user,
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/confirm_mobile', secured(), async(req, res, next) => {
  try {
    const id = req.session.user.id
    const user = await db.getUserByUserId(conn, id)
    const code = req.body.code
    const smsToken = user.sms_token

    if (code !== smsToken) {
      await db.incrementPhoneAttempts(conn, id)
      return res.render('confirm-mobile', {
        user,
        error: 'Sorry the code you entered is incorrect.',
      })
    }

    if (user.sms_attempts > 3) {
      return res.render('confirm-mobile', {
        user,
        error: 'Sorry you have tried too many times, please contact us.',
      })
    }

    await db.validatePhone(conn, id)

    res.redirect('/wallet')
  } catch (err) {
    next(err)
  }
})

router.get('/wallet', secured(), async(req, res, next) => {
  res.render('wallet')
})

router.post('/wallet', secured(), async(req, res, next) => {
  try {
    const id = req.session.user.id
    const btc_address = req.body.wallet

    const isValid = WAValidator.validate(btc_address)

    if (!isValid) {
      return res.render('wallet', {
        error: 'BTC address you provided is invalid',
      })
    }

    const insert = {
      wallet_address: btc_address,
      unique: crypto.createUnique(),
      type: 'BTC',
      user_id: id,
      account_nickname: 'Bitcoin Savings',
      active: true,
    }

    await db.createAccount(conn, insert)

    res.redirect('/?welcome=y')
  } catch (err) {
    next(err)
  }
})

router.get('/verification/start', secured(), (req, res, next) => {
  res.render('verify-start')
})

router.get('/verification/address', secured(), (req, res, next) => {
  res.render('address')
})

router.post('/verification/address', secured(), async(req, res, next) => {
  const address = req.body.address
  const id = req.session.user.id
  const update = {
    address,
  }

  try {
    await db.updateUser(conn, update, id)

    res.redirect('/verification/green')
  } catch (err) {
    next(err)
  }
})

router.get('/verification/green', secured(), async(req, res, next) => {
  try {
    const user = await db.getUserByUserId(conn, req.session.user.id)

    res.render('green-id', { user, prod: env.nodeEnv })
  } catch (err) {
    next(err)
  }
})

module.exports = router
