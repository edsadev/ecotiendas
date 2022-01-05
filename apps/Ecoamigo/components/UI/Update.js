import React from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native'
import Loading from './Loading'

import Hojas2 from '../../utils/images/Hojas_2.png'

import { VERDE, BLANCO } from '../../utils/colors.js'
import { connect } from 'react-redux'

import { updateLocation } from '../../utils/api'
import { toggleLoading, unsetUser } from '../../actions'

import * as Location from 'expo-location'

import AsyncStorage from '@react-native-async-storage/async-storage';

class Update extends React.Component{
  componentDidMount(){
    this.props.dispatch(toggleLoading(true))
  }
  actualizar = async () => {
    this.props.dispatch(toggleLoading(this.props.loading))
    try {
      (async() => {
        let status = await Location.requestForegroundPermissionsAsync()
        if (status.status !== 'granted') {
          Alert.alert('Hubo un error en los permisos')
          return
        }
        let location = await Location.getCurrentPositionAsync({})
        updateLocation(this.props.authedUser.id, location.coords.latitude, location.coords.longitude)
          .then((res) => {
            this.props.dispatch(toggleLoading(true))
            if(res.data.success === true){
              this.props.navigation.navigate('Mensaje', {mensaje: 'Ubicación actualizada con éxito'})
            } else {
              console.log("Hubo un error", res.data.mensaje)
            }
          })
      })()
    } catch(err) {
      this.props.dispatch(toggleLoading(true))
      console.error(`Hubo un error al cargar la ubicación: ${err}`)
    }
  }
  handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@ecoamigo_credentials')
    } catch (error) {
      console.log('Hubo un error tratando de eliminar las credenciales', error)
    }
    this.props.dispatch(unsetUser())
  }
  render(){
    if(this.props.loading){
      return (
        <Loading />
      )
    }
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar 
          barStyle={'dark-content'}
        />}
        <View style={styles.formulario}>
          <Text style={styles.label}>Recuerda darle click cuando llegues a tu punto de destino</Text>
          <TouchableOpacity style={styles.boton} onPressIn={this.actualizar}>
            <Text style={{color: BLANCO, fontSize: 16}}>Actualizar ubicación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boton1} onPressIn={this.handleLogout}>
            <Text style={{color: VERDE, fontSize: 16}}>Salir de sesión</Text>
          </TouchableOpacity>
          <Image style={styles.image} source={Hojas2}
          />
        </View>
      </SafeAreaView>
    )
  }
}

function mapStateToProps({loading, authedUser}){
  return {
    loading, authedUser
  }
}

export default connect(mapStateToProps)(Update)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BLANCO,
    paddingTop: 100,
  },
  boton: {
    backgroundColor: VERDE,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginVertical: 10,
    alignSelf: 'center',
  },
  boton1: {
    backgroundColor: BLANCO,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: VERDE,
    borderStyle: 'solid',
    alignSelf: 'center',
  },
  formulario: {
    flex: 1,
    alignSelf: 'stretch',
  },
  subtitle: {
    fontSize: 24,
    paddingHorizontal: 32,
    paddingTop: 50,
    paddingBottom: 20
  },
  label: {
    fontSize: 16,
    paddingHorizontal: 48,
    paddingTop: 10,
    paddingBottom: 2,
  },
  text: {
    paddingHorizontal: 48,
    paddingBottom: 20,
    textAlign: 'right'
  },
  input: {
    fontSize: 16,
    marginHorizontal: 48,
    marginVertical: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderStyle: 'solid',
    borderColor: VERDE,
    borderWidth: 1,
    borderRadius: 25,
  },
  image: {
    position: 'absolute',
    bottom: 0,
    right: 10,
  }
})