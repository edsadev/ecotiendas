import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { createEcoAdmin } from '../../../../utils/api'
import { connect } from 'react-redux'
import GoBackArrow from '../../../UI/GoBackArrow'
import { toggleLoading } from '../../../../actions/loading'

import Carga from '../../../UI/Carga'

import { _actualDate } from '../../../../utils/_helpers'

class NewEcosupervisor extends React.Component {
  check = () => {
    console.log(this.cedula.value, this.nombre.value, this.apellido.value, this.direccion.value, this.genero.value, this.correo.value, this.celular.value, this.fecha.value, this.userPhoto.value)
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.dispatch(toggleLoading(this.props.loading))
    createEcoAdmin(this.props.authedUser.id ,this.user.value, this.cedula.value, this.nombre.value, this.apellido.value, this.direccion.value, this.genero.value, this.correo.value, this.celular.value, this.fecha.value)
      .then(res => {
        if(res.data.success === false){
          alert('Algo sucedio, intentalo denuevo')
          this.props.dispatch(toggleLoading(this.props.loading))
          console.error(res.data.mensaje)
        } else {
          alert('Usuario creado')
          this.props.dispatch(toggleLoading(this.props.loading))
          this.props.history.push('/')
        }
      })
      .catch(err => {
        this.props.dispatch(toggleLoading(this.props.loading))
        alert(err)
        console.error(err)
      })
  }
  handleChange(e){
    console.log(e)
    const img = document.getElementById("userPhoto")
    img.src = URL.createObjectURL(e.target.files[0])
  }
  render(){

    const {loading} = this.props

    if (loading){
      return (
        <Container className="container-default background-default">
          <section id="2">
            <SubContainer style={{justifyContent: 'center', alignItems: 'center'}}>
              <Carga/>
            </SubContainer>
          </section>
        </Container>
      )
    }

    return (
      <Container className="container-default background-default">
        <Fade>
          <SubContainer>
            <Form>
              <Izq>
                {/* <button onClick={this.check}>asd</button> */}
                <h3 className="title_green"><GoBackArrow classTo="arrow" history={this.props.history}/>Registrar EcoSupervisor</h3>
                <label className="labelForm">EcoZonal</label>
                <div>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.ecotienda = input}>
                      <option value="EcoZonal1">EcoZonal1</option>
                      <option value="EcoZonal2">EcoZonal2</option>
                    </select>
                  </div>
                </div>
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
                      <input className="inputSingle" required ref={(input) => this.fecha = input} type="date" max={_actualDate()}/>
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
                <button onClick={this.handleSubmit} style={{width: '100%'}} className="btn-form">Registrar</button>
              </Izq>
              <Der>
                <div id="sub">
                  <Img id="userPhoto" src="" alt="UserPhoto" />
                  <label class="btn-form">
                    <input ref={(input) => this.userPhoto = input} type="file" name="userPhoto" alt="Foto Perfil" onChange={this.handleChange}/>
                    <span style={{margin: "12px"}}>Agregar imagen</span> 
                  </label>  
                </div>
              </Der>
            </Form>
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
    height: 70%;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: center;
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
  width: 250px;
  height: 250px;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.4);
  border-radius: 50%;
`

function mapStateToProps({authedUser, loading}){
  return {
    authedUser,
    loading
  }
}

export default connect(mapStateToProps)(NewEcosupervisor)