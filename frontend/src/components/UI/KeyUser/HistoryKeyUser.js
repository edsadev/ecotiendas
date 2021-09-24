import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { getStockEcoAdmin, getTipoProductos, velocimetro } from '../../../utils/api'

import GoBackArrow from '../GoBackArrow';
import TituloSemaforo from '../TitleSem'

class Historial extends React.Component {
  state = {
    materiales: [],
    page: 0,
    rowsPerPage: 10,
    count: 100,
    ecoAdmin: {},
    ecoTienda: {},
    tipos_productos: []
  }
  componentDidMount(){
    Promise.all([
      getStockEcoAdmin(parseInt(this.props.match.params.id)),
      velocimetro(parseInt(this.props.match.params.id)),
      getTipoProductos()
    ]).then((res) => {
      console.log(res)
      const data = res[0].data.data
      const ids = Object.keys(data)
      this.setState(() => ({
        tipos_productos: res[2].data.tipos_productos,
        materiales: ids.map((id) => {
          return {
            ...data[id],
            id
          }
        }),
      }))
      console.log(res[1])
      if (res[1].data.success === true){
        this.setState(() => ({
          ecoAdmin: res[1].data.ecoadmin,
          ecoTienda: res[1].data.ecotienda
        }))
      } else {
        console.error(res[1].data.mensaje)
      }
    }).catch(err => {
      console.error(err)
    })
  }
  check = (e) => {
    e.preventDefault()
    console.log(this.state)
  }
  exportTableToExcel = (tableID, filename = '') =>{
    console.log("entro")
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':`Reporte${this.state.ecoTienda.nombre.replace(/ /g, "")}.xls`;
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
    }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
    }
  }
  render(){    
    const { materiales, ecoAdmin, ecoTienda } = this.state
    const date = new Date()
    const edad = Math.floor((date.getTime() - Date.parse(ecoAdmin.fecha_nacimiento)) / 32140800000)
    return (
      <Container className="container-default background-default">
        <Fade>
          <Info>
            {/* <button onClick={this.check}>probar</button> */}
            <Detalles>
              <table>
                <tr>
                  <th colSpan="4"><GoBackArrow classTo="arrow_history" history={this.props.history}/>EcoAdministrador de la Ecotienda <TituloSemaforo text={ecoTienda.nombre && ecoTienda.nombre} capMaxima={ecoTienda.capacidad_maxima_m3 && ecoTienda.capacidad_maxima_m3} capActual={ecoTienda.cantidad_actual_m3 && ecoTienda.cantidad_actual_m3}/></th>
                </tr>
                <tr>
                  <td className="titulos">Nombre:</td>
                  <td className="textos">{ecoAdmin.nombre && ecoAdmin.nombre} {ecoAdmin.apellido && ecoAdmin.apellido}</td>
                  <td className="titulos">Cédula:</td>
                  <td className="textos">{ecoAdmin.cedula && ecoAdmin.cedula}</td>
                </tr>
                <tr>
                  <td className="titulos">Edad:</td>
                  <td className="textos">{edad} años</td>
                  <td className="titulos">Fecha de ingreso:</td>
                  <td className="textos">{ecoAdmin.fecha_registro && ecoAdmin.fecha_registro.split(",")[0]}</td>
                </tr>
              </table>
            </Detalles>
            <img src="../images/separador.png" alt="Separador"></img>
            <Imagen>
              <img src={this.state.ecoAdmin.foto && this.state.ecoAdmin.foto} alt="avatar"/>
            </Imagen>
          </Info>
          <Paper>
            <button style={{position: "absolute", top: "20px", left: "40px"}} className="btn-form" onClick={() => this.exportTableToExcel('tabla-reporte')}>Descargar reporte</button>
            <h2 style={{padding: 20, display: "inline-block", width: "100%", textAlign: "center"}}>Reporte {ecoTienda.nombre && ecoTienda.nombre}</h2>
            <TableContainer style={{width: "76vw", height: "55vh"}}>
              <Table aria-label="simple table" stickyHeader id="tabla-reporte">
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo de producto</TableCell>
                    <TableCell align="center">Producto</TableCell>
                    <TableCell align="center">Kg</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materiales && materiales.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.tipo_producto && this.state.tipos_productos.find(element => element.id === row.tipo_producto).nombre}</TableCell>
                      <TableCell align="center">{row.nombre}</TableCell>
                      <TableCell align="center">{row.peso}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> 
          </Paper>
        </Fade>
      </Container>
        
    )
  }
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  .MuiPaper-rounded {
    border-radius: 40px;
    position: relative;
    table {
      padding: 0 24px;
    }
  }
`

const Info = styled.div`
  background-color: #6FB85D;
  width: 76vw;
  color: white;
  border-radius: 40px;
  margin-bottom: 3vh;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
` 

const Detalles = styled.div`
  min-width: 70%;
  table{
    width: 100%;
    tr{
      line-height: 32px;
    }
    .titulos{
      text-align: end;
    }
    .textos{
      padding-left: 24px;
    }
  }
`

const Imagen = styled.div`
  max-width: 25%;
  display: flex;
  justify-content: center;
  img {
    width: 50%;
    border-radius: 50%;
  }
`

function mapStateToProps({authedUser}) {
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(Historial)