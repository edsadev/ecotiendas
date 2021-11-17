import { logOut, getInitialDataEcoAdmin, getInitialDataKeyUser } from "../utils/api";
import { setAuthedUser, unsetAuthedUser } from "./authedUser";
import { receiveMaterials, unsetMaterials } from "./materials";
import { unsetHistory } from "./history";

export function handleLogin(id, rank, name, foto){
  return (dispatch) => {
    dispatch(setAuthedUser(id, rank, name, foto))
  }
}

export function receiveInitialDataEcoAdmin() {
  return (dispatch) => {
    return getInitialDataEcoAdmin()
      .then(({materials}) => {
        dispatch(receiveMaterials(materials))
      })
      .catch((err) => {
        alert('Hubo un error al tratar de obtener los datos desde el servidor para el Eco Admin, vuelve a intentarlo')
        console.error(err)
      })
  }
}

export function receiveInitialDataKeyUser() {
  return (dispatch) => {
    return getInitialDataKeyUser()
      .then(({materials}) => {
        dispatch(receiveMaterials(materials))
      })
      .catch((err) => {
        alert('Hubo un error al tratar de obtener los datos desde el servidor para el Key User, vuelve a intentarlo')
        console.error(err)
      })
  }
}

export function handleLogOut(){
  return (dispatch) => {
    return logOut()
      .then(() => {
        dispatch(unsetAuthedUser())
        dispatch(unsetMaterials())
        dispatch(unsetHistory())
      })
      .catch(() => {
        alert('Hubo un error al tratar de salir de sesión, por favor refresca la página')
      })
  }
}