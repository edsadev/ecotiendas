import styled from 'styled-components'
import React from 'react'
import { connect } from 'react-redux'
import { getInfoByIdEcoamigo } from '../utils/api'

class ReviewPoints extends React.Component {
  state = {
    ecopuntos: 0,
    nombre: ""
  }
  componentDidMount(){
    getInfoByIdEcoamigo(this.props.authedUser.id)
    .then(res => {
      this.setState(() => ({
        ecopuntos: res.data.ecopuntos,
        nombre: res.data.nombre
      }))
    })
  }
  render() {
    return (
      <Container2>
          <img className="logo" alt="logo" src="./images/logo_2.png"></img>
          <h2>{this.state.nombre}</h2>
          <Span>{this.state.ecopuntos}<br/>Puntos</Span>
      </Container2>
    )
  }
}

const Container = styled.div`
  background-image: url('./images/peopleHuging.png');
  background-size: cover;
  background-position: center;
  font-family: helvetica;
  min-height: 100vh;
  padding: 0 0 0 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  * {
    margin: 20px;
  }
  h1 {
    font-weight: 400;
    text-align: center;
    font-size: 28px;
    padding: 0px 24px;
    line-height: 36px;
  }
  button {
    font-size: 16px;
    padding: 16px 20vw;
  }
  @media (max-width: 780px){
    #apoyo{
      margin-bottom: 300px;
    }
  }
`
const Container2 = styled(Container)`
  margin: 0;
  background-image: url('./images/fondo-reviewPoints.png');
  background-size: cover;
  h2 {
    text-align: center;
  }
`

const Span = styled.span`
  text-align: center;
  border: 5px solid rgba(0,104,0,1);
  padding: 27px 25px;
  border-radius: 50%;
` 

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(ReviewPoints)