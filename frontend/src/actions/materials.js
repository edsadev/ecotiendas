export const RECEIVE_MATERIALS = "RECEIVE_MATERIALS"
export const UNSET_MATERIALS = "UNSET_MATERIALS"

export function receiveMaterials(materials) {
  return {
    type: RECEIVE_MATERIALS,
    materials
  }
}

export function unsetMaterials(){
  return {
    type: UNSET_MATERIALS,
    materials: {}
  }
}