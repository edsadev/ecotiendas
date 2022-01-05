import React from "react";
import { Text, View, ImageBackground, Image, StyleSheet, TouchableOpacity, TextInput, StatusBar, SafeAreaView } from "react-native";
import { connect } from "react-redux";

import { BLANCO, CELESTE, ROJO, VERDE } from '../../utils/colors'

import Patron from '../../utils/images/patron.png'
import Logo from '../../utils/images/LogoSinFondo.png'
import { ScrollView } from "react-native-gesture-handler";

class Reportar extends React.Component{
  enviarReward = () => {
    this.props.navigation.navigate('Mensaje', {mensaje: 'Reporte enviado con éxito'})
  }
  render(){
    return(
      <ScrollView style={styles.AndroidSafeArea}>
        <ImageBackground source={Patron} style={{width: '100%', height: '100%', backgroundColor: CELESTE, flex: 1}}>
          <View style={[styles.bloqueCeleste]}>
              <Image source={Logo} style={styles.logo}/>
          </View>
          <View style={styles.bloqueBlanco}>
            <Text style={{color: VERDE, fontSize: 36, fontWeight: 'bold'}}>¿Tienes un problema?</Text>
            <Text style={{marginVertical: 24, fontSize: 18}}>Por favor, déjanos tus comentarios</Text>
            <View style={{backgroundColor: "rgba(0,0,0,.1)", width: '80%', paddingHorizontal: 20, paddingVertical: 15, maxHeight: 100, borderRadius: 25}}>
              <TextInput multiline={true} numberOfLines={3}/>
            </View>
            <View style={{marginTop: 24, flexDirection: 'row', justifyContent: "space-around", width: "40%"}}>
              <TouchableOpacity style={{backgroundColor: VERDE, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 15}} onPress={this.enviarReward}>
                <Text style={{color: BLANCO, textAlign: 'center', fontSize: 18}}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
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
    backgroundColor: BLANCO,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    paddingTop: 40,
    alignItems: 'center'
  },
})

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(Reportar)