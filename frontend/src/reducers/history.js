import { RECEIVE_HISTORY, UNSET_HISTORY } from "../actions/history"

export default function historial (state = [], action){
  switch(action.type){
    case RECEIVE_HISTORY:
      return {
        ...state,
        ...action.historial
      }
    case UNSET_HISTORY:
      return action.historial
    default:
      return state
  }
}