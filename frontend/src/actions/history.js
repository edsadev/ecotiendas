export const SAVE_ENTRY = "SAVE_ENTRY"
export const RECEIVE_HISTORY = "RECEIVE_HISTORY"
export const UNSET_HISTORY = "UNSET_HISTORY"

export function receiveHistory(historial) {
  return {
    type: RECEIVE_HISTORY,
    historial: historial
  }
}

export function unsetHistory(){
  return {
    type: UNSET_HISTORY,
    historial: {}
  }
}