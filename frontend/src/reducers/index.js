import { combineReducers } from 'redux'
import authedUser from './authedUser'
import materials from './materials'
import historial from './history'
import loading from './loading'

export default combineReducers({
  authedUser,
  materials,
  historial,
  loading
})