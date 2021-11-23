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
import { getPremios } from '../../utils/api'
import { Link } from 'react-router-dom';

class EditarPremios extends React.Component {
  state = {
    premios: [],
  }
  componentDidMount(){
    getPremios()
      .then(res => {
        console.log(res)
        this.setState(() => ({
          premios: res.data.premios
        }))
      })
      .catch(err => {
        alert('Hubo un error al tratar de obtener los datos del servidor')
        console.error(err)
      })
  }
  render(){
    const {premios} = this.state
    return (
      <Container className="container-default background-default">
        <Fade>
          <Paper>
            <TableContainer style={{width: "76vw", height: "75vh"}}>
              <Table aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Producto</TableCell>
                    <TableCell align="center">Nombre del producto</TableCell>
                    <TableCell align="center">Configuración</TableCell>
                  </TableRow>
                </TableHead>
               <TableBody>
                  {premios && premios.map((row) => (
                    <TableRow key={row.id}>
                      {console.log(row)}
                      <TableCell align="center"><img width={50} height={50} alt='imagen del producto' src={row.foto}/></TableCell>
                      <TableCell align="center">{row.nombre}</TableCell>
                      <TableCell align="center">
                        <Link to={`/edit-rewards/${row.id}`} style={{textDecoration: 'none'}}>Modificar</Link>
                      </TableCell>
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

export default connect(mapStateToProps)(EditarPremios)