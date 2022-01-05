import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { connect } from 'react-redux'

import { HomeStackNavigator, MainStackNavigator, MovilEcotienda } from './components/Navigation/StackNavigator'

import remoteConfig from '@react-native-firebase/remote-config';

class App extends React.Component {
  componentDidMount(){
    remoteConfig()
      .setDefaults({
        'API': 'http://localhost:5000/',
        'bloqueEcopicker': false
      })
      .then(() => remoteConfig().fetchAndActivate())
      .catch(err => console.log(err))
  }
  render(){
    const {authedUser} = this.props
    if (!authedUser){
      return (
        <NavigationContainer styles={styles.container}>
          <MainStackNavigator/>
        </NavigationContainer>
      )
    }

    if (authedUser.rango === "ecoamigo"){
      return (
        <NavigationContainer styles={styles.container}>
          <HomeStackNavigator/>
        </NavigationContainer>
      )
    } else if (authedUser.rango === "ecotienda_movil"){
      return (
        <NavigationContainer styles={styles.container}>
          <MovilEcotienda/>
        </NavigationContainer>
      )
    } else {
      return (
        <View styles={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Usa la página web</Text>
        </View>
      )
    }  
  }
}

function mapStateToProps({ authedUser }){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})
