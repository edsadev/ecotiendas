import { TOGGLE_LOADING } from "../actions/index"

export default function authedUser(state = false, action){
  switch(action.type){
    case TOGGLE_LOADING:
      return action.loading
    default:
      return state
  }
}