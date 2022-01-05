import React from 'react'
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Platform, StatusBar, NativeModules, LayoutAnimation, Alert} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


import DefaultUser from '../../utils/images/DefaultUser.png'
import Separador from '../../utils/images/Separador.png'

import { VERDE, BLANCO, CELESTE, GRAY } from '../../utils/colors.js'
import { SafeAreaView } from 'react-native-safe-area-context'

import { _validateContra, _validateEmail } from '../../utils/helpers';
import { connect } from 'react-redux';
import { updateContra, updateCorreo, updateUser } from '../../utils/api';
import { toggleLoading, updateEmail, updateUserInfo } from '../../actions';
import Loading from '../UI/Loading';

const { UIManager } = NativeModules;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class EditarPerfil extends React.Component{
  state = {
    image: null,
    genero: null,
    date: new Date(),
    showDate: false,
    bloqueCorreo: false,
    bloqueContra: false,
    email: '',
    isEmail: false,
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    cambios: false,
  }
  componentDidMount(){
    const { authedUser } = this.props
    this.setState(() => ({
      image: `data:image/png;base64,${authedUser.foto}`,
      date: new Date(authedUser.fecha_nacimiento),
      genero: authedUser.genero,
      nombre: authedUser.nombre,
      direccion: authedUser.direccion,
      telefono: authedUser.telefono,
      apellido: authedUser.apellido,
    }))
    
    // Inicializo las variables para no tener errores dentro de los if statement
    this.newContra = ''
    this.newContra2 = ''
    this.antiguaContra = ''
  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      this.setState(() => ({
        image: `data:image/png;base64,${result.base64}`,
        cambios: true
      }))
    }
  }
  handleBloque = (bloque) => {
    LayoutAnimation.easeInEaseOut()
    if (bloque === 'BloqueCorreo'){
      this.setState(() => (
        this.state.bloqueCorreo === false
          ? {bloqueCorreo: true}
          : {bloqueCorreo: false}
      ))
    } else if(bloque ==='BloqueContra') {
      this.setState(() => (
        this.state.bloqueContra === false
          ? {bloqueContra: true}
          : {bloqueContra: false}
      ))
    }
  }
  handleChangeGender = (e) => {
    this.setState(() => ({
      genero: e,
      cambios: true
    }))
  }
  showDatePicker = () => {
    this.setState(() => ({
      showDate: true
    }))
  }
  hideDatePicker = () => {
    this.setState(() => ({
      showDate: false
    }))
  }
  handleChangeDateIOS = (value) => {
    this.setState(() => ({
      date: value,
      showDate: false,
      cambios: true,
    }))
  }
  handleChangeDateAndroid = (e, value) => {
    this.setState(() => ({
      date: value,
      showDate: false,
      cambios: true,
    }))
  }
  handleChangeEmail = () => {
    if (this.state.isEmail) {
      updateCorreo(this.props.authedUser.id, this.state.email.toLowerCase())
        .then(res => {
          if(res.data.success === false){
            alert(res.data.mensaje)
          } else {
            this.props.dispatch(updateEmail(this.state.email.toLowerCase()))
            this.props.navigation.navigate('Mensaje', {mensaje: res.data.mensaje})
          }
        })
        .catch(err => {
          alert('Hubo un error al tratar de actualizar el correo')
          console.error(err)
        })
    } else {
      alert('El correo ingresado no es correcto')
    }
  }
  handleChangeContra = () => {
    this.props.dispatch(toggleLoading(this.props.loading))
    if(this.antiguaContra.length > 0){
      if(this.newContra.length > 0){
        if(this.newContra2.length > 0){
          if(_validateContra(this.newContra, this.newContra2)){
            updateContra(this.newContra, this.antiguaContra, this.props.authedUser.id)
              .then(res => {
                this.props.dispatch(toggleLoading(this.props.loading))
                if(res.data.success === false){
                  alert(res.data.mensaje)
                } else {
                  this.props.navigation.navigate('Mensaje', {mensaje: res.data.mensaje})
                }
              })
              .catch(err => {
                alert('Hubo un error al tratar de actualizar tu contraseña')
                this.props.dispatch(toggleLoading(this.props.loading))
                console.error(err)
              })
          } else {
            alert('Las contraseñas no coinciden')
            this.props.dispatch(toggleLoading(this.props.loading))
          }
        } else {
          alert('Escribe nuevamente tu nueva contraseña')
          this.props.dispatch(toggleLoading(this.props.loading))
        }
      } else {
        alert('Escribe tu nueva contraseña')
        this.props.dispatch(toggleLoading(this.props.loading))
      }
    } else {
      alert('Escribe tu antigua contraseña')
      this.props.dispatch(toggleLoading(this.props.loading))
    }
  }
  handleChanges = () => {
    const {nombre, apellido, direccion, genero, telefono, date, image} = this.state
    const {id} = this.props.authedUser
    this.props.dispatch(toggleLoading(this.props.loading))
    if(this.state.cambios){
      updateUser(id, nombre, apellido, direccion, genero, telefono, date, image.split('/png;base64,')[1])
        .then(res => {
          this.props.dispatch(toggleLoading(this.props.loading))
          if(res.data.success === false){
            alert(res.data.mensaje)
          } else {
            this.props.dispatch(updateUserInfo(nombre, apellido, telefono, direccion, date, genero, image.split('/png;base64,')[1]))
            this.props.navigation.navigate('Mensaje', {mensaje: res.data.mensaje})
          }
        })
        .catch(err => {
          alert('Hubo un error al tratar de actualizar tu información')
          this.props.dispatch(toggleLoading(this.props.loading))
          console.error(err)
        })
    } else {
      alert('No se han encontrados cambios en tu información')
      this.props.dispatch(toggleLoading(this.props.loading))
    }
  }
  render(){
    const {image, date, showDate} = this.state
    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        {Platform.OS === 'ios' && <StatusBar 
          barStyle={'dark-content'}
        />}
        {this.props.loading
          ? <Loading />
          : <ScrollView style={styles.formulario}>
              {image && <Image source={{ uri: image }} style={styles.avatar} />}
              {!image && <Image source={DefaultUser} style={styles.avatar} />}
              <TouchableOpacity onPress={this.pickImage}>
                <Text style={{color: VERDE, textAlign: 'center', paddingTop: 15, paddingBottom: 25}}>Cambiar imagen</Text>
              </TouchableOpacity>
              <View style={styles.formRow}>
                <View style={[styles.formRow1, {flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between'}]}>
                  <Text style={[styles.label, {flex: 1}]}>Correo electrónico</Text>
                  <TouchableOpacity style={[styles.input, {flex: 1, backgroundColor: VERDE}]} onPress={() => this.handleBloque('BloqueCorreo')}>
                    <Text style={{padding: 5, textAlign: 'center', color: BLANCO}}>Cambiar correo</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.bloqueCorreo && 
                <View style={[{backgroundColor: BLANCO, marginHorizontal: 20, borderRadius: 20, paddingVertical: 20, marginVertical: 20}, this.state.bloqueCorreo]}>
                  <View style={styles.formRow}>
                    <View style={styles.formRow1}>
                      <Text style={styles.label}>Correo actual</Text>
                      <TextInput style={[styles.innerBloqueInput, {color: GRAY}]} editable={false} value={this.props.authedUser.correo}/>
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formRow1}>
                      <Text style={styles.label}>Nuevo correo</Text>
                      <TextInput 
                        style={styles.innerBloqueInput}
                        onChangeText={(text) => _validateEmail(text, (data) => {
                          this.setState(() => ({
                            email: data.email,
                            isEmail: data.isEmail
                          }))
                        })}
                        value={this.state.email}
                      />
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.input, {backgroundColor: VERDE, marginHorizontal: 40}]} onPress={this.handleChangeEmail}>
                    <Text style={{padding: 5, textAlign: 'center', color: BLANCO}}>Guardar cambio</Text>
                  </TouchableOpacity>
                </View>
              }
              <View style={styles.formRow}>
                <View style={[styles.formRow1, {flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between'}]}>
                  <Text style={[styles.label, {flex: 1}]}>Contraseña</Text>
                  <TouchableOpacity style={[styles.input, {flex: 1, backgroundColor: VERDE}]} onPress={() => this.handleBloque('BloqueContra')}>
                    <Text style={{padding: 5, textAlign: 'center', color: BLANCO}}>Cambiar contraseña</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.bloqueContra && 
                <View style={[{backgroundColor: BLANCO, marginHorizontal: 20, borderRadius: 20, paddingVertical: 20, marginVertical: 20}, this.state.bloqueCorreo]}>
                  <View style={styles.formRow}>
                    <View style={styles.formRow1}>
                      <Text style={styles.label}>Ingresa tu contraseña actual</Text>
                      <TextInput 
                        style={styles.innerBloqueInput}
                        onChangeText={(antiguaContra) => this.antiguaContra = antiguaContra}
                        secureTextEntry={true}
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formRow1}>
                      <Text style={styles.label}>Ingresa tu nueva contraseña</Text>
                      <TextInput 
                        style={styles.innerBloqueInput}
                        onChangeText={(newContra) => this.newContra = newContra}
                        secureTextEntry={true}
                      />
                    </View>
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formRow1}>
                      <Text style={styles.label}>Ingresa nuevamente tu nueva contraseña</Text>
                      <TextInput 
                        style={styles.innerBloqueInput}
                        onChangeText={(newContra2) => this.newContra2 = newContra2}
                        secureTextEntry={true}
                      />
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.input, {backgroundColor: VERDE, marginHorizontal: 40}]} onPress={this.handleChangeContra}>
                    <Text style={{padding: 5, textAlign: 'center', color: BLANCO}}>Guardar cambio</Text>
                  </TouchableOpacity>
                </View>
              }
              <View style={styles.formRow}>
                <Image source={Separador} resizeMode={'stretch'} style={{width: '100%'}}/>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.setState(() => ({nombre: text, cambios: true}))}
                    value={this.state.nombre}
                  />
                </View>
                <View style={styles.formRow2}>
                  <Text style={styles.label}>Apellido</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.setState(() => ({apellido: text, cambios: true}))}
                    value={this.state.apellido}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Número de celular</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.setState(() => ({telefono: text, cambios: true}))}
                    value={this.state.telefono} 
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Dirección de domicilio</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.setState(() => ({direccion: text, cambios: true}))}
                    value={this.state.direccion} 
                  />
                </View>
              </View>
              <TouchableOpacity style={[styles.boton, {marginBottom: 20}]} onPress={this.handleChanges}>
                <Text style={{color: BLANCO}}>Enviar cambios</Text>
              </TouchableOpacity>
            </ScrollView>
        }
        
      </SafeAreaView>
    )
  }
}

function mapStateToProps({authedUser, loading}){
  return {
    authedUser,
    loading
  }
}

export default connect(mapStateToProps)(EditarPerfil)

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: CELESTE,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: 'center',
  },
  innerBloqueInput: {
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,.3)', 
    padding: 5,
    fontSize: 16,
    borderStyle: 'solid',
  },
  boton: {
    backgroundColor: VERDE,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginVertical: 5,
    alignSelf: 'center',
  },
  formulario: {
    alignSelf: 'stretch',
  },
  formRow: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingVertical: 6,
    marginBottom: 5
  },
  formRow1: {
    flex: 1,
    paddingRight: 5,
  },
  formRow2: {
    flex: 1,
    paddingLeft: 5,
  },
  label: {
    fontSize: 16,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    paddingHorizontal: 32,
    paddingTop: 50,
    paddingBottom: 20,
    textAlign: 'center'
  },
  input: {
    fontSize: 16,
    borderStyle: 'solid',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios'? 8 : 3,
    borderRadius: 25,
    backgroundColor: BLANCO,
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: VERDE,
  },
  menu: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 25,
    backgroundColor: BLANCO
  }
})