import { RECEIVE_MATERIALS, UNSET_MATERIALS } from "../actions/materials"

export default function materials (state = [], action){
  switch(action.type){
    case RECEIVE_MATERIALS:
      return {
        ...state,
        ...action.materials
      }
    case UNSET_MATERIALS:
      return action.materials
    default:
      return state
  }
}