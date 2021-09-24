import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { createProduct, getTipoProductos } from '../../../../utils/api'
import { connect } from 'react-redux'
import GoBackArrow from '../../../UI/GoBackArrow'

class NewRegional extends React.Component {
  state = {
    photo64: "",
    tipoProducto: []
  }
  check = (e) => {
    e.preventDefault()
    console.log(this.state, this.tipoProducto.value)
  }
  componentDidMount(){
    getTipoProductos()
      .then(res => {
        this.setState(() => ({
          tipoProducto: res.data.tipos_productos
        }))
      })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    createProduct(this.nombreProducto.value, this.state.photo64.result, this.tipoProducto.value, this.cantEcopuntos.value, this.cantm3.value)
      .then(res => {
        if(res.data.success === false){
          alert('Algo sucedio, intentalo denuevo')
          console.error(res.data.mensaje)
        } else {
          alert('Producto creado')
          this.props.history.push('/')
        }
      })
      .catch(err => {
        alert(err)
        console.error(err)
      })
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
  render(){
    return (
      <Container className="container-default background-default">
        <Fade>
          <SubContainer>
            <Form>
              <Izq>
                {/* <button onClick={this.check}>asd</button> */}
                <h3 className="title_green"><GoBackArrow classTo="arrow" history={this.props.history}/>Registrar Producto</h3>
                <div>
                  <label className="labelForm">Nombre del producto</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.nombreProducto = input}/>
                  </div>
                </div>
                <div>
                  <label className="labelForm">Tipo de producto</label>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.tipoProducto = input}>
                      {this.state.tipoProducto && this.state.tipoProducto.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="labelForm">Ecopuntos por Kg</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.cantEcopuntos = input}/>
                  </div>
                </div>
                <div>
                  <label className="labelForm">Cantidad M3 por Kg</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.cantm3 = input}/>
                  </div>
                </div>
                <button onClick={this.handleSubmit} style={{width: '100%'}} className="btn-form">Registrar</button>
              </Izq>
              <Der>
                <div id="sub">
                  <Img id="userPhoto" src="" alt="UserPhoto" />
                  <label class="btn-form">
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
  border-radius: 24px;
`

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(NewRegional)