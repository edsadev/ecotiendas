import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { createExit, balanza } from '../../../../utils/api'

import { toggleLoading } from '../../../../actions/loading'

import Carga from '../../../UI/Carga'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

class NewExit extends React.Component {
  state = {
    peso: 0,
    entrada: false,
    materiales: [],
    toggle: true,
    total_kg: parseFloat('0'),
    total_m3: 0,
    total_ecopuntos: 0,
  }
  handleDelete = (e, id) => {
    e.preventDefault()
    this.setState((state => ({
      materiales: state.materiales.filter(item => item.id !== id)
    })))
  }
  addMaterial = (e) => {
    e.preventDefault()

    const { materials } = this.props
    const { materiales } = this.state
    const peso = this.state.peso
    const id = this.select.value

    let ids = [] 
    materiales.map(item => ids.push(item.id))
    
    if (!ids.includes(id)){
      this.setState(() => ({
        materiales: [
          ...materiales,
          {
            cantidad_kg: Number.parseFloat(peso),
            cantidad_m3: Number.parseFloat(peso * materials[id].cantidad_m3),
            id: this.select.value,
            ecopuntos: peso * materials[id].ecopuntos
          }],
      }))
    } else {
      let copiaMateriales = materiales.slice()
      for (let i = 0; i <= ids.length; i++){
        if(ids[i] === id){
          copiaMateriales.splice(i, 1)
          copiaMateriales.push({
            cantidad_kg: Number.parseFloat(peso),
            cantidad_m3: Number.parseFloat(peso * materials[id].cantidad_m3),
            id: this.select.value,
            ecopuntos: peso * materials[id].ecopuntos
          })
        }
      }
      this.setState(() => ({
        materiales: copiaMateriales,
      }))
    }
  }
  calcularPeso = (e) => {
    e.preventDefault()
    // this.setState(() => ({
    //   peso: parseFloat(Math.random() * 100).toFixed(2)
    // }))
    balanza(this.props.authedUser.id)
      .then((res) => {
        this.setState(() => ({
          peso: res.data.peso
        }))
      })
  }
  toggleDisplay = (e) => {
    console.log(this.state)
    e.preventDefault()
    
    const { materiales } = this.state
    let totalKg = 0, totalM3 = 0, totalEcopuntos = 0

    let ids = [] 
    materiales.map(item => ids.push(item.id))
    
    for (let i = 0; i < ids.length; i++){
      totalKg += materiales[i].cantidad_kg
      totalM3 += materiales[i].cantidad_m3
      totalEcopuntos += materiales[i].ecopuntos
    }

    this.setState(() => ({
      toggle: !this.state.toggle,
      total_ecopuntos: totalEcopuntos,
      total_kg: totalKg,
      total_m3: totalM3
    }))

  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.dispatch(toggleLoading(this.props.loading))
    const {entrada, materiales, total_kg, total_m3, total_ecopuntos } = this.state
    const {authedUser} = this.props
    console.log(entrada , materiales, total_kg, total_m3, total_ecopuntos)
    createExit(authedUser.id, entrada, total_kg, total_m3, materiales)
    .then((res) => {
      if(res.data.success === false){
        alert(res.data.mensaje)
        this.props.dispatch(toggleLoading(this.props.loading))
      } else {
        alert('Ingreso enviado correctamente')
        this.props.dispatch(toggleLoading(this.props.loading))
        this.props.history.push('/')
      }
    })
    .catch((err) => {
      this.props.dispatch(toggleLoading(this.props.loading))
      alert('Hubo un error en el env??o')
      console.error(err)
    })
  }
  render() {
    const {materiales, toggle} = this.state
    const {materialId, materials, loading} = this.props

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

    if (toggle){
      return (
        <Container className="container-default background-default">
          <section className="centerContainer" id="1">
            <SubContainer>
              <Izq>
                <Fade>
                  <section>
                    <h2>Peso de material</h2>
                    <h4 className="indicador">{this.state.peso} Kg</h4>
                    <button onClick={this.calcularPeso} type="submit" className="btn-form">
                      Calcular peso
                    </button>  
                  </section>
                </Fade>
              </Izq>
              <Der>
                <Form>
                  <Fade>
                    <div>
                      <h1>Tipo de material</h1>
                      <select ref={(option) => this.select = option} className="dropdown-select">
                        {materialId.map((id) => (
                          <option key={id} value={id}>{materials[id].nombre}</option>
                        ))}
                      </select>
                    </div>
                    <ul>
                      {this.state.materiales.length !== 0
                        ? this.state.materiales.map((item) => (
                        <li key={item.id} id={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <span>{materials[item.id].nombre} - Peso: {item.cantidad_kg} Kg</span>
                          <Borrar onClick={(e) => this.handleDelete(e, item.id)}>
                            <HighlightOffIcon />
                          </Borrar>
                        </li>
                      ))
                        : <span>Ingresa al menos un material</span>
                      }
                    </ul>
                    <div className="horizontal-btns">
                      <button onClick={this.addMaterial} type="submit" className="btn-form">
                        Agregar material
                      </button>
                      <button 
                        onClick={this.toggleDisplay} 
                        type="submit" 
                        className="btn-form"
                        disabled={materiales.length === 0}
                        style={materiales.length === 0 ? {cursor: 'not-allowed'} : {cursor: 'pointer'}}
                      >
                        Siguiente
                      </button>
                    </div>
                  </Fade>
                </Form>
              </Der>
            </SubContainer>
          </section>
        </Container>
      )
    }
    return (
      <Container className="container-default background-default">
        <section id="2">
          <SubContainer id="sub">
            <Fade>
              <h1>Total de Materiales</h1>
              <ul style={{listStyle: 'none', textAlign: 'center'}}>
                {this.state.materiales.map((item) => (
                  <li key={item.id}><span>{materials[item.id].nombre} - Peso: {item.cantidad_kg} Kg</span></li>
                ))}
              </ul>
              <div className="horizontal-btns">
                <button className="btn-form" onClick={this.toggleDisplay}>Atras</button>
                <button id="submit" className="btn-form" onClick={this.handleSubmit}>Enviar salida</button>
              </div>
            </Fade>
          </SubContainer>
        </section>
      </Container>
    )
  }
} 

const Container = styled.div`
  section[id='1']{
    min-height: 100vh;
  }
  section[id='2']{
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    #sub{
      max-width: 500px;
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      align-items: center;
      padding: 60px;
    }
  }
`

const SubContainer = styled.div`
  width: 70vw;
  height: 75vh;
  grid-area: container;
  display: flex;
  box-shadow: 0px 0px 20px -5px rgba(0,0,0,0.73);
  border-radius: 40px;
  background-color: white;
`

const Izq = styled.div`
  border-bottom-left-radius: 40px;
  border-top-left-radius: 40px;
  padding: 60px 40px;
  flex-grow: 1;
  section {
    padding: 40px 0;
    height: 100%;
    background-color: rgba(255,192,70, .3);
    border-radius: 50%;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: center;
  }
`
const Der = styled.div`
  flex-grow: 1;
  border-bottom-right-radius: 40px;
  border-top-right-radius: 40px;
  padding: 0 40px;
  height: 100%;
`
const Form = styled.form`
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  ul {
    max-height: 250px;
    width: 70%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  ul li {
    list-style: none;
  }
`

const Borrar = styled.button`
  border: none;
  color: red;
  :hover {
    cursor: pointer;
  }
`

function mapStateToProps({ materials, authedUser, loading }){
  return {
    materialId: Object.keys(materials),
    materials, 
    authedUser,
    loading
  }
}

export default connect(mapStateToProps)(NewExit)