import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

import {Picker} from '@react-native-picker/picker';

import { CELESTE, BLANCO, VERDE, ROJO} from '../../utils/colors'

import { getMaterials } from '../../utils/api'

import { Ionicons } from '@expo/vector-icons'

import { createTicketEcopicker, getOrders} from '../../utils/api'

import { loadOrders } from '../../actions/index'

class NewEntry extends React.Component {
  state = {
    idTicket: "",
    peso: 10,
    materiales: [],
    material: "",
    lista: [],
    page: 0
  }
  componentDidMount(){
    getMaterials()
      .then(res => {
        const id = Object.keys(res.data.materiales)
        this.setState(() => ({materiales: id.map(id => res.data.materiales[id]), material: id[0]}))
      })
  }
  handleAddList = () => {
    const newLista = this.state.lista
    if(!newLista.some(material => material.id_material == this.state.material)){
      newLista.push({id_material: this.state.material, peso: this.state.peso, id: this.state.lista.length})
    }
    this.setState(() => ({
      lista: newLista
    }))
  }
  handleChangeMaterial = (e) => {
    this.setState(() => ({
      material: e
    }))
  }
  handleDelete = (id) => {
    this.setState((state => ({
      lista: state.lista.filter(item => item.id !== id)
    })))
  }
  handleChangePage = (num) => {
    if (this.state.lista.length > 0){
      this.setState(() => ({page: num}))
    } else {
      alert('Debes seleccionar al menos un material')
    }
  }
  handleSubmit = () => {
    const {orden} = this.props.route.params
    console.log(orden)
    console.log(this.state.lista)
    const newLista = []
    this.state.lista.map(item => {
      newLista.push({
        id: item.id_material,
        peso: item.peso
      })
    })
    createTicketEcopicker(orden.pedido_id, this.props.authedUser.id, orden.ecoamigo_id, newLista)
      .then(res => {
        if(res.data.success){
          this.props.navigation.navigate('Mensaje', {mensaje: `Se a creado el ticket de tu pedido. A ${res.data.ticket.cliente} se le han acreditado ${res.data.ticket.total_ecopuntos} ecopuntos`})
          getOrders(this.props.authedUser.id)
            .then(res => {
              if (res.data.success){
                this.props.dispatch(loadOrders(res.data.pedidos))
              } else {
                this.props.dispatch(loadOrders([]))
              }
            })
        } else {
          alert(res.data.mensaje)
        }
      })
      .catch(error => {
        alert('Ocurrio un error, vuelve a intentarlo')
        console.log(error)
      })
  }
  render(){
    return (
      <SafeAreaView style={[styles.AndroidSafeArea]}>
        {Platform.OS === 'ios' && <StatusBar 
          barStyle={'dark-content'}
        />}
        {console.log(this.props.route.params.orden)}
        {this.state.page === 0
          ? <View>
              <View style={styles.bloquePeso}>
                <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center', paddingVertical: 10}}>Peso de material</Text>
                <Text style={{textAlign: 'center', textDecorationLine: 'underline', textDecorationStyle: 'solid', fontSize: 64, paddingVertical: 10}}>{this.state.peso}</Text>
                <TouchableOpacity style={[styles.boton, {marginVertical: 10}]}>
                  <Text style={{color: BLANCO}}>Calcular peso</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 24, paddingVertical: 15, marginTop: 15}}>Tipo de material</Text>
                <View style={styles.formRow}>
                  <View style={styles.formRow1}>
                    <View style={Platform.OS === 'ios' ? [styles.input, {overflow: 'hidden', paddingHorizontal: 2, paddingVertical: 15}] : [styles.input, {overflow: 'hidden'}]}>
                      <Picker
                        selectedValue={this.state.material}
                        onValueChange={this.handleChangeMaterial}
                        style={[Platform.OS !== 'ios' ? {marginVertical: 6} : {marginVertical: -80}]}
                        itemStyle={Platform.OS === 'ios' && {fontSize: 16, }}
                      >
                        {this.state.materiales.length > 0 && this.state.materiales.map(material => (
                          <Picker.Item key={material.id} label={material.nombre} value={material.id}/>
                        ))}
                      </Picker>
                      
                    </View>
                    <View>
                      {this.state.lista.length > 0 
                        ? <ScrollView style={{maxHeight: '50%', marginVertical: 15, borderColor: VERDE, borderStyle: 'solid', borderWidth: 1, borderRadius: 15}} contentContainerStyle={{paddingVertical: 15}} showsVerticalScrollIndicator={false}>
                            {this.state.lista.map(material => (
                                <View key={material.id} style={{flexDirection: 'row', marginHorizontal: 15, alignItems: 'center'}}>
                                  <View style={{justifyContent: 'space-between', flexDirection: 'row', width: '80%'}}>
                                    <Text style={{fontSize: 18}}>{this.state.materiales.find(obj => obj.id == material.id_material).nombre}</Text>
                                    <Text style={{fontSize: 18}}>{material.peso}</Text>
                                  </View>
                                  <TouchableOpacity style={{width: '20%', alignItems: 'center'}} onPress={() => this.handleDelete(material.id)}>
                                    <Ionicons name="close-circle" size={24} color="red" />
                                  </TouchableOpacity>
                                </View>
                              ))
                            }
                          </ScrollView>
                        : <Text style={{textAlign: 'center', fontSize: 18, marginVertical: 15}}>Ingresa al menos un material</Text>
                      }
                      <TouchableOpacity style={[styles.boton, {marginVertical: 10}]} onPress={this.handleAddList}>
                        <Text style={{color: BLANCO}}>Agregar material</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.boton, {marginVertical: 10}]} onPress={() => this.handleChangePage(1)}>
                        <Text style={{color: BLANCO}}>Siguiente</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          : <View style={styles.formRow}>
              <View style={[styles.formRow1]}>
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="cart" size={48} color={VERDE} style={{marginVertical: 25}}/>                  
                    {this.state.lista.map(item => (
                      <View key={item.id} style={{flexDirection: 'row', marginHorizontal: 15, alignItems: 'center', marginVertical: 5}}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', flex: 1}}>
                          <Text style={{fontSize: 18}}>{this.state.materiales.find(obj => obj.id == item.id_material).nombre}</Text>
                          <Text style={{fontSize: 18}}>{item.peso}</Text>
                        </View>
                      </View>
                    ))}
                </View>
                <View style={{marginVertical: 25, flexDirection: 'row', justifyContent: 'space-around'}}>
                  <TouchableOpacity style={[styles.boton, {marginVertical: 10}]} onPress={() => this.handleChangePage(0)}>
                    <Text style={{color: BLANCO}}>Atras</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.boton, {marginVertical: 10}]} onPress={() => this.handleSubmit()}>
                    <Text style={{color: BLANCO}}>Enviar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: BLANCO,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: 'center'
  },
  bloquePeso: {
    backgroundColor: CELESTE,
    marginHorizontal: 40,
    borderRadius: 15,
    padding: 25,
  },
  boton: {
    backgroundColor: VERDE,
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
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
  input: {
    fontSize: 16,
    borderStyle: 'solid',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios'? 8 : 3,
    borderColor: VERDE,
    borderWidth: 1,
    borderRadius: 25,
  },
})

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(NewEntry)