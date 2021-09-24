import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export default function Pregunta(props){
  return (
    <Container className="container-default background-default centerContainer">
      <SubContainer className="centerContainer">
        <Link className="btn-form" to="/new-client">Registrar usuario</Link>
        <Link className="btn-form" to="/new-entry">Usuario ya registrado</Link>
      </SubContainer>
    </Container>
  )
}

const Container = styled.div`
  min-height: 100vh;
`
const SubContainer = styled.div`
  max-width: 500px;
  max-height: 300px;
  width: 75vw;
  height: 75vh;
  background-color: white;
  box-shadow: 0px 0px 12px -1px rgba(0,0,0,0.73);
  border-radius: 40px;
  flex-flow: column;
  justify-content: space-around;
  padding: 60px 0;
`



