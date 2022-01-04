import React from 'react'
import {View, Text, TouchableHighlight} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BLANCO, VERDE } from '../../utils/colors'

import { unsetUser, toggleLoading } from '../../actions'

import { connect } from 'react-redux'

class ErrorCuenta extends React.Component {
  componentDidMount(){
    this.props.dispatch(toggleLoading(true))
  }
  handleLogout = async () => {
    // try {
    //   await AsyncStorage.removeItem('@ecoamigo_credentials')
    // } catch (error) {
    //   console.log('Hubo un error tratando de eliminar las credenciales', error)
    // }
    this.props.dispatch(unsetUser())
  }
  render(){
    return (
      <View style={{alignItems:'center'}}>
        <Text>Ingresa desde la aplicación correspondiente para tu cuenta</Text>
        <TouchableOpacity onPress={this.handleLogout} style={{marginVertical: 50, backgroundColor: VERDE, borderRadius: 15, paddingVertical: 10, paddingHorizontal: 20}}>
          <Text style={{color: BLANCO, fontSize: 18, textAlign: 'center'}}>Salir</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default connect()(ErrorCuenta)