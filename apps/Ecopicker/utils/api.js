import axios from "axios"

export const API = process.env.API || 'http://200.93.217.234:5000/'

export function loginApp (user, pass) {
  return axios({
    method: 'post',
    url: `${API}login`,
    data: {
      user,
      pass
    }
  })
}

export function updateCorreo(id, correo){
  return axios({
    method: 'post',
    url: `${API}correo-update`,
    data: {
      id,
      correo
    }
  })
}

export function updateContra(nueva_contrasena, vieja_contrasena, id){
  return axios({
    method: 'post',
    url: `${API}contrasena-update`,
    data: {
      nueva_contrasena,
      vieja_contrasena,
      id
    }
  })
}

export function updateUser(id, nombre, apellido, direccion, genero, celular, fecha_nacimiento, foto){
  return axios({
    method: 'post',
    url: `${API}eco-amigos-update`,
    data: {
      id,
      nombre,
      apellido,
      direccion,
      genero,
      celular,
      fecha_nacimiento,
      foto,
    }
  })
}

export function getMaterials(){
  return axios({
    method: 'get',
    url: `${API}materiales`,
  })
}

export function getOrders(id){
  return axios({
    method: 'post',
    url: `${API}obtener-pedidos`,
    data: {id}
  })
}

export function createTicketEcopicker(pedido, ecopicker, ecoamigo, materiales){
  return axios({
    method: 'post',
    url: `${API}crear-ticket-ecopicker`,
    data: {pedido, ecopicker, ecoamigo, materiales}
  })
}