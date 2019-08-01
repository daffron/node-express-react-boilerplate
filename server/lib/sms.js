// TODO: put in a queue
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.TWILIO_TOKEN

const client = require('twilio')(accountSid, authToken)

function sendVerificationText(body, phone, cb) {
  client.messages.create({
    body: body,
    to: phone, // Text this number
    from: '+61437667555', // From a valid Twilio number
  }, (err, msg) => {
    if (err) {
      console.log('Error: ', err)
      cb(err)
    } else {
      console.log('SMS sent and processed')
      cb(null, true)
    }
  })
}

module.exports = {
  sendVerificationText,
}
