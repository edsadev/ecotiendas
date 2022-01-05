import React from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar, Image, TouchableOpacity, NativeModules, LayoutAnimation, RefreshControl} from 'react-native'
import { connect } from 'react-redux'
import { Feather } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';

import { unsetUser, toggleLoading } from '../../actions';

import { loadOrders } from '../../actions/index'

import { CELESTE, BLANCO, VERDE, CELESTEOSCURO} from '../../utils/colors'
import { getOrders } from '../../utils/api';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class Home extends React.Component {
  state = {
    menuBottom: -1000,
    refreshing: false,
  }
  handleMenu = () => {
    LayoutAnimation.easeInEaseOut()
    this.setState(() => (
      this.state.menuBottom === 0
        ? {menuBottom: -1000}
        : {menuBottom: 0}
    ))
  }
  componentDidMount(){
    this.props.dispatch(toggleLoading(true))
    getOrders(this.props.authedUser.id)
      .then(res => {
        if (res.data.success){
          this.props.dispatch(loadOrders(res.data.pedidos))
        }
      })
  }
  onRefresh = () => {
    this.setState((state) => ({
      refreshing: !state.refreshing
    }))
    try {
      (async() => {
        getOrders(this.props.authedUser.id)
          .then(res => {
            if(res.data.success){
              this.props.dispatch(loadOrders(res.data.pedidos))
            } else {
              alert(res.data.mensaje)
            }
          })
        this.setState((state) => ({
          refreshing: !state.refreshing
        }))
        return true
      })()
    } catch(err) {
      alert('Hubo un error al tratar de recargar...')
    }
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
    const { authedUser, navigation } = this.props
    const { orders } = this.props.orders
    const base64Image = `data:image/png;base64,${authedUser.foto}`
    console.log('redux Orders',this.props.orders)
    return (
      <SafeAreaView style={[styles.AndroidSafeArea]}>
        {Platform.OS === 'ios' && <StatusBar 
          barStyle={'dark-content'}
        />}
        <View style={styles.navBar}>
          <TouchableWithoutFeedback accessibilityRole={'menu'} onPress={this.handleMenu}>
            <Feather name="settings" size={32} color="white" />
          </TouchableWithoutFeedback>
        </View>
        <View style={{flex: 1, backgroundColor: CELESTEOSCURO}}>
          <View style={styles.bloquePremios}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 20}}>
              <Text style={{color: VERDE, fontSize: 32, fontWeight: 'bold'}}>Pedidos</Text>
            </View>
            <ScrollView 
              style={{flex: 1}} 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{paddingBottom: 25}}
              refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
              }
            >
              {orders && orders.length > 0 && orders.map((orden) => (
                <View key={orden.pedido_id} style={{padding: 10, backgroundColor: CELESTE, flexDirection: 'row', marginVertical: 5, marginHorizontal: 15, borderRadius: 15, alignItems: 'center'}}>
                  <View style={{paddingLeft: 15, flex: 1}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>{orden.cliente}</Text>
                    <Text style={{fontSize: 16}}>{(new Date(Date.parse(orden.fecha_registro))).toLocaleDateString()} {(new Date(Date.parse(orden.fecha_registro))).toLocaleTimeString()}</Text>
                    <Text style={{fontSize: 16}}>Cel: {orden.celular}</Text>
                  </View>
                  <TouchableOpacity style={{backgroundColor: BLANCO, padding: 10, zIndex: 100, borderRadius: 20, margin: 15}} onPress={() => navigation.navigate('Pedido', {orden})}>
                    <Text style={{textAlign: 'center'}}>Ver pedido</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={[styles.menu, {bottom: this.state.menuBottom}]}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10}} onPress={() => navigation.navigate('EditarPerfil')}>
            <Ionicons name="person-circle-outline" size={36} color="rgba(0,0,0,.5)" style={{marginHorizontal: 40}}/>
            <View style={{borderStyle: 'solid', borderColor: 'rgba(0,0,0,.5)', borderBottomWidth: 1, flexGrow: 1, marginRight: 40}}>
              <Text style={{fontSize: 16, padding: 12 }}>
                Ver perfil
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10}} onPress={() => navigation.navigate('Reportar')}>
            <Ionicons name="ios-warning-outline" size={36} color="rgba(0,0,0,.5)" style={{marginHorizontal: 40}}/>
            <View style={{borderStyle: 'solid', borderColor: 'rgba(0,0,0,.5)', borderBottomWidth: 1, flexGrow: 1, marginRight: 40}}>
              <Text style={{fontSize: 16, padding: 12 }}>
                Reportar un problema
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10}} onPress={this.handleLogout}>
            <Ionicons name="exit" size={36} color="rgba(0,0,0,.5)" style={{marginHorizontal: 40}}/>
            <View style={{borderStyle: 'solid', borderColor: 'rgba(0,0,0,.5)', borderBottomWidth: 1, flexGrow: 1, marginRight: 40}}>
              <Text style={{fontSize: 16, padding: 12 }}>
                Salir
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: CELESTEOSCURO,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  navBar: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingVertical: 20,
    backgroundColor: CELESTEOSCURO
  },
  logo: {
    height: 60,
    width: 60,
    alignSelf: 'center',
  },
  bloqueBlanco: {
    backgroundColor: BLANCO,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 40,
  },
  info: {
    position: 'relative',
    top: -70,
    alignItems: 'center',
    marginBottom: -30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 20, 
  },
  bloquePremios: {
    backgroundColor: BLANCO,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    flex: 1,
  },
  menu: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 25,
    backgroundColor: BLANCO
  },
})

function mapStateToProps({authedUser, orders}){
  return {
    authedUser,
    orders
  }
}

export default connect(mapStateToProps)(Home)