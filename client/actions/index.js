import request from 'superagent'

import { SET_USER } from '../constants'

export function getUser() {
  return dispatch => {
    request.get('/api/v1/get-user')
      .then(res => {
        const user = res.body.user

        const name = `${res.body.user.first_name} ${res.body.user.last_name}`

        user.name = name
        dispatch(setUser(user))
      })
  }
}

function setUser(user) {
  return {
    type: SET_USER,
    user,
  }
}
