import React from 'react'
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native'
import Loading from './Loading'

import Hojas2 from '../../utils/images/Hojas_2.png'

import { VERDE, BLANCO } from '../../utils/colors.js'
import { connect } from 'react-redux'

import { loginApp, API } from '../../utils/api'
import { setUser, toggleLoading } from '../../actions'

import { _validateEmailWhitoutCb } from '../../utils/helpers'

class Login extends React.Component{
  componentDidMount(){
    this.correo = ''
    this.contraseña = ''
    /* const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@ecoamigo_credentials')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch(e) {
        // error reading value
      }
    }
    getData()
      .then(res => {
        if(res !== null){
          this.props.dispatch(toggleLoading(this.props.loading))
          loginApp(res.correo, res.contra)
            .then(res => {
              const data = res.data
              this.props.dispatch(setUser(data.cedula, data.direccion, data.genero, data.correo, data.telefono, data.fecha_nacimiento, data.rango, data.id, data.nombre, data.apellido, data.ecopuntos, data.foto))
            })
            .catch(error => {
              alert('Hubo un error al iniciar sesión, intenta con otras credenciales')
              this.props.dispatch(toggleLoading(this.props.loading))
              console.error(error, API)
            })
        }
      })  */
  }
  login = async () => {
    // this.props.dispatch(setUser('0201173200', 'milan', 'masculino', 'tru@gmail.com', '0994234166', '31/07/1999', 'ecopicker','0', 'Edmundo', 'Salamanca', null, ''))
    if (this.correo.length > 0){
      if (_validateEmailWhitoutCb(this.correo)){
        if (this.contraseña.length > 0){
          this.props.dispatch(toggleLoading(this.props.loading))
          loginApp(this.correo.toLowerCase(), this.contraseña)
            // .then(async res => {
            //   const storeData = async (correo, contra) => {
            //     try {
            //       const jsonValue = JSON.stringify({correo, contra})
            //       await AsyncStorage.setItem('@ecoamigo_credentials', jsonValue)
            //     } catch (e) {
            //       console.log('Hubo un error tratando de guardar las variables', e)
            //     }
            //   }
            //   await storeData(this.correo.toLowerCase(), this.contraseña)
            //   return res
            // })
            .then(res => {
              const data = res.data
              this.props.dispatch(setUser(data.cedula, data.direccion, data.genero, data.correo, data.telefono, data.fecha_nacimiento, data.rango, data.id, data.nombre, data.apellido, data.ecopuntos, data.foto))
            })
            .catch(error => {
              alert('Hubo un error al iniciar sesión, intenta con otras credenciales')
              this.props.dispatch(toggleLoading(this.props.loading))
              console.error(error, API)
            })
        } else {
          alert('Ingresa una contraseña')
        }
      } else {
        alert('Ingresa un correo electrónico válido')
      }
    } else {
      alert('Ingresa tu correo electrónico')
    }
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
          <Text style={styles.subtitle}>Iniciar sesión</Text>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput 
            style={styles.input}
            placeholder="ejemplo@correo.com"
            onChangeText={(text) => this.correo = text}
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            placeholder="xxxxxxxxxxx"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={(text) => this.contraseña = text}
          />
          <TouchableOpacity onPress={this.check}>
            <Text style={styles.text}>¡Olvidé mi contraseña!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boton} onPressIn={this.login}>
            <Text style={{color: BLANCO, fontSize: 16}}>Ingresar</Text>
          </TouchableOpacity>
          <Image style={styles.image} source={Hojas2}
          />
        </View>
      </SafeAreaView>
    )
  }
}

function mapStateToProps({loading}){
  return {
    loading
  }
}

export default connect(mapStateToProps)(Login)

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