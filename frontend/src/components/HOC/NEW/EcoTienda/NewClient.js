import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { getZonas, createEcoAmigo } from '../../../../utils/api'
import { connect } from 'react-redux'

class NewClient extends React.Component {
  state={
    sectores: []
  }
  componentDidMount(){
    getZonas()
      .then((res) => {
        const sectoresId = Object.keys(res.data.sectores)
        let sectoresOrdenados = []
        sectoresId.map((id) => sectoresOrdenados.push(res.data.sectores[id]))
        sectoresOrdenados = sectoresOrdenados.sort((a,b) => {
          if(a.nombre < b.nombre){
            return -1
          } else if(a.nombre > b.nombre) {
            return 1
          } else {
            return 0
          }
        })
        this.setState(() => ({
          sectores: sectoresOrdenados
        }))
      })
      .catch((err) => {
        console.error('Hubo un error al tratar de obtener los sectores: ', err)
      })
  }
  check = () => {
    console.log(this.cedula.value, this.nombre.value, this.apellido.value, this.direccion.value, this.genero.value, this.correo.value, this.celular.value, this.sector.value, this.fecha.value)
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const fecha_nacimiento = this.fecha.value
    createEcoAmigo(this.cedula.value, this.nombre.value, this.apellido.value, this.direccion.value, this.genero.value, this.correo.value, this.celular.value, Number.parseInt(this.sector.value), fecha_nacimiento)
      .then(res => {
        if(res.data.success === false){
          alert('Algo sucedio, intentalo denuevo')
          console.error(res.data.mensaje)
        } else {
          alert('Usuario creado')
          this.props.history.push('/new-entry')
        }
      })
      .catch(err => {
        alert(err)
        console.error(err)
      })
  }
  render(){
    return (
      <Container className="container-default">
        <Izq>
          <Fade>
            <form>
              {/* <button onClick={this.check}>asd</button> */}
              <h3 className="title_green" style={{margin: '16px 0 6px 0'}}>Registrar Usuario</h3>
              <label className="labelForm">Nombre y apellido</label>
              <div className="inputContainer">
                <input className="inputLeft" placeholder="Nombre" required ref={(input) => this.nombre = input}/>
                <input className="inputRight" placeholder="Apellido" required ref={(input) => this.apellido = input}/>
              </div>
              <label id="correo" className="labelForm">Correo Electrónico</label>
              <div className="inputContainer">
                <input type="email" className="inputSingle" placeholder="ejemplo@mail.com" required ref={(input) => this.correo = input}/>
              </div>
              <label id="cedula" className="labelForm">Número de cédula</label>
              <div className="inputContainer">
                <input className="inputSingle" placeholder="xxxxxxxxxx" maxLength='10' required ref={(input) => this.cedula = input}/>
              </div>
              <div className="flexBoxHorizontal">
                <div>
                  <label className="labelForm">Género</label>
                  <div className="inputContainer">
                    <select className="littleSelect" required ref={(input) => this.genero = input}>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                  </div>
                </div>
                <div style={{marginLeft: '24px', flexGrow: 1}}>
                  <label className="labelForm">Fecha de nacimiento</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.fecha = input} type="date"/>
                  </div>
                </div>
              </div>
              <label id="celular" className="labelForm">Número de celular</label>
              <div className="inputContainer">
                <input className="inputSingle" maxLength="10" required ref={(input) => this.celular = input}/>
              </div>
              <label className="labelForm">Dirección</label>
              <div className="inputContainer">
                <input className="inputSingle" required ref={(input) => this.direccion = input}/>
              </div>
              <div>
                <label className="labelForm">Región</label>
                <div className="inputContainer">
                  <select className="inputSingle" required ref={(input) => this.sector = input}>
                    {this.state.sectores.length !== 0 && this.state.sectores.map((sector) => (
                      <option key={sector.id} id={sector.id} value={sector.id}>{sector.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={this.handleSubmit} style={{margin: '0 0 40px 0', width: '100%'}} className="btn-form">Registrar</button>
            </form>
          </Fade>
        </Izq>
        <Der>
          <Fade>
            <img src="./images/chicaPlaneta.png" alt="Chica abrazando el planeta  "/>
          </Fade>
        </Der>
      </Container>
    )
  }
}

const Container = styled.div`
  overflow: hidden;
  background-color: #B2DDE7;
  background-image: url('./images/patron.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  height: 100vh;
`
const Izq = styled.div`
  margin: 2% 5%;
  background-color: white;
  display: flex;
  border-radius: 30px;
  box-shadow: 0px 0px 20px -5px rgba(0,0,0,0.73);
  form{
    padding: 12px 48px;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
  }
  @media screen and (max-width: 1366px){
    form{
      padding: 24px;
    }
  }
`
const Der = styled.div`

`

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(NewClient)