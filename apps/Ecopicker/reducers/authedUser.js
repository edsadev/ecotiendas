import { UPDATE_EMAIL, SET_USER, UNSET_USER, UPDATE_USERINFO } from "../actions/index"

export default function authedUser(state = null, action){
  switch(action.type){
    case SET_USER:
      return {
        cedula: action.cedula, 
        direccion: action.direccion, 
        genero: action.genero, 
        correo: action.correo, 
        telefono: action.telefono, 
        fecha_nacimiento: action.fecha_nacimiento, 
        rango: action.rango, 
        id: action.id, 
        nombre: action.nombre, 
        apellido: action.apellido, 
        foto: action.foto,
        ecopuntos: action.ecopuntos
      }
    case UNSET_USER:
      return null
    case UPDATE_EMAIL:
      return {
        ...state,
        correo: action.correo
      }
    case UPDATE_USERINFO:
      return {
        ...state,
        direccion: action.direccion, 
        genero: action.genero, 
        telefono: action.telefono, 
        fecha_nacimiento: action.fecha_nacimiento, 
        nombre: action.nombre, 
        apellido: action.apellido, 
        foto: action.foto,
      }
    default:
      return state
  }
}