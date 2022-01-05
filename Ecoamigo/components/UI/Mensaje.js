import React, { useRef } from "react";
import { Text, View, StyleSheet, ImageBackground, Image, Animated, StatusBar, SafeAreaView, TouchableOpacity} from "react-native";

import Patron from '../../utils/images/patron.png'
import Logo from '../../utils/images/LogoSinFondo.png'
import Verificado from '../../utils/images/verificado.png'

import { CELESTE, BLANCO, VERDE } from '../../utils/colors'

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }
    ).start();
  }, [fadeAnim])

  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      <Image source={Verificado}></Image>
    </Animated.View>
  );
}

export default class Mensaje extends React.Component{
  render(){
    return(
      <SafeAreaView style={styles.AndroidSafeArea}>
        <ImageBackground source={Patron} style={{width: '100%', height: '100%', backgroundColor: CELESTE}}>
          <View style={[styles.bloqueCeleste]}>
              <Image source={Logo} style={styles.logo}/>
          </View>
          <View style={styles.bloqueBlanco}>
            <Text style={{color: VERDE, fontSize: 36, fontWeight: 'bold'}}>¡Gracias!</Text>
            <FadeInView/>
            <Text style={{marginTop: 12, fontSize: 22, textAlign: 'center', marginHorizontal: 20}}>{this.props.route.params.mensaje}</Text>
            {this.props.route.params.token && <Text style={{marginTop: 12, fontSize: 24, textAlign: 'center', marginHorizontal: 20}}>Token: {this.props.route.params.token}</Text>}
            <TouchableOpacity style={{backgroundColor: VERDE, borderRadius: 25, alignSelf: 'center'}} onPress={() => this.props.navigation.popToTop()}><Text style={{color: BLANCO, fontSize: 22, textAlign: 'center', paddingVertical: 10, paddingHorizontal: 20}}>Finalizar</Text></TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
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
    flexDirection: 'column',
    backgroundColor: BLANCO,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1, 
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: "30%"
  },
})