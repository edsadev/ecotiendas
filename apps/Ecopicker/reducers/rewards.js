import { SET_REWARD, UNSET_REWARD } from "../actions/index"

export default function rewards(state = {}, action){
  switch(action.type){
    case SET_REWARD:
      return {
        id: action.id,
        name: action.name,
        ecopuntos: action.ecopuntos
      }
    case UNSET_REWARD:
      return {}
    default:
      return state
  }
}