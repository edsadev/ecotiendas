export const CREATE_LOADING = 'CREATE_LOADING'
export const TOGGLE_LOADING = 'TOGGLE_LOADING'

export function createLoading() {
  return {
    type: CREATE_LOADING,
    loading: false,
  }
}

export function toggleLoading(loading) {
  return {
    type: TOGGLE_LOADING,
    loading: !loading
  }
}