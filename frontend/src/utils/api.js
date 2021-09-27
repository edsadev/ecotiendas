import axios from 'axios'

// export const ipUrl = 'http://186.101.197.159'
// export const ipUrl = 'http://192.168.100.45'
//export const ipUrl = 'http://192.168.36.79'
export const ipUrl = 'http://35.192.44.68'
// export const ipUrl = "http://172.20.10.2"
// export const ipUrl = 'http://192.168.100.4'
// export const ipUrl = 'http://192.168.100.130'
export const puerto = ':5000/'

export function getInitialUser (user, pass) {
  // console.log(user, pass)
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}login`,
    data: {
      user,
      pass
    }
  }).then(res => {
    // console.log(res)
    return res
  })
}

export function getHistory(id, cantidad, pagina){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}historial-pagination`,
    data: {
      ecotienda: id,
      cantidad,
      pagina: pagina + 1
    }
  })
}

export function getTicketsQuantity(id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}cantidad-tickets`,
    data:{
      ecotienda: id
    }
  })
}

export async function getInitialDataEcoAdmin(){
  return Promise.all([
    getMaterials(),
  ]).then(res => {
    return {
      materials: res[0].data.materiales
    }
  })
}
export function helloworld(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}`,
  })
}
function getMaterials(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}materiales`,
  })
}

export async function getInitialDataKeyUser(){
  return Promise.all([
    getMaterials(),
  ]).then(res => {
    return {
      materials: res[0].data.materiales
    }
  })
}

export function validacionCedula(cedula){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}validacion-cedula`,
    data: {
      cedula
    }
  })
}

export function getInfoByIdEcoamigo(id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}ecopuntos`,
    data: {
      id
    }
  })
}

export function getZonas(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}sectores`
  })
}

export function getStockEcoAdmin(id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}grafico-ecotienda`,
    data: {
      ecotienda: id
    }
  })
}

export function getEcoZonal(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}ecozonal`,
  })
}

export function getEcotiendaForEcoadmin(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}ecotienda`
  })
}

export function getMarkersMap(isZonal, zonal = ""){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}ecotiendas`,
    data: {
      isZonal,
      zonal
    }
  })
}

export function getTipoProductos(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}tipos-productos`
  })
}

export function getTipoPremios(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}tipos-premios`
  })
}

export function getEcotiendasByMaterialId(material){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}detalle-general`,
    data: {
      material
    }
  })
}

export function getEcotiendasByMaterialIdForEcoZonal(zonal, material){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}detalle-zonal`,
    data: {
      zonal,
      material
    }
  })
}

export function getProyeccion(cantidad){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}proyecciones`,
    data: {
      cantidad
    }
  })
}

export function getReporte(opcion){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}reportes`,
    data: {
      opcion
    },
    })
}

export function createEcoAmigo(cedula, nombre, apellido, direccion, genero, correo, celular, sector, fecha_nacimiento){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}eco-amigos`,
    data: {
      cedula,
      nombre,
      apellido,
      direccion,
      genero,
      correo,
      celular,
      usuario: correo,
      contraseña: cedula,
      sector,
      fecha_nacimiento
    }
  })
}

export function createZonal(cedula, nombre, apellido, direccion, genero, correo, celular, fecha_nacimiento, photo){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}zonal`,
    data: {
      cedula,
      nombre,
      apellido,
      direccion,
      genero,
      correo,
      celular,
      usuario: correo,
      contraseña: cedula,
      fecha_nacimiento,
      photo
    }
  })
}

export function createEcotienda(latitud, longitud, zonal_id, capacidad_maxima_m3, capacidad_maxima_kg, nombre, provincia, ciudad, fecha_apertura, sector){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}eco-tienda`,
    data: {
      latitud,
      longitud,
      zonal_id,
      capacidad_maxima_m3,
      capacidad_maxima_kg,
      nombre,
      provincia,
      ciudad,
      fecha_apertura,
      sector
    }
  })
}

export function createEcoAdmin(ecotienda_id, cedula, nombre, apellido, direccion, genero, correo, photo, fecha_nacimiento, celular, zonal_id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}new-ecoadmin`,
    data: {
      ecotienda_id,
      cedula,
      nombre,
      apellido,
      direccion,
      genero,
      correo,
      photo,
      fecha_nacimiento,
      celular,
      usuario: correo,
      contraseña: cedula,
      zonal_id,
    }
  })
}

export function createProduct(nombre, photo, tipo_producto, ecopuntos, cantidad){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}producto`,
    data: {
      nombre,
      photo,
      tipo_producto,
      ecopuntos,
      cantidad,
    }
  })
}

export function createPremio(nombre, photo, tipo_premio, ecopuntos, stock){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}premio`,
    data: {
      nombre,
      photo,
      tipo_premio,
      ecopuntos,
      stock,
    }
  })
}

export function createEntry(ecoamigo, ecotienda, entrada, total_kg, total_m3, total_ecopuntos, materiales){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}crear-ticket`,
    data: {
      ecoamigo, 
      ecotienda, 
      entrada, 
      total_kg, 
      total_m3, 
      total_ecopuntos, 
      materiales
    }
  })
}

export function createExit(ecotienda, entrada, total_kg, total_m3, materiales){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}crear-ticket`,
    data: { 
      ecotienda, 
      entrada, 
      total_kg, 
      total_m3, 
      materiales
    }
  })
}

export function logOut(){
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, 200);
  })
}

export function velocimetro(id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}velocimetro`,
    data: {
      ecotienda: id
    }
  })
}

export function balanza(id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}balanza`,
    data: {
      ecotienda: id
    }
  })
}

export function getDetail(id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}detalle-ticket`,
    data: {
      ticket: parseInt(id)
    }
  })
}

export function getDailyHistory(id){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}historial-diario`,
    data: {
      ecotienda: parseInt(id)
    }
  })
}

export function getGeneralDataGraph(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}grafico-general`,
  })
}

export function getGraphZonal(zonal){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}grafico-zonal`,
    data: {
      zonal
    } 
  })
}

export function getTotalKgAnio(){
  return axios({
    method: 'get',
    url: `${ipUrl}${puerto}total`
  })
}

export function getReporteStock(pais, zonal, provincia, producto){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}reporte`,
    data: {
      pais, zonal, provincia, producto
    }
  })
}

export function getReporteHistorico(pais, zonal, provincia, producto, fecha_desde, fecha_hasta){
  return axios({
    method: 'post',
    url: `${ipUrl}${puerto}reporte-historico`,
    data: {
      pais, zonal, provincia, producto, fecha_desde, fecha_hasta
    }
  })
}