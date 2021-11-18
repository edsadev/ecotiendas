import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { createEcoAdmin, getEcotiendaForEcoadmin } from '../../../../utils/api'
import { connect } from 'react-redux'
import GoBackArrow from '../../../UI/GoBackArrow'
import { toggleLoading } from '../../../../actions/loading'

import Carga from '../../../UI/Carga'

import { _actualDate } from '../../../../utils/_helpers'

class NewRegional extends React.Component {
  state = {
    ecotiendas: [],
    photo64: "",
    zonal_id: ""
  }
  check = (e) => {
    e.preventDefault()
    console.log(this.state)
  }
  componentDidMount(){
    getEcotiendaForEcoadmin()
      .then(res => {
        this.setState(() => ({
          ecotiendas: res.data.ecotiendas
        }))
      })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.dispatch(toggleLoading(this.props.loading))
    if (this.ecotienda.value !== 'Escoja'){
      createEcoAdmin(this.ecotienda.value, this.cedula.value, this.nombre.value, this.apellido.value, this.direccion.value, this.genero.value, this.correo.value, this.state.photo64.result, this.fecha.value, this.celular.value, this.state.zonal_id)
      .then(res => {
        if(res.data.success === false){
          alert(res.data.mensaje)
          this.props.dispatch(toggleLoading(this.props.loading))
        } else {
          alert('EcoAdmin creado')
          this.props.dispatch(toggleLoading(this.props.loading))
          this.props.history.push('/')
        }
      })
      .catch(err => {
        this.props.dispatch(toggleLoading(this.props.loading))
        alert(err)
        console.error(err)
      })
    } else {
      alert('Escoja una ecotienda o cree una si no hay ninguna')
      this.props.dispatch(toggleLoading(true))
    }
  }
  handleChange(e){
    const img = document.getElementById("userPhoto")
    img.src = URL.createObjectURL(e.target.files[0])

    let filesSelected = e.target.files;
    if (filesSelected.length > 0) {
      let fileToLoad = filesSelected[0];

      let fileReader = new FileReader();

      fileReader.readAsDataURL(fileToLoad);

      this.setState(() => ({
        photo64: fileReader
      }))
    }
  }
  handleZonalId(e){
    this.setState(() => ({
      zonal_id: this.state.ecotiendas.find( target => JSON.stringify(target.id) === e.target.value).zonal_id
    }))
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
                <h3 className="title_green"><GoBackArrow classTo="arrow" history={this.props.history}/>Registrar EcoAdmin</h3>
                <label className="labelForm">EcoTienda</label>
                <div>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.ecotienda = input} onChange={(e) => this.handleZonalId(e)}>
                      <option selected disabled>Escoja</option>
                      {this.state.ecotiendas && this.state.ecotiendas.map((ecotienda) => (
                        <option key={ecotienda.id} value={ecotienda.id}>{ecotienda.nombre}</option>
                      ))}
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
                  <label className="btn-form">
                    <input type="file" name="userPhoto" alt="Foto Perfil" onChange={(e) => this.handleChange(e)}/>
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
  section[id='2']{
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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

export default connect(mapStateToProps)(NewRegional)