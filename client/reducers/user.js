import { SET_USER } from '../constants'

function user(state = {}, action) {
  if (action.type === SET_USER) {
    return action.user
  }

  return state
}

export default user
