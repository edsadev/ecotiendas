import React from 'react'
import { Platform } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from '../../components/UI/Main'
import Login from '../../components/UI/Login'
import EditarPerfil from '../../components/HOC/EditarPerfil'
import Home from '../../components/UI/Home'
import Confirmacion from '../../components/UI/Confirmacion'
import Searching from '../../components/HOC/Searching'
import Mensaje from '../../components/UI/Mensaje'
import Reportar from '../UI/Reportar'
import NewEntry from '../HOC/NewEntry'
import Pedido from '../UI/Pedido'

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
        name="Confirmacion"
        component={Confirmacion}
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Confirma tu premio', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="Searching"
        component={Searching}
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Buscando ecopicker', headerBackTitleVisible: false}}
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
      <Stack.Screen
        name="NewEntry"
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Ticket', headerBackTitleVisible: false}}
        component={NewEntry}
      />
      <Stack.Screen
        name="Pedido"
        options={Platform.OS !== 'ios' ? {headerShown: false} :{title: 'Pedido', headerBackTitleVisible: false}}
        component={Pedido}
      />
    </Stack.Navigator>
  )
}

export {MainStackNavigator, HomeStackNavigator}