import React from 'react'
import styled from 'styled-components'
import GoogleMapReact from 'google-map-react';
import Fade from 'react-reveal/Fade'
import { connect } from 'react-redux';
import { getMarkersMap } from '../../utils/api'
import GoBackArrow from './GoBackArrow'

class MapaEcotiendas extends React.Component{
  state = {
    center: {
      lat: -1.6659955,
      lng: -78.6930389,
    },
    zoom: 7,
    pines: []
  }
  _onChildClick = (id, event) => {
    this.props.history.push(`/ecotiendas/${event.id}`)
  }
  componentDidMount(){
    if (this.props.authedUser.rank === 'keyUser' || this.props.authedUser.rank === 'administrativo'){
      getMarkersMap(false)
        .then(res => {
          if(res.data.success === true){
            console.log(res)
            this.setState(() => ({
              pines: res.data.pines
            }))
          } else {
            alert("Algo sucedio")
            console.error(res.data.mensaje)
          }
        })
    } else if (this.props.authedUser.rank === 'ecozonal'){
      getMarkersMap(true, this.props.authedUser.id)
        .then(res => {
          if(res.data.success === true){
            console.log(res)
            this.setState(() => ({
              pines: res.data.pines
            }))
          } else {
            alert("Algo sucedio")
            console.error(res.data.mensaje)
          }
        })
    }
  }
  render(){
    return(
      <Container className="container-default background-default">
        <Fade>
          <BackgroundContainer>
            <GoBackArrow history={this.props.history} classTo={"flechaMapa"}/>
            <SubContainer>
              <GoogleMapReact
                bootstrapURLKeys={{ 
                  key: "AIzaSyAQchOFADA-fkZY7nrx4DgEzrjLM3y96AE",
                  language: 'en'
                }}
                defaultCenter={this.state.center}
                defaultZoom={this.state.zoom}
                onChildClick={this._onChildClick}
              >
                {this.state.pines && this.state.pines.map((pin) => (
                  <Marker
                    key={pin.id}
                    id={pin.id}
                    lat={parseFloat(pin.latitud)}
                    lng={parseFloat(pin.longitud)}
                  />
                ))}
              </GoogleMapReact>
            </SubContainer>
          </BackgroundContainer>
        </Fade>
      </Container>
    )
  }
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  `

const SubContainer = styled.div`
  width: 75vw;
  height: 85vh;
  min-height: 80vh;
`

const BackgroundContainer = styled.div`
  width: 75vw;
  position: relative;
  height: 85vh;
  background-color: white;
  box-shadow: 0px 0px 20px -5px rgba(0,0,0,0.73);
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`

const Marker = () => <div><Img width="40" src="./images/Marcador.png" alt="Marcador"/></div>;

const Img = styled.img`
  transform: translate(-50%, -50%);
  cursor: pointer;
`

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(MapaEcotiendas)