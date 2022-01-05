import { LOAD_ORDERS } from "../actions/index"

export default function orders(state = {}, action){
  switch(action.type){
    case LOAD_ORDERS:
      return {
        orders: action.orders
      }
    default:
      return state
  }
}