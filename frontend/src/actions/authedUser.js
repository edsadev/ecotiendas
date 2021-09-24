export const SET_AUTHED_USER = 'SET_AUTHED_USER'
export const UNSET_AUTHED_USER = 'UNSET_AUTHED_USER'

export function setAuthedUser(id, rank, name, foto) {
  return {
    type: SET_AUTHED_USER,
    id,
    rank,
    name,
    foto
  }
}

export function unsetAuthedUser() {
  return {
    type: UNSET_AUTHED_USER,
    id: null,
    rank: null,
    name: null,
    foto: null
  }
}