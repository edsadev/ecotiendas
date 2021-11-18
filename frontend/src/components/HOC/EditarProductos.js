import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class EditarProductos extends React.Component {
  state = {
    productos: [{
      
    }]
  }
  render(){
    const {productos} = this.state
    return (
      <Container className="container-default background-default">
        <Fade>
          <Paper>
            <TableContainer style={{width: "76vw", height: "75vh"}}>
              <Table aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="center">Tipo de producto</TableCell>
                    <TableCell align="center">Total Kg</TableCell>
                    <TableCell align="center">Total M3</TableCell>
                    <TableCell align="center">Ecopuntos por Kg</TableCell>
                  </TableRow>
                </TableHead>
               <TableBody>
                  {productos && productos.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell  style={{color: row.cliente === null && "red"}}>{row.cliente !== null ?row.cliente :"Salida de material"}</TableCell>
                      <TableCell align="center">{(new Date(row.fecha)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                      <TableCell align="center">{row.total_kg}</TableCell>
                      <TableCell align="center">{row.id}</TableCell>
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
  justify-content: center;
  align-items: center;
`

function mapStateToProps({authedUser}) {
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(EditarProductos)