import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { createEcotienda, getEcoZonal, getZonas } from '../../../../utils/api'
import { connect } from 'react-redux'
import GoBackArrow from '../../../UI/GoBackArrow'

import GoogleMapReact from 'google-map-react';

class NewRegional extends React.Component {
  state = {
    lat: -2.171076696849325,
    lng: -79.89203443918525,
    center: {
      lat: -2.171076696849325,
      lng: -79.89203443918525
    },
    zoom: 12,
    ecoZonales: [],
    zonas: []
  }
  check = (e) => {
    e.preventDefault()
    console.log(this.state.lat, this.state.lng, this.ecoZonal.value, 
      this.maxm3.value, this.maxkg.value, this.nombre.value, this.provincia.value, this.ciudad.value, this.fecha.value ,this.zona.value)
  }
  componentDidMount(){
    Promise.all([getEcoZonal(), getZonas()])
      .then(res => {
        console.log(res)
        this.setState(() => ({
          ecoZonales: res[0].data.ecozonales,
          zonas: res[1].data.sectores
        }))
      })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    createEcotienda(JSON.stringify(this.state.lat), JSON.stringify(this.state.lng), this.ecoZonal.value, this.maxm3.value, this.maxkg.value, this.nombre.value, this.provincia.value, this.ciudad.value, this.fecha.value ,this.zona.value)
      .then(res => {
        if(res.data.success === false){
          alert('Algo sucedio, intentalo denuevo ')
          console.error(res.data.mensaje)
        } else {
          alert('Ecotienda creada')
          this.props.history.push('/')
        }
      })
      .catch(err => {
        alert(err)
        console.error(err)
      })
  }
  _onClick = ({ lat, lng }) => {
    this.setState(() => ({
      lat,
      lng
    }))
  }
  render(){
    return (
      <Container className="container-default background-default">
        <Fade>
          <SubContainer>
            <Form>
              <Izq>
                {/* <button onClick={this.check}>asd</button> */}
                <h3 className="title_green"><GoBackArrow classTo="arrow" history={this.props.history}/>Registrar EcoTienda</h3>
                <label className="labelForm">EcoZonal</label>
                <div>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.ecoZonal = input}>
                      {this.state.ecoZonales && this.state.ecoZonales.map((ecozonal) => (
                        <option key={ecozonal.id} value={ecozonal.id}>{ecozonal.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/*<label className="labelForm">EcoSupervisor</label>
                <div>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.ecotienda = input}>
                      <option value="EcoSupervisor1">EcoSupervisor1</option>
                      <option value="EcoSupervisor2">EcoSupervisor2</option>
                    </select>
                  </div>
                </div>*/}
                <label className="labelForm">Localización</label>
                <div className="inputContainer">
                  <input type="text" className="inputSingle" placeholder="Provincia" required ref={(input) => this.provincia = input} list="browsers"/>
                  <datalist id="browsers">
                    <option value="Azuay" />
                    <option value="Bolívar" />
                    <option value="Cañar" />
                    <option value="Carchi" />
                    <option value="Chimborazo" />
                    <option value="Cotopaxi" />
                    <option value="El Oro" />
                    <option value="Esmeraldas" />
                    <option value="Galápagos" />
                    <option value="Guayas" />
                    <option value="Imbabura" />
                    <option value="Loja" />
                    <option value="Los Ríos" />
                    <option value="Manabí" />
                    <option value="Morona Santiago" />
                    <option value="Napo" />
                    <option value="Orellana" />
                    <option value="Pastaza" />
                    <option value="Pichincha" />
                    <option value="Santa Elena" />
                    <option value="Santo Domingo de los Tsáchilas" />
                    <option value="Sucumbíos" />
                    <option value="Tungurahua" />
                    <option value="Zamora Chinchipe" />
                  </datalist>
                  <input type="text" className="inputSingle" placeholder="Ciudad" required ref={(input) => this.ciudad = input}/>
                  <select type="text" className="inputSingle" placeholder="Zona" required ref={(input) => this.zona = input}>
                    {this.state.zonas && this.state.zonas.map((zonas) => (
                      <option key={zonas.id} value={zonas.id}>{zonas.nombre}</option>
                    ))}
                  </select>
                </div>
                <label id="correo" className="labelForm">Capacidad Máxima</label>
                <div className="inputContainer">
                  <input type="text" className="inputSingle" placeholder="Volumen - M³" required ref={(input) => this.maxm3 = input}/>
                  <input type="text" className="inputSingle" placeholder="Peso - Kg" required ref={(input) => this.maxkg = input}/>
                </div>
                <label id="cedula" className="labelForm">Nombre de la EcoTienda</label>
                <div className="inputContainer">
                  <input className="inputSingle" required ref={(input) => this.nombre = input}/>
                </div>
                <div>
                  <label className="labelForm">Fecha de apertura</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.fecha = input} type="date"/>
                  </div>
                </div>
                <button onClick={this.handleSubmit} style={{width: '100%'}} className="btn-form">Registrar</button>
              </Izq>
              <Der>
                <div id="sub">
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyBua99z0BGTt28kcqRTOGTgYGiWS0M5kxc" }}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    onClick={this._onClick}
                  >
                    <Marker
                      lat={this.state.lat}
                      lng={this.state.lng}
                    />
                  </GoogleMapReact>
                </div>
              </Der>
            </Form>
          </SubContainer>
        </Fade>
      </Container>
    )
  }
}


const Marker = () => <div><Img width="40" src="./images/Marcador.png" alt="Marcador"/></div>;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const SubContainer = styled.div`
  width: 70vw;
  min-height: 80vh;
  background-color: white;
  display: flex;
  box-shadow: 0px 0px 20px -5px rgba(0,0,0,0.73);
  border-radius: 40px;
`

const Form = styled.form`
  display: flex;
  width: 100%;
`

const Izq = styled.div`
  width: 40%;
  padding: 24px;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
`

const Der = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  #sub{
    width: 100%;
    height: 90%;
    margin-right: 20px;
    background-color: black;
  }
  input[type="file"] {
    display: none;
  }
  .custom-file-upload {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    margin: 12px 0;
  }
`

const Img = styled.img`
  transform: translate(-50%, -100%);
`

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(NewRegional)