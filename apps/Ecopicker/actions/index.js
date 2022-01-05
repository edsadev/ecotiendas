export const SET_USER = 'SET_USER'
export const UNSET_USER = 'UNSET_USER'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'

export function setUser (cedula, direccion, genero, correo, telefono, fecha_nacimiento, rango, id, nombre, apellido, ecopuntos, foto) {
  return {
    type: SET_USER,
    cedula, direccion, genero, correo, telefono, fecha_nacimiento, rango, id, nombre, apellido, ecopuntos, foto
  }
}

export function unsetUser () {
  return {
    type: UNSET_USER,
  }
}

export function updateEmail(correo){
  return {
    type: UPDATE_EMAIL,
    correo
  }
}

export function updateUserInfo(nombre, apellido, telefono, direccion, fecha_nacimiento, genero, foto){
  console.log(nombre, apellido, telefono, direccion, fecha_nacimiento, genero, foto)
  return {
    type: UPDATE_USERINFO,
    nombre, apellido, telefono, direccion, fecha_nacimiento, genero, foto
  }
}

export const SET_REWARD = 'SET_REWARD'
export const UNSET_REWARD = 'UNSET_REWARD'

export function setReward (id, name, ecopuntos) {
  return {
    type: SET_REWARD,
    id, name, ecopuntos
  }
}

export function unsetReward (){
  return {
    type: UNSET_REWARD
  }
}

export const TOGGLE_LOADING = 'TOGGLE_LOADING'

export function toggleLoading(loading) {
  return {
    type: TOGGLE_LOADING,
    loading: !loading
  }
}

export const LOAD_ORDERS = 'LOAD_ORDERS'

export function loadOrders(orders){
  return {
    type: LOAD_ORDERS,
    orders
  }
}

