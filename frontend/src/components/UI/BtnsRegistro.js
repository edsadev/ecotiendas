import React from 'react'
import Boton from './Boton'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'

export default function BtnsRegistro(){
  return (
    <Container className="container-default background-default">
      <Fade>
        <Subcontainer>
          <BtnContainer>
            <Boton text="Registrar EcoZonal" direction="/new-ecozonal" />
            {/* <Boton text="Registrar EcoSupervisor" direction="/new-ecosupervisor" /> */}
            <Boton text="Registrar EcoTienda" direction="/new-ecotienda" />
            <Boton text="Registrar EcoAdmin" direction="/new-ecoadmin" />
          </BtnContainer>
          <BtnContainer>
            <Boton text="Registrar Producto" direction="/new-product" />
            <Boton text="Registrar Premio" direction="/new-reward" />
          </BtnContainer>
        </Subcontainer>
        <Img src="./images/ilustraBotones.png"></Img>
      </Fade>
    </Container>
  )
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
`

const Subcontainer = styled.div`
  display: flex;
  flex-flow: row;
`

const BtnContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  a {
    margin: 24px;
    text-align: center;
    width: 230px;
    display: flex;
    .btn-text {
      flex-grow: 1;
      p{
        max-width: 100px;
        transform: translate(-5px,0)
      }
    }
  }
`

const Img = styled.img`
  width: 500px;
`
