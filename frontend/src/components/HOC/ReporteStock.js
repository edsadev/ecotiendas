import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { exportTableToExcel as DecargaTabla, renderSemaforo } from  '../../utils/_helpers';

import { getEcoZonal, getReporteStock } from '../../utils/api'

class Reporte extends React.Component{
  state = {
    ecozonales: [],
    ecotiendas: {}
  }

  componentDidMount(){
    getEcoZonal()
      .then(res => {
        this.setState(() => ({
          ecozonales: res.data.ecozonales
        }))
      })
  }
  handleOnChange = () => {
    console.log(this.pais.value, this.provincia.value, this.zona.value, this.producto.value)
    getReporteStock(this.pais.value !== "País" ? this.pais.value : false, this.zona.value !== "Zonas" ? this.zona.value : false, this.provincia.value !== "Provincia" ? this.provincia.value : false, this.producto.value !== "Producto" ? this.producto.value : false)
      .then(res => {
        console.log(res.data)
        res.data.success
          ? this.setState(() => ({
            ecotiendas: res.data.ecotiendas,
          }))
          : alert('No se encontraron resultados')
      })
  }
  render(){
    const { ecozonales, ecotiendas } = this.state
    const ecotiendasIds = Object.keys(ecotiendas)
    const customColumnStyle = {
      Ecotienda: {
        width: "35%"
      },
      EcoAdmin: {
        width: "25%"
      },
      SEM: {
        width: "10%"
      },
      Provincia: {
        width: "20%"
      },
      Kg: {
        width: "10%"
      }
    }
    return(
      <Container className="container-default background-default">
        <SubContainer>
          <div style={{display: "flex", marginTop: '3vh' }}>
            <Campos>
              <h3>Filtros</h3>
            </Campos>
            <ReporteContainer style={{textAlign: "center"}}>
              <h3>Reporte de Stock</h3>
            </ReporteContainer>
          </div>
          <button style={{maxWidth: "150px", alignSelf: 'flex-end'}} className="btn-form" onClick={() => DecargaTabla('tabla-reporte', 'ReporteStock')}>Descargar Doc</button>
          <FiltrosReporte>
            <Campos>
              <div>
                <div className="inputContainer" style={{marginTop: 0}}>
                  <select className="dropdown-select" required ref={(input) => this.pais = input} onChange={this.handleOnChange}>
                    <option value="Ecuador">Ecuador</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="inputContainer">
                  <select className="dropdown-select" required ref={(input) => this.zona = input} onChange={this.handleOnChange}>
                    <option selected>Zonas</option>
                    {ecozonales.map(ecozonal => <option key={ecozonal.id} id={ecozonal.id} value={ecozonal.id}>{ecozonal.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div className="inputContainer">
                  <select className="dropdown-select" required ref={(input) => this.provincia = input} onChange={this.handleOnChange}>
                    <option selected>Provincia</option>
                    <option value="Azuay">Azuay</option>
                    <option value="Bolívar">Bolívar</option>
                    <option value="Cañar">Cañar</option>
                    <option value="Carchi">Carchi</option>
                    <option value="Chimborazo">Chimborazo</option>
                    <option value="Cotopaxi">Cotopaxi</option>
                    <option value="El Oro">El Oro</option>
                    <option value="Esmeraldas">Esmeraldas</option>
                    <option value="Galápagos">Galápagos</option>
                    <option value="Guayas">Guayas</option>
                    <option value="Imbabura">Imbabura</option>
                    <option value="Loja">Loja</option>
                    <option value="Los Ríos">Los Ríos</option>
                    <option value="Manabí">Manabí</option>
                    <option value="Morona Santiago">Morona Santiago</option>
                    <option value="Napo">Napo</option>
                    <option value="Orellana">Orellana</option>
                    <option value="Pastaza">Pastaza</option>
                    <option value="Pichincha">Pichincha</option>
                    <option value="Santa Elena">Santa Elena</option>
                    <option value="Santo Domingo de los Tsáchilas">Santo Domingo de los Tsáchilas</option>
                    <option value="Sucumbíos">Sucumbíos</option>
                    <option value="Tungurahua">Tungurahua</option>
                    <option value="Zamora Chinchipe">Zamora Chinchipe</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="inputContainer">
                  <select className="dropdown-select" required ref={(input) => this.producto = input} onChange={this.handleOnChange}>
                    <option selected>Producto</option>
                    {this.props.materialsId && this.props.materialsId.map(id => (
                      <option key={this.props.materials[id].id} id={this.props.materials[id].id} value={this.props.materials[id].id}>{this.props.materials[id].nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Campos>
            <ReporteContainer>
              <Paper>
                <TableContainer style={{width: '100%', maxHeight: "60vh"}}>
                  <Table aria-label="simple table" stickyHeader id="tabla-reporte">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ecotienda</TableCell>
                        <TableCell align="center">EcoAdmin</TableCell>
                        <TableCell align="center">SEM</TableCell>
                        <TableCell align="center">Provincia</TableCell>
                        <TableCell align="center">Kg</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ecotiendasIds.map(id => {
                        return (
                          <TableRow>
                            <TableCell style={customColumnStyle.Ecotienda}>Ecotienda "{ecotiendas[id].nombre}"</TableCell>
                            <TableCell style={customColumnStyle.EcoAdmin} align="center">{ecotiendas[id].ecoadmin}</TableCell>
                            <TableCell style={customColumnStyle.SEM} align="center">{renderSemaforo(ecotiendas[id].semaforo)}</TableCell>
                            <TableCell style={customColumnStyle.Provincia} align="center">{ecotiendas[id].provincia}</TableCell>
                            <TableCell style={customColumnStyle.Kg} align="center">{ecotiendas[id].peso} Kg</TableCell>
                          </TableRow>
                        )
                      })}
                      
                    </TableBody>
                  </Table>
                </TableContainer> 
              </Paper>
            </ReporteContainer>
          </FiltrosReporte>
        </SubContainer>
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
  width: 80vw;
  min-height: 90vh;
  background-color: white;
  display: flex;
  flex-flow: column;
  box-shadow: 0px 0px 20px -5px rgba(0,0,0,0.73);
  border-radius: 40px;
  padding: 32px;
`

const Campos = styled.div`
  padding: 8px;
  width: 350px;
  .fecha {
    text-align: center;
    flex-grow: 1;
  }
`

const ReporteContainer = styled.div`
  padding: 8px;
  flex-grow: 4;
  thead tr th{
    background-color: #02735F;
    color: white;
    border-right: 1px solid rgba(250,250,250, 0.2);
  }
  th, td {
    padding: 10px 12px;
  }
`

const FiltrosReporte = styled.div`
  display: flex;
`

function mapStateToProps({materials}){
  return {
    materials,
    materialsId: Object.keys(materials)
  }
}

export default connect(mapStateToProps)(Reporte)