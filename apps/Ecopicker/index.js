import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import React from 'react';

class MainApp extends React.Component{
  render(){
    return (
      <Provider store={createStore(reducer)}>
        <App />
      </Provider>
    )
  }
}
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(MainApp);
