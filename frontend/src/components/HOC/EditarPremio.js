import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { getPremios, getTipoPremios, actualizarPremio } from '../../utils/api'
import GoBackArrow from '../UI/GoBackArrow'

import Carga from '../UI/Carga'

class EditarPremio extends React.Component {
  state = {
    tipos_premios: [],
    nombrePremio: '',
    ecopuntos: '',
    stock: '',
  }
  componentDidMount(){
    Promise.all([getPremios(), getTipoPremios()])
      .then(res => {
        const premio = res[0].data.premios.find(premio => premio.id === Number.parseInt(this.props.match.params.id))
        this.setState(() => ({
          nombrePremio: premio.nombre,
          ecopuntos: premio.ecopuntos,
          stock: premio.stock
        }))
        this.tipoPremio = premio.tipo_material_id
        return res[1]
      })
      .then(res => {
        this.setState((state) => ({
          tipos_premios: state.tipos_premios.concat(res.data.tipos_premios),
        }))
      })
      .catch(err => {
        alert('Hubo un error al tratar de obtener los datos del servidor')
        console.error(err)
      })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    console.log(this.state.nombrePremio, this.tipos_premios.value, this.state.ecopuntos, this.state.stock, this.props.match.params.id)
    actualizarPremio(this.state.nombrePremio, this.tipos_premios.value, this.state.ecopuntos, Number.parseInt(this.state.stock), this.props.match.params.id)
      .then(res => {
        alert(res.data.mensaje)
        this.props.history.push('/')
      })
      .catch(err => {
        alert('Hubo un error al tratar de actualizar el Premio')
        console.error(err)
      })
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
                <h3 className="title_green"><GoBackArrow classTo="arrow" history={this.props.history}/>Modificar Premio</h3>
                <div>
                  <label className="labelForm">Nombre del Premio</label>
                  <div className="inputContainer">
                    <input 
                      className="inputSingle" 
                      required 
                      onChange={(input) => this.setState(({nombrePremio: input.target.value}))}
                      value={this.state.nombrePremio}
                    />
                  </div>
                </div>
                <div>
                  <label className="labelForm">Tipo de Premio</label>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.tipos_premios = input}>
                      {this.state.tipos_premios && this.state.tipos_premios.map(tipo => {
                        if (tipo.id === this.tipoPremio){
                          return (
                            <option key={tipo.id} value={tipo.id} selected>{tipo.nombre}</option>
                          )
                        } else {
                          return (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                          )
                        }
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="labelForm">Ecopuntos por cobrar</label>
                  <div className="inputContainer">
                    <input 
                      className="inputSingle" 
                      required 
                      onChange={(input) => this.setState(({ecopuntos: input.target.value}))}
                      value={this.state.ecopuntos}  
                    />
                  </div>
                </div>
                <div>
                  <label className="labelForm">Stock</label>
                  <div className="inputContainer">
                    <input 
                      className="inputSingle" 
                      required 
                      onChange={(input) => this.setState(({stock: input.target.value}))}
                      value={this.state.stock}
                    />
                  </div>
                </div>
                <button onClick={this.handleSubmit} style={{width: '100%'}} className="btn-form">Guardar cambios</button>
              </Izq>
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
  width: 100%;
  padding: 24px;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
`

function mapStateToProps({authedUser}) {
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(EditarPremio)