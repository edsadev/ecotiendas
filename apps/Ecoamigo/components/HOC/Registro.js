import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Platform, StatusBar} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import DefaultUser from '../../utils/images/DefaultUser.png'

import { VERDE, BLANCO } from '../../utils/colors.js'
import { SafeAreaView } from 'react-native-safe-area-context'

import { _validateContra, _validateEmail } from '../../utils/helpers';
import { registerApp } from '../../utils/api';
import Loading from '../UI/Loading';
import { toggleLoading } from '../../actions';
import { connect } from 'react-redux';


class Register extends React.Component{
  state = {
    image: null,
    genero: 'masculino',
    date: new Date(),
    showDate: false,
    email: '',
    isEmail: false
  }
  componentDidMount(){
    this.nombre = ''
    this.apellido = ''
    this.cedula = ''
    this.celular = ''
    this.contra = ''
    this.contra2 = ''
  }
  pickImage = async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Lo siento, necesitamos acceso a tu almacenamiento para poder tomar la foto!');
          return
        }
      }
    })()
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true
    });
    if (!result.cancelled) {
      this.setState(() => ({
        image: result
      }))
    }
  }
  handleChangeGender = (e) => {
    this.setState(() => ({
      genero: e
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
      showDate: false
    }))
  }
  handleChangeDateAndroid = (e, value) => {
    this.setState(() => ({
      date: value,
      showDate: false
    }))
  }
  handleRegister = () => {
    this.props.dispatch(toggleLoading(this.props.loading))
    if(this.state.image !== null){
      if(this.nombre.length > 0 || this.apellido.length > 0){
        if(this.cedula.length > 0){
          if (this.state.isEmail){
            if(this.contra.length > 0){
              if(this.contra2.length > 0){
                if(_validateContra(this.contra, this.contra2)){
                  registerApp (this.cedula, this.nombre, this.apellido, this.direccion, this.state.genero, this.state.email.toLowerCase(), this.celular, this.state.date, this.state.email, this.contra, 1, this.state.image.base64)
                    .then(res => {
                      if (res.data.success){
                        alert(res.data.mensaje)
                        this.props.dispatch(toggleLoading(this.props.loading))
                        this.props.navigation.goBack()
                      } else {
                        alert(res.data.mensaje)
                        this.props.dispatch(toggleLoading(this.props.loading))
                      }
                    })
                    .catch(error => {
                      this.props.dispatch(toggleLoading(this.props.loading))
                      alert('Hubo un error al tratar de registrarse')
                      console.error(error)
                    })
                } else {
                  alert('Las contraseñas no coinciden')
                  this.props.dispatch(toggleLoading(true))
                }
              } else {
                alert('Por favor, escribe nuevamente tu contraseña')
                this.props.dispatch(toggleLoading(true))
              }
            } else {
              alert('Por favor, escribe una contraseña')
              this.props.dispatch(toggleLoading(true))
            }
          } else {
            alert('Por favor, escribe un correo electrónico válido')
            this.props.dispatch(toggleLoading(true))
          }
        } else {
          alert('Por favor, escribe tu número de cédula')
          this.props.dispatch(toggleLoading(true))
        }
      } else {
        alert('Por favor, llena los campos de nombre y apellido')
        this.props.dispatch(toggleLoading(true))
      }
    } else {
      alert('Por favor, ingresa una imagen de perfil')
      this.props.dispatch(toggleLoading(true))
    }
  }
  render(){
    const {image, date, showDate} = this.state
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar 
          barStyle={'dark-content'}
        />}
        {this.props.loading === true
          ? <Loading />
          : <ScrollView style={styles.formulario}>
              <Text style={styles.subtitle}>Registrarse</Text>
              {image && <Image source={{ uri: image.uri }} style={styles.avatar} />}
              {!image && <Image source={DefaultUser} style={styles.avatar} />}
              <TouchableOpacity onPress={this.pickImage}>
                <Text style={{color: VERDE, textAlign: 'center', paddingTop: 15, paddingBottom: 25}}>Agregar imagen</Text>
              </TouchableOpacity>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.nombre = text}
                  />
                </View>
                <View style={styles.formRow2}>
                  <Text style={styles.label}>Apellido</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.apellido = text}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Número de cédula</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.cedula = text}
                    maxLength={10}
                  />
                </View>
                <View style={styles.formRow2}>
                  <Text style={styles.label}>Número de celular</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.celular = text}
                    autoCompleteType="tel"
                    maxLength={10}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={(text) => _validateEmail(text, (data) => {
                      this.setState(() => ({
                        email: data.email,
                        isEmail: data.isEmail
                      }))
                    })}
                    value={this.state.email}
                    autoCompleteType="email"
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Contraseña</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.contra = text}
                    secureTextEntry={true}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Confirmar contraseña</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.contra2 = text}
                    secureTextEntry={true}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Dirección de domicilio</Text>
                  <TextInput 
                    style={styles.input}
                    onChangeText={text => this.direccion = text}
                    autoCompleteType="street-address"
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <View>
                    {Platform.OS === 'ios'
                      ? <View>
                          <Text style={styles.label}>Fecha de nacimiento</Text>
                          <View style={[styles.input, {paddingVertical: 0, paddingHorizontal: 0, flexDirection: 'row', alignItems: 'center', flex: 1}]}>
                            <TouchableOpacity style={[styles.boton, {paddingHorizontal: 20, marginVertical: 0}]} onPress={this.showDatePicker}>
                              <Text style={{color: BLANCO}}>Seleccionar fecha</Text>
                            </TouchableOpacity>
                            <Text style={{flex: 1, textAlign: 'center'}}>
                              {date 
                                ? `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}` 
                                : `${(new Date()).getDate()}/${(new Date()).getMonth()+1}/${(new Date()).getFullYear()}`
                              }
                            </Text>  
                          </View>
                          <DateTimePickerModal
                            isVisible={showDate}
                            mode="date"
                            onConfirm={this.handleChangeDateIOS}
                            onCancel={this.hideDatePicker}
                            maximumDate={new Date()}
                          />
                        </View>
                      : <View>
                          <Text style={styles.label}>Fecha de nacimiento</Text>
                          <TouchableOpacity style={styles.input} editable={true} onPress={this.showDatePicker}>
                            <Text style={{color: "#000", paddingVertical: 8, textAlign: 'center'}}>
                              {date 
                                ? `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}` 
                                : `${(new Date()).getDate()}/${(new Date()).getMonth()+1}/${(new Date()).getFullYear()}`
                              }
                            </Text>
                            {showDate && (
                              <DateTimePicker 
                                testID="dateTimePicker"
                                value={date ? date : new Date()}
                                mode={'date'}
                                display="default"
                                is24Hour={true}
                                onChange={this.handleChangeDateAndroid}
                                maximumDate={new Date()}
                              />
                            )}
                          </TouchableOpacity>
                      </View>
                    }
                  </View>
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formRow1}>
                  <Text style={styles.label}>Género</Text>
                  <View style={Platform.OS === 'ios' ? [styles.input, {overflow: 'hidden', paddingHorizontal: 2, paddingVertical: 15}] : [styles.input, {overflow: 'hidden'}]}>
                    <Picker
                      selectedValue={this.state.genero}
                      onValueChange={this.handleChangeGender}
                      style={Platform.OS !== 'ios' ? {marginVertical: 6} : {marginVertical: -80}}
                      itemStyle={Platform.OS === 'ios' && {fontSize: 16, }}
                    >
                      <Picker.Item label="Masculino" value="masculino" />
                      <Picker.Item label="Femenino" value="femenino" />
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={[{flexDirection: 'row', paddingHorizontal: 40, marginBottom: 20}]}><Text style={{color: VERDE}}>Al registrarte aceptas los </Text><TouchableOpacity onPress={() => this.props.navigation.navigate('TerminosCondiciones')}><Text style={{color: VERDE, textDecorationStyle: 'solid', textDecorationLine: 'underline'}}>Términos y Condiciones</Text></TouchableOpacity></View>
              <TouchableOpacity style={styles.boton} onPress={this.handleRegister}>
                <Text style={{color: BLANCO}}>Registrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.boton, {backgroundColor: BLANCO, marginBottom: 50}]}>
                <Text style={[{color: VERDE}]}>¿Ya tienes cuenta? ¡Ingresa!</Text>
              </TouchableOpacity>
            </ScrollView>
        }
        
      </SafeAreaView>
    )
  }
}

function mapStateToProps({loading}){
  return {
    loading
  }
}

export default connect(mapStateToProps)(Register)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLANCO,
    alignItems: 'center',
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
    borderColor: VERDE,
    borderWidth: 1,
    borderRadius: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: VERDE,
  }
})