import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { handleLogOut } from '../../actions/shared'

class Nav extends React.Component {
  LogOut = () => {
    this.props.dispatch(handleLogOut())
  }
  render(){
    const { user } = this.props
    if (user === "ecoadmin" || user === "ecotienda_movil"){
      return (
        <div className="nav">
          <img src="./images/logo.png" alt="Logo" className="logo"></img>
          <div className="perfil-container">
            <img src={this.props.authedUser.foto} alt="avatar"/>
            <h3>{this.props.authedUser.name}</h3>
            <h5>Ecotienda</h5>
          </div>
          <ul className="nav-items">
            <li className="nav-item"><Link to="/">Dashboard</Link></li>
            <li className="nav-item"><Link to="/history">Historial</Link></li>
            {user === "ecoadmin" && (<li className="nav-item"><Link to="/transito">Tickets Ecopicker</Link></li>)}
            <li className="nav-item"><Link to="/login" onClick={this.LogOut}>Log Out</Link></li>
          </ul>
        </div>
      )
    } else if (user === "keyUser"){
      return (
        <div className="nav">
          <img src="./images/logo.png" alt="Logo" className="logo"></img>
          <div className="perfil-container">
            <img src="./images/Gaby.png" alt="avatar"/>
            <h3>{this.props.authedUser.name}</h3>
            <h5>Key User</h5>
          </div>
          <ul className="nav-items">
            <li className="nav-item"><Link to="/">Dashboard</Link></li>
            <li className="nav-item"><Link to="/registro">Acciones</Link></li>
            <li className="nav-item"><Link to="/reporte">Reporte</Link></li>
            <li className="nav-item"><Link to="/login" onClick={this.LogOut}>Log Out</Link></li>
          </ul>
        </div>
      )
    } else if (user === "administrativo"){
      return (
        <div className="nav">
          <img src="./images/logo.png" alt="Logo" className="logo"></img>
          <div className="perfil-container">
            <h5>Adminsitrador</h5>
          </div>
          <ul className="nav-items">
            <li className="nav-item"><Link to="/">Dashboard</Link></li>
            <li className="nav-item"><Link to="/reporte">Reporte</Link></li>
            <li className="nav-item"><Link to="/login" onClick={this.LogOut}>Log Out</Link></li>
          </ul>
        </div>
      )
    } else if (user === "ecozonal"){
      return (
        <div className="nav">
          <img src="./images/logo.png" alt="Logo" className="logo"></img>
          <div className="perfil-container">
            <img src={this.props.authedUser.foto} alt="avatar"/>
            <h3>{this.props.authedUser.name}</h3>
            <h5>EcoZonal</h5>
          </div>
          <ul className="nav-items">
            <li className="nav-item"><Link to="/">Dashboard</Link></li>
            {/* <li className="nav-item"><Link to="/reporte">Reporte</Link></li> */}
            <li className="nav-item"><Link to="/login" onClick={this.LogOut}>Log Out</Link></li>
          </ul>
        </div>
      )
    }
  }
}

function mapStateToProps({authedUser}){
  return ({
    authedUser
  })
}

export default connect(mapStateToProps)(Nav)
