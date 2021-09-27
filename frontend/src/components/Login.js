import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import { connect } from 'react-redux';
import { handleLogin } from '../actions/shared'
import { getInitialUser, helloworld } from '../utils/api'
import Carga from './UI/Carga'

class Login extends React.Component {
  login = (e) => {
    e.preventDefault()

    getInitialUser(this.user.value, this.password.value)
      .then((res) => {
        this.props.dispatch(handleLogin(res.data.id, res.data.rango, res.data.nombre, res.data.foto))
        console.log(res)
        return res
      })
      .then((res) => {
        if (res.data.rango === "ecoadmin" || res.data.rango === "keyUser" || res.data.rango === "administrativo" || res.data.rango === "ecozonal"){
          this.props.history.push('/')
        } else if (res.data.rango === "bodegero"){
          this.props.history.push('/new-ecoadmin')
        } else if (res.data.rango === "ecoamigo"){
          this.props.history.push('/review')
        }
      })
      .catch((err) => {
        alert('Hubo un error al tratar de logear')
        console.error(err)
        console.log(helloworld)
      })
  }
  render (){
    if (this.loading){
      return (
        <Container>
          <Carga text="Enviando..." />
        </Container>
      )
    }
    return (
      <AllContainer bgImage={"/images/PersonalNovared.jpg"}>
        <Container>
          <Fade>
            <LoginForm>
              <HeroImage bgImage={"/images/PersonalNovared.png"}/>
              <Formulario>
                <Usuario>
                  <PersonIcon style={{ color: 'white' }}/>
                  <input type="text" placeholder="Nombre de Usuario" ref={(input) => this.user = input}></input>
                </Usuario>
                <Contraseña>
                  <LockIcon style={{ color: 'white' }}></LockIcon>
                  <input type="password" placeholder="Contraseña" ref={(input) => this.password = input}></input>
                </Contraseña>
                <Boton className="btn-form" onClick={this.login}>
                  <span>Ingresar</span>
                </Boton>
              </Formulario>
            </LoginForm>
          </Fade>
        </Container>
      </AllContainer>
    )
  }
}

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(Login)

const AllContainer = styled.div`
  height: 100vh;
  background-image: ${props => `url("${props.bgImage}")`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const Container = styled.div`
  background-color: rgba(0,0,0,0.6);
  height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  `

const LoginForm = styled.div`
  background: white;
  height: 80vh;
  border-radius: 12px;
  min-width: 40vw;
  `

const HeroImage = styled.div`
  height: 30vh;
  width: 100%;
  background-image: ${props => `url("${props.bgImage}")`};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background-size: cover;
  `

const Formulario = styled.div`
  margin: 54px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 30vh;
`

const Usuario = styled.div`
  background-color: rgba(2,115,95,0.8);
  margin: 0 10%; 
  padding: 12px 24px;
  border-radius: 24px;
  display: flex;
  input {
    flex-grow: 2;
    outline: none;
    background: none;
    border: none;
    text-align: center;
    width: 100%;
  }
  input::placeholder {
    color: white!important;
    text-align: center;
  }
`

const Contraseña = styled(Usuario)`
  
`

const Boton = styled.a`
  padding: 12px 32px;
  text-decoration: none;
  color: white;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 30%; 
  cursor: pointer;
`
  