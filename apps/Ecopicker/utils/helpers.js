export const _validateEmail = (text, cb) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
  if (reg.test(text) === false) {
    cb({ email: text, isEmail: false })
  }
  else {
    cb({ email: text, isEmail: true })
  }
}
export const _validateContra = (contra, newContra) => {
  if (contra !== newContra){
    return false
  } else {
    return true
  }
}

export const _validateEmailWhitoutCb = (text) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
  if (reg.test(text) === false) {
    return false
  }
  else {
    return true
  }
}