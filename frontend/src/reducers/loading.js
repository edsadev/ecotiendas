import { CREATE_LOADING, TOGGLE_LOADING } from "../actions/loading"

export default function authedUser(state = null, action){
  switch(action.type){
    case CREATE_LOADING:
      return action.loading
    case TOGGLE_LOADING:
      return action.loading
    default:
      return state
  }
}