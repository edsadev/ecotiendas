import React from 'react'
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, SectionList} from 'react-native'
import { connect } from 'react-redux'
import Loading from './Loading'

import Patron from '../../utils/images/patron.png'
import Logo from '../../utils/images/LogoSinFondo.png'

import { CELESTE, BLANCO, VERDE, ROJO } from '../../utils/colors'

import { setReward, toggleLoading } from '../../actions'

import { getPremios } from '../../utils/api'

class Premios extends React.Component {
  state={
    DATA: [{
      title: 'Premios',
      data: []
    }]
  }
  FlatListItemSeparator = () => {
    return (
      <View style={{height: 2, width: "100%", marginBottom: 15}}>
        <View style={{height: 2, backgroundColor: "rgba(0,0,0,.5)", borderRadius: 5, marginHorizontal: 35}}/>
      </View>
    )
  }
  setReward = (id, name, ecopuntos, userId, foto) => {
    this.props.dispatch(setReward(id, name, ecopuntos, userId, foto))
    this.props.navigation.navigate('Confirmacion')
  }
  componentDidMount(){
    this.props.dispatch(toggleLoading(this.props.loading))
    getPremios()
      .then(res => {
        const data = res.data.premios.map(premio => ({id: premio.id, ecopuntos: premio.ecopuntos, foto: premio.foto, nombre: premio.nombre, stock: premio.stock}))
        this.setState((state) => ({
          DATA: [{...state.DATA, data}]
        }))
        this.props.dispatch(toggleLoading(this.props.loading))
      })
      .catch(err => {
        this.props.dispatch(toggleLoading(this.props.loading))
        alert('Hubo un error al tratar de obtener los premios')
        console.error(err)
      })
  }
  render(){
    return(
      <View style={{flex: 1}}>
        {this.props.loading && <Loading />}
        <ImageBackground source={Patron} style={{width: '100%', height: '100%', backgroundColor: CELESTE}}>
          <View style={[styles.bloqueCeleste]}>
              <Image source={Logo} style={styles.logo}/>
          </View>
          <View style={styles.bloqueBlanco}>
            <SectionList 
              sections={this.state.DATA}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <View key={item.id} style={{justifyContent: 'center'}}>
                  <Image source={{uri: item.foto}} style={{width: 158, height: 106, alignSelf: 'center'}}/>
                  <Text style={{textAlign: 'center', margin: 10, fontSize: 16, fontWeight: 'bold'}}>{item.nombre}</Text>
                  {item.stock < 10 && <Text style={{textAlign: 'center', color: ROJO}}>¡Apresurate! Quedan {item.stock} unidades</Text>}
                  <Text style={{textAlign: 'center', marginBottom: 10}}>Válido por {item.ecopuntos} ecopuntos</Text>
                  <TouchableOpacity 
                    style={{backgroundColor: VERDE, borderRadius: 25, marginBottom: 15, marginHorizontal: 35}}
                    onPress={() => this.setReward(item.id, item.nombre, item.ecopuntos, this.props.authedUser.id, item.foto)}
                  >
                    <Text style={{color: BLANCO, padding: 10, textAlign: 'center'}}>Canjear premio</Text>
                  </TouchableOpacity>
                </View>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={{color: VERDE, fontSize: 22, marginVertical: 25, textAlign: 'center'}}>{title}</Text>
              )}
              ItemSeparatorComponent={this.FlatListItemSeparator}
            />
          </View>
        </ImageBackground>
      </View>
    )
  }
}

function mapStateToProps({loading, authedUser}){
  return {
    loading,
    authedUser
  }
}

export default connect(mapStateToProps)(Premios)

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
    alignItems: 'stretch'
  },
  container: {
    alignItems: 'center',
    width: '100%'
  }
})