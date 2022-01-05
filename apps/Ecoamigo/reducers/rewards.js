import { SET_REWARD, UNSET_REWARD } from "../actions/index"

export default function rewards(state = {}, action){
  switch(action.type){
    case SET_REWARD:
      return {
        id: action.id,
        name: action.name,
        ecopuntos: action.ecopuntos,
        userId: action.userId,
        foto: action.foto
      }
    case UNSET_REWARD:
      return {}
    default:
      return state
  }
}