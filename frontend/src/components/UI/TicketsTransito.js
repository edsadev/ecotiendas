import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { getTicketsInTransit } from '../../utils/api'
import { connect } from 'react-redux'

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Link } from 'react-router-dom'

import GoBackArrow from './GoBackArrow'

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

class TicketsTransito extends React.Component {
  state = {
    tickets: []
  }
  componentDidMount(){
    getTicketsInTransit(this.props.authedUser.id)
      .then(res => {
        console.log(res)
        if (res.data.success){
          this.setState((state) => ({
            ...state,
            tickets: res.data.tickets
          }))
        } else {
          alert(res.data.mensaje)
          this.props.history.goBack()
        }
      })
  }
  handleClick = () => {
    this.props.history.goBack()
  }
  render(){
    return (
      <Container className="container-default background-default">
        <Fade>
          <SubContainer>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <GoBackArrow goTo={'/'} history={this.props.history}/>
              <h2 style={{color: 'rgba(2,115,95, 1)', marginLeft: '15px'}}>Tickets</h2>
            </div>
            <TicketContainer>
              {this.state.tickets.length > 0 && this.state.tickets.map(ticket => (
                <Ticket>
                  <Titulo>
                    <h3>Ticket #{ticket.id}</h3>
                    <ErrorOutlineIcon />
                  </Titulo>
                  <Cuerpo>
                    <Interno>
                      <P><h4 style={{marginBottom: '5px'}}>EcoPicker:</h4><span style={{marginLeft: '10px'}}>{ticket.ecopicker}</span></P>
                      <P><h4 style={{marginBottom: '5px'}}>Fecha:</h4><span style={{marginLeft: '10px'}}>{(new Date(Date.parse(ticket.fecha))).toLocaleDateString()}</span></P>
                      <P><h4 style={{marginBottom: '5px'}}>Hora:</h4><span style={{marginLeft: '10px'}}>{(new Date(Date.parse(ticket.fecha))).toLocaleTimeString()}</span></P>
                    </Interno>
                    <Interno>
                      <P><h4 style={{marginBottom: '5px'}}>Celular del EcoPicker:</h4><span style={{marginLeft: '10px'}}>{ticket.telefono}</span></P>
                      <P><h4 style={{marginBottom: '5px'}}>Cliente atendido:</h4><span style={{marginLeft: '10px'}}>{ticket.cliente}</span></P>
                      <P><h4 style={{marginBottom: '5px'}}>Ecopuntos dados:</h4><span style={{marginLeft: '10px'}}>{ticket.total_ecopuntos}</span></P>
                    </Interno>
                    <Link to={`/transito/${ticket.id}`} style={{alignSelf: 'center'}}>
                      <Boton>
                        <ArrowForwardIcon style={{color: 'rgba(2,115,95, 1)',}}/>
                        <p>Revisar</p>
                        <p>ticket</p>
                      </Boton>
                    </Link>
                  </Cuerpo>
                </Ticket>
              ))}
            </TicketContainer>
          </SubContainer>
        </Fade>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 76vw; 
  height: 80vh;
  background-color: white;
  border-radius: 20px;
  padding: 30px;
`

const TicketContainer = styled.div`
  overflow-y: scroll;
  padding-right: 20px;
  /* width */
  ::-webkit-scrollbar {
    width: 12px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey; 
    border-radius: 10px;
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgba(2,115,95, 1); 
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(2,115,95, 0.8); 
  }
`

const Ticket = styled.div`
  display: flex;
  background-color: #B2DDE7;
  margin-block: 10px;
  border-radius: 20px;
  padding: 25px;
  padding-bottom: 10px;
  flex-direction: column;
`

const Titulo = styled.div`
  border-block-end: 1px solid black; 
  align-self: stretch; 
  display: flex; 
  justify-content: space-between; 
  padding-bottom: 5px;
`

const Cuerpo = styled.div`
  display: flex;
  justify-content: space-between;
`

const Interno = styled.div`
  padding: 15px;
  flex: 1;
`

const P = styled.p`
  margin-block: 5px;
`

const Boton = styled.button`
  padding: 20px;
  border-radius: 20px;
  border: 1px solid black;
  cursor: pointer;
`

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(TicketsTransito)