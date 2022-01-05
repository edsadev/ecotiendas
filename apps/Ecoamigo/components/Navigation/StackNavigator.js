import React from 'react'
import { Platform } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from '../UI/Main'
import Login from '../UI/Login'
import Registro from '../HOC/Registro'
import EditarPerfil from '../HOC/EditarPerfil'
import Home from '../UI/Home'
import Premios from '../UI/Premios'
import Confirmacion from '../UI/Confirmacion'
import Ecotiendas from '../HOC/Ecotiendas'
import Searching from '../HOC/Searching'
import Mensaje from '../UI/Mensaje'
import TerminosCondiciones from '../UI/TerminosCondiciones'
import Reportar from '../UI/Reportar'
import Update from '../UI/Update'

const Stack = createNativeStackNavigator()

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen 
        name="Main" 
        component={Main}  
        options={{headerShown: false}}
      />  
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={Platform.OS !== 'ios' ? {headerShown: false} : {headerBackTitleVisible: false}}
      />
      <Stack.Screen 
        name="Registro" 
        component={Registro} 
        options={Platform.OS !== 'ios' ? {headerShown: false} : {headerBackTitleVisible: false}}
        headerBackTitleVisible={false}
      />
      <Stack.Screen
        name="TerminosCondiciones"
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Terminos y Condiciones', headerBackTitleVisible: false}}
        component={TerminosCondiciones}
      />
    </Stack.Navigator>
  )
}

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Premios"
        component={Premios}
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Confirma tu premio', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="Confirmacion"
        component={Confirmacion}
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Confirma tu premio', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="Ecotiendas"
        component={Ecotiendas}
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Ecotiendas', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="Searching"
        component={Searching}
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Buscando ecopicker', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="TerminosCondiciones"
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Terminos y Condiciones', headerBackTitleVisible: false}}
        component={TerminosCondiciones}
      />
      <Stack.Screen
        name="Reportar"
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Reportar un problema', headerBackTitleVisible: false}}
        component={Reportar}
      />
      <Stack.Screen
        name="EditarPerfil"
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Editar perfil', headerBackTitleVisible: false}}
        component={EditarPerfil}
      />
      <Stack.Screen
        name="Mensaje"
        options={{headerShown: false}}
        component={Mensaje}
      />
    </Stack.Navigator>
  )
}

const MovilEcotienda = () => {
  return (
    <Stack.Navigator initialRouteName="Update">
      <Stack.Screen 
        name="Update" 
        component={Update} 
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Mensaje"
        options={{headerShown: false}}
        component={Mensaje}
      />
    </Stack.Navigator>
  )
}

export {MainStackNavigator, HomeStackNavigator, MovilEcotienda}