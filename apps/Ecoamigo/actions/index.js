export const TOGGLE_LOADING = 'TOGGLE_LOADING'

export const SET_USER = 'SET_USER'
export const UNSET_USER = 'UNSET_USER'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'
export const UPDATE_ECOPUNTOS = 'UPDATE_ECOPUNTOS'

export const SET_REWARD = 'SET_REWARD'

//////////////////////////////////////////////////////////////////////////////////

export function toggleLoading(loading) {
  return {
    type: TOGGLE_LOADING,
    loading: !loading
  }
}

//////////////////////////////////////////////////////////////////////////////////

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
  return {
    type: UPDATE_USERINFO,
    nombre, apellido, telefono, direccion, fecha_nacimiento, genero, foto
  }
}

export function updateEcopuntos(ecopuntos){
  return {
    type: UPDATE_ECOPUNTOS,
    ecopuntos
  }
}

////////////////////////////////////////////////////////////////////////////////

export function setReward (id, name, ecopuntos, userId, foto) {
  return {
    type: SET_REWARD,
    id, name, ecopuntos, userId, foto
  }
}