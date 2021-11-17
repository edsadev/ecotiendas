export const TOGGLE_LOADING = 'TOGGLE_LOADING'

export function toggleLoading(loading) {
  return {
    type: TOGGLE_LOADING,
    loading: !loading
  }
}