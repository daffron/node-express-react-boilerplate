function getUserByUserId(conn, id) {
  return conn('user')
    .where('id', id)
    .first()
}

function addNewUser(conn, user) {
  return conn('user')
    .insert(user)
    .returning('*')
}

function updateUser(conn, user, id) {
  return conn('user')
    .update(user)
    .where({
      id,
    })
}

function validatePhone(conn, id) {
  return conn('user')
    .update({
      sms_verified: true,
    })
    .where({
      id,
    })
}

function incrementPhoneAttempts(conn, id) {
  return conn('user')
    .update({
      sms_count: conn.raw('sms_count + 1'),
    })
    .where({
      id,
    })
}

function createAccount(conn, insert) {
  return conn('account')
    .insert(insert)
}

function getAccountsByUserId(conn, id) {
  return conn('account')
    .where({
      user_id: id,
    })
}

module.exports = {
  getUserByUserId,
  addNewUser,
  updateUser,
  incrementPhoneAttempts,
  validatePhone,
  createAccount,
  getAccountsByUserId,
}
