import axios from "axios"
import remoteConfig from '@react-native-firebase/remote-config';

export let API = process.env.API || remoteConfig().getString('API')

export function loginApp (user, pass) {
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}login`,
    data: {
      user,
      pass
    },
    timeout: 5000,
    timeoutErrorMessage: 'No se pudo conectar al servidor... Inténtalo nuevamente'
  })
}

export function registerApp (cedula, nombre, apellido, direccion, genero, correo, celular, fecha_nacimiento, usuario, contraseña, sector, foto) {
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}eco-amigos`,
    data: {
      cedula,
      nombre,
      apellido,
      direccion,
      genero,
      correo,
      celular,
      fecha_nacimiento,
      usuario,
      contraseña,
      sector,
      foto,
    }
  })
}

export function updateCorreo(id, correo){
  API = remoteConfig().getString('API')
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
  API = remoteConfig().getString('API')
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
  API = remoteConfig().getString('API')
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

export function solicitarEcopicker(id, latitud, longitud){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}solicitar-ecopicker`,
    data: {
      id, latitud, longitud
    }
  })
}

export function ecotiendasCercanas(latitud, longitud){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}ecotiendas-cercanas`,
    data: {
      latitud, longitud
    }
  })
}

export function getPremios(){
  API = remoteConfig().getString('API')
  return axios({
    method: 'get',
    url: `${API}premios`
  })
}

export function getMarkersMap(){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}ecotiendas`,
    data: {
      "isZonal": false,
      "zonal": ""
    }
  })
}

export function canjearProducto(ecoamigo, total_ecopuntos, premios, cantidad_total = 1){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}crear-canje`,
    data: {
      ecoamigo, total_ecopuntos, premios, cantidad_total
    }
  })
}

export function reportarProblema(id, problema){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}reportar-problema`,
    data: {
      id, problema
    }
  })
}

export function getInfoByIdEcoamigo(id){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}ecopuntos`,
    data: {
      id
    }
  })
}

export function getHistorialEcoamigo(ecoamigo){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}historial-ecoamigo`,
    data: {
      ecoamigo
    }
  })
}

export function updateLocation(id, latitud, longitud){
  API = remoteConfig().getString('API')
  return axios({
    method: 'post',
    url: `${API}actualizar-ubicacion`,
    data: {
      id, latitud, longitud
    }
  })
}