import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';

import { HomeStackNavigator, MainStackNavigator } from './components/Navigation/StackNavigator'

import ErrorCuenta from './components/UI/ErrorCuenta'

class App extends React.Component {

  render(){
    const {authedUser} = this.props
    if (!authedUser){
      return (
        <NavigationContainer styles={styles.container}>
          <MainStackNavigator/>
        </NavigationContainer>
      )
    }

    if (authedUser.rango === "ecopicker"){
      return (
        <NavigationContainer styles={styles.container}>
          <HomeStackNavigator/>
        </NavigationContainer>
      )
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ErrorCuenta />
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
});
