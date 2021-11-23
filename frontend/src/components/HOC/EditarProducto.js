import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { getMaterials, getTipoProductos, actualizarProducto } from '../../utils/api'
import GoBackArrow from '../UI/GoBackArrow'

import Carga from '../UI/Carga'

class EditarProducto extends React.Component {
  state = {
    tipos_productos: [],
    nombreProducto: '',
    ecopuntos: '',
    cantidadM3: '',
  }
  componentDidMount(){
    Promise.all([getMaterials(), getTipoProductos()])
      .then(res => {
        const producto = res[0].data.materiales[this.props.match.params.id]
        this.setState(() => ({
          nombreProducto: producto.nombre,
          ecopuntos: producto.ecopuntos,
          cantidadM3: producto.cantidad_m3
        }))
        this.tipoProducto = producto.tipo_material_id
        return res[1]
      })
      .then(res => {
        this.setState((state) => ({
          tipos_productos: state.tipos_productos.concat(res.data.tipos_productos),
        }))
      })
      .catch(err => {
        alert('Hubo un error al tratar de obtener los datos del servidor')
        console.error(err)
      })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    actualizarProducto(this.state.nombreProducto, this.tipos_productos.value, this.state.ecopuntos, this.state.cantidadM3, this.props.match.params.id)
      .then(res => {
        alert(res.data.mensaje)
        this.props.history.push('/')
      })
      .catch(err => {
        alert('Hubo un error al tratar de actualizar el producto')
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
                <h3 className="title_green"><GoBackArrow classTo="arrow" history={this.props.history}/>Modificar Producto</h3>
                <div>
                  <label className="labelForm">Nombre del producto</label>
                  <div className="inputContainer">
                    <input 
                      className="inputSingle" 
                      required 
                      onChange={(input) => this.setState(({nombreProducto: input.target.value}))}
                      value={this.state.nombreProducto}
                    />
                  </div>
                </div>
                <div>
                  <label className="labelForm">Tipo de producto</label>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.tipos_productos = input}>
                      {this.state.tipos_productos && this.state.tipos_productos.map(tipo => {
                        if (tipo.id === this.tipoProducto){
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
                  <label className="labelForm">Ecopuntos por Kg</label>
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
                  <label className="labelForm">Cantidad M3 por Kg</label>
                  <div className="inputContainer">
                    <input 
                      className="inputSingle" 
                      required 
                      onChange={(input) => this.setState(({cantidadM3: input.target.value}))}
                      value={this.state.cantidadM3}
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

export default connect(mapStateToProps)(EditarProducto)