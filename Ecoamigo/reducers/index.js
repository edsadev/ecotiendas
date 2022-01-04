import { combineReducers } from 'redux'
import authedUser from './authedUser'
import rewards from './rewards'
import loading from './loading'

export default combineReducers({
  authedUser,
  rewards,
  loading
})