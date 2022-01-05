import React from "react";
import {View, Image, Animated, Easing} from "react-native";

import loading from '../../utils/images/loading.png'

export default class Loading extends React.Component{
  rotateValue = new Animated.Value(0)
  componentDidMount(){
    Animated.loop(
      Animated.timing(this.rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true, // <-- Add this
        easing: Easing.linear
      })
    ).start()
  }
  render(){
    const spin = this.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return(
      <Animated.View style={{transform: [{ rotate: spin }], flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={loading} style={{width: 100, height: 100}}/>
        </View>
      </Animated.View>
    )
  }
}