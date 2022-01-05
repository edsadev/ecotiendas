import React from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar, ImageBackground, Image, TouchableOpacity, NativeModules, LayoutAnimation, RefreshControl} from 'react-native'
import { connect } from 'react-redux'
import { Feather } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';

import Patron from '../../utils/images/patron.png'
import Logo from '../../utils/images/LogoSinFondo.png'
import Ecotienda from '../../utils/images/Ecotienda.png'
import Botellas from '../../utils/images/Botellas.png'
import Decoración from '../../utils/images/Decoración.png'
import Premios from '../../utils/images/premios.png'
import Moto from '../../utils/images/MOTO.png'

import { unsetUser, updateEcopuntos } from '../../actions'

import { ecotiendasCercanas, getHistorialEcoamigo, getInfoByIdEcoamigo } from '../../utils/api'
import * as Location from 'expo-location'

import { toggleLoading } from '../../actions';
import Loading from './Loading';

import AsyncStorage from '@react-native-async-storage/async-storage';
import remoteConfig from '@react-native-firebase/remote-config';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

import { CELESTE, BLANCO, VERDE, AZUL, CELESTEOSCURO, AMARILLO, NARANJA } from '../../utils/colors'

class Home extends React.Component {
  state = {
    menuBottom: -1000,
    ecotiendas: [],
    refreshing: false,
    historialEcoamigo: []

  }
  componentDidMount(){
    remoteConfig()
      .setDefaults({
        MensajeInferior: '',
        MensajeSuperior: '',
        bloquePromotivo: false,
        bloquePremios: false,
        bloqueEcopicker: false,
        API: 'http://200.93.217.234:5000/',
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then(() => console.log(remoteConfig().getAll()))
    try {
      (async() => {
        let status = await Location.requestForegroundPermissionsAsync()
        if (status.status !== 'granted') {
          Alert.alert('Hubo un error en los permisos')
          return
        }
        let location = await Location.getCurrentPositionAsync({})
        Promise.all([ecotiendasCercanas(location.coords.latitude, location.coords.longitude), getHistorialEcoamigo(this.props.authedUser.id)])
          .then(res => {
            const ids = Object.keys(res[0].data.data)
            this.setState(() => ({
              ecotiendas: ids.map((id) => ({...res[0].data.data[id], id}))
            }))
            return res[1]
          })
          .then(res => {
            if (res.data.success){
              this.setState((state) => ({
                ...state,
                historialEcoamigo: res.data.historial.sort((a,b) => b.id - a.id)
              }))
            }
          })
          .then(() => {
            this.props.dispatch(toggleLoading(true))
          })
          .catch(err => {
            this.props.dispatch(toggleLoading(true)) 
            console.error(err)
          })
      })()
    } catch(err) {
      this.props.dispatch(toggleLoading(true))
      console.log(`Hubo un error al cargar la ubicación: ${err}`)
    }
  }
  handleMenu = () => {
    LayoutAnimation.easeInEaseOut()
    this.setState(() => (
      this.state.menuBottom === 0
        ? {menuBottom: -1000}
        : {menuBottom: 0}
    ))
  }
  onRefresh = () => {
    this.setState((state) => ({
      refreshing: !state.refreshing
    }))
    this.props.dispatch(toggleLoading(false))
    try {
      (async() => {
        let status = await Location.requestForegroundPermissionsAsync()
        if (status.status !== 'granted') {
          Alert.alert('Hubo un error en los permisos')
          return
        }
        let location = await Location.getCurrentPositionAsync({})
        Promise.all([getInfoByIdEcoamigo(this.props.authedUser.id), ecotiendasCercanas(location.coords.latitude, location.coords.longitude), getHistorialEcoamigo(this.props.authedUser.id)])
          .then(res => {
            this.props.dispatch(updateEcopuntos(res[0].data.ecopuntos))
            return res
          })
          .then(res => {
            const ids = Object.keys(res[1].data.data)
            this.setState(() => ({
              ecotiendas: ids.map((id) => ({...res[1].data.data[id]}))
            }))
            return res
          })
          .then(res => {
          })
          .then(() => {
            this.props.dispatch(toggleLoading(true))
            this.setState((state) => ({
              refreshing: !state.refreshing
            }))
          })
          .catch(err => {
            this.props.dispatch(toggleLoading(true)) 
            console.error(err)
          })
      })()
    } catch(err) {
      this.props.dispatch(toggleLoading(true))
      alert('Hubo un error al tratar de obtener tus datos...')
    }
  }
  FlatListItemSeparator = () => {
    return (
      <View style={{height: 2, width: "100%", marginBottom: 15}}>
        <View style={{height: 2, backgroundColor: "rgba(0,0,0,.5)", borderRadius: 5, marginHorizontal: 35}}/>
      </View>
    )
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
    const { authedUser, navigation } = this.props
    const base64Image = `data:image/png;base64,${authedUser.foto}`
    return (
      <SafeAreaView style={[styles.AndroidSafeArea]}>
        {Platform.OS === 'ios' && <StatusBar 
          barStyle={'dark-content'}
        />}
        {this.props.loading
          ? <Loading />
          : <View style={{flex: 1}}>
              <View style={styles.navBar}>
                <TouchableWithoutFeedback accessibilityRole={'menu'} onPress={this.handleMenu}>
                  <Feather name="settings" size={32} color="black" />
                </TouchableWithoutFeedback>
              </View>
              <ScrollView 
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
              >
                <View style={{backgroundColor: CELESTE}}>
                  <ImageBackground source={Patron} style={styles.bloqueCeleste}>
                    <Image source={Logo} style={styles.logo}/>
                  </ImageBackground>
                  <View style={styles.bloqueBlanco}>
                    <View style={styles.info}>
                      <View style={{shadowColor: '#000', shadowOffset: { width: -3, height: 3 }, shadowOpacity: 0.15, shadowRadius: 3, }}>
                        <Image source={{uri: base64Image}} style={styles.avatar}/>
                      </View>
                      <Text style={{color: VERDE, fontSize: 20}}>{authedUser.nombre} {authedUser.apellido}</Text>
                      <Text style={{color: VERDE, fontSize: 22}}>{authedUser.ecopuntos % 1 === 0 ? authedUser.ecopuntos : authedUser.ecopuntos.toFixed(2)}</Text>
                      <Text>Ecopuntos</Text>
                    </View>
                  </View>
                </View>
                {remoteConfig().getBoolean('bloqueEcopicker') && <View style={styles.bloqueEcopicker}>
                  <Text style={{color: AZUL, fontSize: 32, fontWeight: 'bold'}}>Ecopicker</Text>
                  <Image source={Moto} style={{alignSelf: 'center', marginVertical: 20}}/>
                  <TouchableOpacity style={{backgroundColor: AZUL, borderRadius: 25, width: '50%', alignSelf: 'center'}} onPress={() => navigation.navigate('Searching') }>
                    <Text style={{color: BLANCO, fontSize: 22, textAlign: 'center', padding: 10}}>Llamar</Text>
                  </TouchableOpacity>
                </View>}
                <View style={styles.bloqueEcotiendas}>
                  <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 20}}>
                    <Text style={{color: VERDE, fontSize: 32, fontWeight: 'bold'}}>Ecotiendas</Text>
                    <TouchableOpacity style={{backgroundColor: VERDE, borderRadius: 25, alignSelf: 'center'}} onPress={() => navigation.navigate('Ecotiendas')}>
                      <Text style={{color: BLANCO, fontSize: 22, textAlign: 'center', paddingVertical: 10, paddingHorizontal: 20}}>Ver todas</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {this.state.ecotiendas && this.state.ecotiendas.map(ecotienda => (
                      <View key={ecotienda.id} style={{padding: 10}}>
                        <ImageBackground source={Ecotienda} style={{width: 158, height: 106, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{color: BLANCO, fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>{ecotienda.nombre}</Text>
                        </ImageBackground>
                        <TouchableOpacity style={{backgroundColor: BLANCO, padding: 10, zIndex: 100, borderRadius: 20, margin: 15}} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${ecotienda.lat},${ecotienda.lon}`)}>
                          <Text style={{textAlign: 'center'}}>Ver en mapa</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
                {remoteConfig().getBoolean('bloquePromotivo') && <View>
                  <ImageBackground source={Botellas} style={{width: 'auto', height: 180}}>
                    <View style={{marginLeft: 160, justifyContent: 'center', flex: 1}}>
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={Decoración} style={{transform: [{ rotate: "150deg" }]}}/>
                        <Text style={{fontWeight: 'bold', fontSize: 28, color: BLANCO, textAlign: 'center'}}>Super Promo</Text>
                        <Image source={Decoración} />
                      </View>
                      <Text style={{fontSize: 16, color: VERDE, textAlign: 'center', padding: 10}}>{remoteConfig().getString('MensajeSuperior')}</Text>
                      <Text style={{fontSize: 14, color: BLANCO, textAlign: 'center'}}>{remoteConfig().getString('MensajeInferior')}</Text>
                    </View>
                  </ImageBackground>
                </View>}
                <View style={styles.bloqueHistorial}>
                  <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, marginBottom: -20}}>
                    <Text style={{color: VERDE, fontSize: 32, fontWeight: 'bold', flex: 1, textAlign: 'center'}}>Historial de Reciclado</Text>
                  </View>
                  <View style={styles.bloqueBlanco}>
                    <View style={{paddingHorizontal: 30, paddingVertical: 10, flexDirection: 'row', flex: 1}}>
                      <Text style={{flex: 1, fontWeight: 'bold', fontSize: 18}}>Ecotienda</Text>
                      <Text style={{flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: 18}}>Ecopuntos</Text>
                      <Text style={{flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: 18}}>Total Kg</Text>
                    </View>
                    {this.state.historialEcoamigo.length > 0 && this.state.historialEcoamigo.map(ticket => (
                      <View key={ticket.id} style={{paddingHorizontal: 30, paddingVertical: 10, flexDirection: 'row', flex: 1}}>
                        <Text style={{flex: 1}}>{ticket.ecotienda}</Text>
                        <Text style={{flex: 1, textAlign: 'right'}}>{ticket.total_ecopuntos}</Text>
                        <Text style={{flex: 1, textAlign: 'right'}}>{ticket.total_kg.toFixed(2)} Kg</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {remoteConfig().getBoolean('bloquePremios') && <View style={styles.bloquePremios}>
                  <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, marginBottom: -20}}>
                    <Text style={{color: NARANJA, fontSize: 32, fontWeight: 'bold'}}>Premios</Text>
                    <TouchableOpacity style={{backgroundColor: NARANJA, borderRadius: 25, alignSelf: 'center'}} onPress={() => navigation.navigate('Premios')}>
                      <Text style={{color: BLANCO, fontSize: 22, textAlign: 'center', paddingVertical: 10, paddingHorizontal: 20}}>Ver premios</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <Image source={Premios} resizeMode={'contain'} style={{width: '90%'}}/>
                  </View>
                </View>}
              </ScrollView>
              <View style={[styles.menu, {bottom: this.state.menuBottom}]}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10}} onPress={() => navigation.navigate('EditarPerfil')}>
                  <Ionicons name="cog" size={36} color="rgba(0,0,0,.5)" style={{marginHorizontal: 40}}/>
                  <View style={{borderStyle: 'solid', borderColor: 'rgba(0,0,0,.5)', borderBottomWidth: 1, flexGrow: 1, marginRight: 40}}>
                    <Text style={{fontSize: 16, padding: 12 }}>
                      Editar perfil
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
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10}} onPress={() => navigation.navigate('TerminosCondiciones')}>
                  <Ionicons name="ios-information-circle-outline" size={36} color="rgba(0,0,0,.5)" style={{marginHorizontal: 40}}/>
                  <View style={{borderStyle: 'solid', borderColor: 'rgba(0,0,0,.5)', borderBottomWidth: 1, flexGrow: 1, marginRight: 40}}>
                    <Text style={{fontSize: 16, padding: 12 }}>
                      Términos y Condiciones
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
          </View>
        
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  navBar: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingVertical: 20,
  },
  logo: {
    height: 60,
    width: 60,
    alignSelf: 'center',
  },
  bloqueCeleste: {
    paddingBottom: 60,
    paddingTop: 25,
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
  bloqueEcopicker: {
    backgroundColor: CELESTEOSCURO,
    paddingVertical: 40,
    paddingHorizontal: 30
  },
  bloqueEcotiendas: {
    backgroundColor: CELESTE,
    paddingVertical: 30,
  },
  bloqueHistorial: {
    backgroundColor: BLANCO,
    paddingVertical: 30,
  },
  bloquePremios: {
    backgroundColor: AMARILLO,
    paddingVertical: 30,
  },
  menu: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    backgroundColor: BLANCO
  }
})

function mapStateToProps({authedUser, loading}){
  return {
    authedUser,
    loading
  }
}

export default connect(mapStateToProps)(Home)