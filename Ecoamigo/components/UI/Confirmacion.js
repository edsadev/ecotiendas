import React from "react";
import { Text, View, ImageBackground, Image, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { BLANCO, CELESTE, ROJO, VERDE } from '../../utils/colors'

import Patron from '../../utils/images/patron.png'
import Logo from '../../utils/images/LogoSinFondo.png'

import { canjearProducto } from '../../utils/api'
import { toggleLoading, updateEcopuntos } from "../../actions";
import Loading from "./Loading";

class Confirmacion extends React.Component{
  enviarReward = () => {
    const {rewards, authedUser} = this.props
    const premios = [{
      id: rewards.id,
      cantidad: 1,
      ecopuntos: rewards.ecopuntos
    }]
    this.props.dispatch(toggleLoading(this.props.loading))
    canjearProducto(authedUser.id, rewards.ecopuntos, premios)
      .then(res => {
        this.props.dispatch(toggleLoading(this.props.loading))
        if (res.data.success) {
          this.props.dispatch(updateEcopuntos(authedUser.ecopuntos - rewards.ecopuntos))
          this.props.navigation.navigate('Mensaje', {mensaje: 'Transacción realizada con éxito', token: res.data.token})
        } else {
          alert(res.data.mensaje)
          this.props.navigation.goBack()
        }
      })
      .catch(err => {
        console.error(err)
        alert('Hubo un error, intenta nuevamente')
        this.props.navigation.goBack()
        this.props.dispatch(toggleLoading(this.props.loading))
      })
  }
  render(){
    const {rewards} = this.props
    return(
      <View style={{flex: 1}}>
        <ImageBackground source={Patron} style={{width: '100%', height: '100%', backgroundColor: CELESTE}}>
          <View style={[styles.bloqueCeleste]}>
              <Image source={Logo} style={styles.logo}/>
          </View>
          <View style={styles.bloqueBlanco}>
            {this.props.loading 
              ? <Loading />
              : <View style={[styles.bloqueBlanco, {justifyContent: "space-around", marginVertical: '25%'}]}>
                  <Text style={{color: VERDE, fontSize: 36, fontWeight: 'bold'}}>¿Estás seguro?</Text>
                  <Image source={{uri: rewards.foto}} style={{width: 158, height: 106, alignSelf: 'center'}}/>
                  <Text style={{fontWeight: 'bold'}}>{rewards.name}</Text>
                  <Text style={{marginTop: 12}}>Se canjeará {rewards.ecopuntos} ecopuntos</Text>
                  <View style={{marginTop: 24, flexDirection: 'row', justifyContent: "space-around", width: "40%"}}>
                    <TouchableOpacity style={{backgroundColor: VERDE, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 15}} onPress={this.enviarReward}>
                      <Text style={{color: BLANCO, textAlign: 'center'}}>Sí</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: ROJO, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 15}} onPress={() => this.props.navigation.goBack()}>
                      <Text style={{color: BLANCO, textAlign: 'center'}}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            }
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
    alignSelf: 'center',
  },
  bloqueCeleste: {
    paddingTop: Platform.OS !== 'ios' ? 70 : 30,
    paddingBottom: Platform.OS !== 'ios' ? 50 : 30,
  }, 
  bloqueBlanco: {
    flexDirection: 'column',
    backgroundColor: BLANCO,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
})

function mapStateToProps({rewards, loading, authedUser}){
  return {
    rewards,
    loading,
    authedUser
  }
}

export default connect(mapStateToProps)(Confirmacion)