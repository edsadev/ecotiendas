import React from 'react';
import './App.css';
import { connect } from 'react-redux'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Nav from './components/HOC/Nav'
import ConnectedLogin from './components/Login'
import DashboardEcotienda from './components/HOC/Dashboards/EcoTienda'
import DashboardKeyUser from './components/HOC/Dashboards/KeyUser'
import DashboardAdministrativo from './components/HOC/Dashboards/Administrador'
import DashboardEcoZonal from './components/HOC/Dashboards/EcoZonal'

import NewEntry from './components/HOC/NEW/EcoTienda/NewEntry'
import NewClient from './components/HOC/NEW/EcoTienda/NewClient'
import NewExit from './components/HOC/NEW/EcoTienda/NewExit';

import ReviewPoints from './components/ReviewPoints'
import HistoryEcoTienda from './components/UI/EcoTienda/HistoryEcoTienda';
import Detalle from './components/UI/Detalle'
import Pregunta from './components/UI/Pregunta'

import HistoryKeyUser from './components/UI/KeyUser/HistoryKeyUser';
import NewEcoZonal from './components/HOC/NEW/KeyUser/NewEcoZonal';
import NewEcosupervisor from './components/HOC/NEW/KeyUser/NewEcoSupervisor';
import NewEcoAdmin from './components/HOC/NEW/KeyUser/NewEcoAdmin';
import NewEcoTienda from './components/HOC/NEW/KeyUser/NewEcoTienda';
import NewProduct from './components/HOC/NEW/KeyUser/NewProduct'
import NewReward from './components/HOC/NEW/KeyUser/NewReward'
import BtnsRegistro from './components/UI/BtnsRegistro'
import BtnsReporte from './components/UI/BtnsReporte'
import Proyeccion from './components/UI/Proyeccion';
import MapaEcotiendas from './components/UI/MapaEcotiendas';
import Material from './components/UI/Material';
import ReporteStock from './components/HOC/ReporteStock'
import ReporteHistorico from './components/HOC/ReporteHistorico'
import EditarProductos from './components/HOC/EditarProductos'
import EditarProducto from './components/HOC/EditarProducto'
import EditarPremios from './components/HOC/EditarPremios'
import EditarPremio from './components/HOC/EditarPremio'

class App extends React.Component {
  componentDidMount(){
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
      });
    } else {
      console.log("Not Available");
    }
  }
  render() {
    console.log(this.props)
    const { authedUser } = this.props
    if (!authedUser){
      return (
        <div className="App">
          <Router>
            <Route path="/login" component={ConnectedLogin} />
            <Redirect to="/login" />
          </Router>
        </div>
      )
    } else if (authedUser.rank === "ecoadmin"){
      return (
        <div className="App">
          <Router>
            <Nav user={authedUser.rank} />
            <Switch>
              <Route path="/" exact component={DashboardEcotienda}/>
              <Route path="/new-entry" exact component={NewEntry}/>
              <Route path="/preg" exact component={Pregunta}/>
              <Route path="/new-exit" exact component={NewExit}/>
              <Route path="/new-client" exact component={NewClient}/>
              <Route path="/review-points" exact component={ReviewPoints} />
              <Route path="/history" exact component={HistoryEcoTienda}/>
              <Route path="/detalle/:id" exact component={Detalle}/>
            </Switch>
          </Router>
        </div>
      )
    } else if (authedUser.rank === 'keyUser'){
      console.log("Entro a key user")
      return (
        <div className="App">
          <Router>
            <Nav user={authedUser.rank} />
            <Switch>
              <Route path="/" exact component={DashboardKeyUser} />
              <Route path="/new-ecozonal" exact component={NewEcoZonal}/>
              <Route path="/new-ecosupervisor" exact component={NewEcosupervisor}/>
              <Route path="/new-ecotienda" exact component={NewEcoTienda}/>
              <Route path="/new-ecoadmin" exact component={NewEcoAdmin}/>
              <Route path="/new-product" exact component={NewProduct}/>
              <Route path="/new-reward" exact component={NewReward}/>
              <Route path="/registro" exact component={BtnsRegistro}/>
              <Route path="/edit-products" exact component={EditarProductos}/>
              <Route path="/edit-products/:id" exact component={EditarProducto}/>
              <Route path="/edit-rewards" exact component={EditarPremios}/>
              <Route path="/edit-rewards/:id" exact component={EditarPremio}/>
              <Route path="/reporte" exact component={BtnsReporte}/>
              <Route path="/proyeccion" exact component={Proyeccion}/>
              <Route path="/ecotiendas/" exact component={MapaEcotiendas}/>
              <Route path="/ecotiendas/:id" exact component={HistoryKeyUser}/>
              <Route path="/detalle/:id" exact component={Detalle}/>
              <Route path="/material/:id" exact component={Material}/>
              <Route path="/reporte-stock" component={ReporteStock} />
              <Route path="/reporte-historico" component={ReporteHistorico} />
            </Switch>
          </Router>
        </div>
      )
    } else if (authedUser.rank === 'administrativo'){
      console.log("Entro a administrativo")
      return (
        <div className="App">
          <Router>
            <Nav user={authedUser.rank} />
            <Switch>
              <Route path="/" exact component={DashboardAdministrativo} />
              <Route path="/reporte" exact component={BtnsReporte}/>
              <Route path="/proyeccion" exact component={Proyeccion}/>
              <Route path="/ecotiendas/" exact component={MapaEcotiendas}/>
              <Route path="/ecotiendas/:id" exact component={HistoryKeyUser}/>
              <Route path="/detalle/:id" exact component={Detalle}/>
              <Route path="/material/:id" exact component={Material}/>
              <Route path="/reporte-stock" component={ReporteStock} />
              <Route path="/reporte-historico" component={ReporteHistorico} />
            </Switch>
          </Router>
        </div>
      )
    } else if (authedUser.rank === 'ecozonal'){
      console.log("Entro a EcoZonal")
      return (
        <div className="App">
          <Router>
            <Nav user={authedUser.rank} />
            <Switch>
              <Route path="/" exact component={DashboardEcoZonal} />
              <Route path="/reporte" exact component={BtnsReporte}/>
              {/* <Route path="/proyeccion" exact component={Proyeccion}/> */}
              <Route path="/ecotiendas/" exact component={MapaEcotiendas}/>
              <Route path="/ecotiendas/:id" exact component={HistoryKeyUser}/>
              <Route path="/detalle/:id" exact component={Detalle}/>
              <Route path="/material/:id" exact component={Material}/>
            </Switch>
          </Router>
        </div>
      )
    } else if (authedUser.rank === 'ecoamigo'){
      console.log("Entro a ecoamigo")
      return (
        <div className="App">
          <Router>
            <Switch>
              <Route path="/review" exact component={ReviewPoints}/>
            </Switch>
          </Router>
        </div>
      )
    }
  }
}

function mapStateToProps({ authedUser }) {
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(App);
