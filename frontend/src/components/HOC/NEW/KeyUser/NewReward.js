import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { createPremio, getTipoPremios } from '../../../../utils/api'
import { connect } from 'react-redux'
import GoBackArrow from '../../../UI/GoBackArrow'
import { toggleLoading } from '../../../../actions/loading'

import Carga from '../../../UI/Carga'

class NewReward extends React.Component {
  state = {
    photo64: "",
    tipoPremio: []
  }
  check = () => {
    console.log(this.state)
  }
  componentDidMount(){
    getTipoPremios()
      .then(res => {
        this.setState(() => ({
          tipoPremio: res.data.tipos_premios
        }))
      })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.dispatch(toggleLoading(this.props.loading))
    createPremio(this.nombrePremio.value, this.state.photo64.result, this.tipoPremio.value, this.cantEcopuntos.value, this.stock.value)
      .then(res => {
        if(res.data.success === false){
          alert('Algo sucedio, intentalo denuevo')
          this.props.dispatch(toggleLoading(this.props.loading))
          console.error(res.data.mensaje)
        } else {
          alert('Premio creado')
          this.props.dispatch(toggleLoading(this.props.loading))
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

    const {loading} = this.props

    if (loading){
      return (
        <Container className="container-default background-default">
          <section id="2">
            <SubContainer>
              <Carga text="Enviando..."/>
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
                <h3 className="title_green"><GoBackArrow classTo="arrow" history={this.props.history}/>Registrar Premio</h3>
                <div>
                  <label className="labelForm">Nombre del premio</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.nombrePremio = input}/>
                  </div>
                </div>
                <div>
                  <label className="labelForm">Tipo de premio</label>
                  <div className="inputContainer">
                    <select className="dropdown-select" required ref={(input) => this.tipoPremio = input}>
                      {this.state.tipoPremio && this.state.tipoPremio.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="labelForm">Ecopuntos por premio</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.cantEcopuntos = input}/>
                  </div>
                </div>
                <div>
                  <label className="labelForm">Stock</label>
                  <div className="inputContainer">
                    <input className="inputSingle" required ref={(input) => this.stock = input}/>
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
  border-radius: 24px;
`

function mapStateToProps({authedUser, loading}){
  return {
    authedUser,
    loading
  }
}

export default connect(mapStateToProps)(NewReward)