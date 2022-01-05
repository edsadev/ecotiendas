import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar, TouchableOpacity, Image} from 'react-native'
import { BLANCO, CELESTE, VERDE } from '../../utils/colors'
import * as Linking from 'expo-linking'
import { Ionicons } from '@expo/vector-icons';

import Moto from '../../utils/images/MotoDibujo.png'

export default class Pedido extends React.Component {
  render(){
    const {celular, cliente, fecha_registro, latitud, longitud, pedido_id} = this.props.route.params.orden
    return (
      <SafeAreaView style={[styles.AndroidSafeArea]}>
        {Platform.OS === 'ios' && <StatusBar 
          barStyle={'dark-content'}
        />}
        <View style={{backgroundColor: CELESTE, alignSelf: 'stretch', marginHorizontal: 20, padding: 25, borderRadius: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 1, borderStyle: 'solid', marginBottom: 15, paddingBottom: 5, justifyContent: 'space-between'}}>
            <Text style={{fontSize: 28, fontWeight: 'bold'}}>Pedido #{pedido_id}</Text>
            <Ionicons name="bulb-outline" size={24} color="black"/>
          </View>
          <Text style={{fontSize: 18, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>Cliente: </Text>{cliente}</Text>
          <Text style={{fontSize: 18, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>Fecha: </Text>{(new Date(Date.parse(fecha_registro))).toLocaleDateString()}</Text>
          <Text style={{fontSize: 18, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>Hora: </Text>{(new Date(Date.parse(fecha_registro))).toLocaleTimeString()}</Text>
          <View style={{alignSelf: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Celular: </Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${celular}`)}>
              <Text style={{fontSize: 18, color: VERDE, textDecorationStyle: 'solid', textDecorationColor: VERDE, textDecorationLine: 'underline'}}>{celular}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-around', marginTop: 25}}>
          <TouchableOpacity style={styles.boton} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`)}>
            <Ionicons name="ios-map-outline" size={18} color={BLANCO} style={{marginRight: 10}}/>
            <Text style={{textAlign: 'center', color: BLANCO, fontSize: 18}}>Ir al lugar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boton} onPress={() => this.props.navigation.navigate('NewEntry', {orden: this.props.route.params.orden})}>
            <Ionicons name="ios-cart-outline" size={18} color={BLANCO} style={{marginRight: 10}}/>
            <Text style={{textAlign: 'center', color: BLANCO, fontSize: 18}}>Pesar materiales</Text>
          </TouchableOpacity>
        </View>
        <Image source={Moto} style={{width: "60%"}} resizeMode="contain"/>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: BLANCO,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boton: {
    backgroundColor: VERDE, 
    paddingVertical: 10,
    paddingHorizontal: 15, 
    zIndex: 100, 
    borderRadius: 20, 
    margin: 15,
    flexDirection: 'row'
  }
})