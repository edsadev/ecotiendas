import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { getReporte } from '../../utils/api'
import { ipUrl, puerto } from '../../utils/api'
import Boton from './Boton'


export default class BtnsRegistro extends React.Component{
  handleClick(e, opcion){
    e.preventDefault()
    getReporte(opcion)
      .then(res => {
        console.log(res)
        if (opcion === 'tickets'){
          window.open(`${ipUrl}${puerto}reportes/tickets`, '_blank')
        } 
      })
  }
  render(){
    return (
      <Container className="container-default background-default">
        <Fade>
          <BtnContainer>
            <Boton text="Reporte Histórico" direction="/reporte-historico" />
            <Boton text="Reporte de Stock" direction="/reporte-stock" />
            <Btn onClick={(e) => this.handleClick(e, 'tickets')}>
              <div className="btn">
                <span className="btn-icon">
                  <img alt="flechas" src="./images/flechas.png"/>
                </span>
                <span className="btn-text">
                  <p>
                    Reporte General
                  </p>
                </span>
              </div>
            </Btn>
          </BtnContainer>
        </Fade>
      </Container>
    )
  }
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`

const BtnContainer = styled.div`
  display: flex;
  a{
    margin: 0 12px;
    width: 230px;
    p{
      max-width: 100px;
      text-align: center;
      transform: translate(-5px,0);
    }
  }
`

const Btn = styled.div`
  cursor: pointer;
  div {
    text-align: center;
    width: 230px;
    margin: 0 12px;
    display: flex;
    .btn-text {
      flex-grow: 1;
      p{
        max-width: 100px;
        transform: translate(-5px,0);
      }
    }
  }
`
