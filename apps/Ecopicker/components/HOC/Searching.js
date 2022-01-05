import React from "react";
import { Text, View, ImageBackground, Image, StyleSheet, Platform, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
import * as Location from 'expo-location'

import { BLANCO, CELESTE, ROJO, VERDE } from '../../utils/colors'

import Patron from '../../utils/images/patron.png'
import Logo from '../../utils/images/LogoSinFondo.png'

class Searching extends React.Component{
  state={
    mensaje: 'Estamos buscando un ecopicker para ti.',
    count: 0,
    id: null,
    location: null,
  }
  componentDidMount(){
    try {
      (async() => {
        let status = await Location.requestForegroundPermissionsAsync()
        if (status.status !== 'granted') {
          Alert.alert('Hubo un error en los permisos')
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState(() => ({
          location: location
        }))
        this.props.navigation.navigate('Mensaje', {mensaje: '¡Pronto llegará el ecopicker a tu casa!'})
      })()
    } catch {
      console.log(new Error('Hubo un error al cargar la ubicación'))
    }

    const id = setInterval(() => {
      if(this.state.count < 2){
        this.setState(() => ({
          mensaje: this.state.mensaje + '.',
          count: this.state.count+1
        }))
      } else {
        this.setState(() => ({
          mensaje: 'Estamos buscando un ecopicker para ti.',
          count: 0
        }))
      }
    }, 1000)
    this.setState(() => ({
      id: id
    }))
  }
  componentWillUnmount(){
    clearInterval(this.state.id)
  }
  render(){
    return(
      <View style={{flex: 1}}>
        <ImageBackground source={Patron} style={{flex: 1, backgroundColor: CELESTE}}>
          <View style={styles.bloqueCeleste}>
            <Image source={Logo} style={styles.logo}/>
            <View style={{
              width: 180,
              height: 200,
              aspectRatio: 1 * 1.4,
            }}>
              {/* <Image source={MotoFondo} style={{width: '100%', height: '100%'}} resizeMode='center'/> */}
              
            </View>
            <Text style={{color: VERDE, fontSize: 24, fontWeight: 'bold', maxWidth: '70%', textAlign: "center"}}>{this.state.mensaje}</Text>
            <TouchableOpacity 
              style={{backgroundColor: VERDE, borderRadius: 25, width: '50%', alignSelf: 'center'}}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={{color: BLANCO, fontSize: 22, textAlign: 'center', padding: 10}}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 60,
    width: 60,
  },
  bloqueCeleste: {
    flex: 1,
    paddingTop: Platform.OS !== 'ios' ? 70 : 30,
    paddingBottom: Platform.OS !== 'ios' ? 50 : 30,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
})

function mapStateToProps({rewards}){
  return {
    rewards
  }
}

export default connect(mapStateToProps)(Searching)