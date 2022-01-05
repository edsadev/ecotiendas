import React from 'react'
import {Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native'

import Logo from '../../utils/images/LogoSinFondo.png'
import Hojas from '../../utils/images/Hojas.png'
import Fondo from '../../utils/images/Fondo.png'

import { CELESTE, VERDE, BLANCO } from '../../utils/colors.js'

export default class Login extends React.Component{
  render(){
    const {navigation} = this.props
    return (
      <SafeAreaView style={styles.container}>
        <Image source={Hojas} style={styles.imageTop}/>
        <Image source={Hojas} style={styles.imageBottom}/>
        <Image source={Logo}/>
        <Text style={{color: VERDE, fontSize: 24}}>¡Bienvenido/a Ecopicker!</Text>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Login')}>
          <Text style={{color: BLANCO}}>Iniciar sesión</Text>
        </TouchableOpacity>
        <Image source={Fondo} style={styles.imageBackground}/>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CELESTE,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 150
  },
  boton: {
    backgroundColor: VERDE,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  imageTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  imageBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
    transform: [{rotate: "180deg"}]
  },
  imageBackground: {
    position: 'absolute',
    left: -120,
    bottom: -50,
    zIndex: -1, 
  },
})