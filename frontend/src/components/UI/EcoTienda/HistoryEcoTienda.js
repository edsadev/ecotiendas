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
import TablePagination from '@material-ui/core/TablePagination';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Link } from 'react-router-dom'

import { getHistory, getTicketsQuantity } from '../../../utils/api'

class Historial extends React.Component {
  state = {
    historial: [],
    page: 0,
    rowsPerPage: 10,
    count: 100
  }
  componentDidMount(){
    Promise.all([
      getHistory(parseInt(this.props.authedUser.id), this.state.rowsPerPage, this.state.page),
      getTicketsQuantity(parseInt(this.props.authedUser.id))
    ]).then((res) => {
      console.log(res)
      this.setState(() => ({
        historial: res[0].data.historial,
        count: res[1].data.cantidad
      }))
    })
  }
  handleChangePage = (event, newPage) => {
    // console.log(event, newPage)
    getHistory(parseInt(this.props.authedUser.id), this.state.rowsPerPage, newPage)
      .then(res => {
        this.setState(() => ({
          historial: res.data.historial,
          page: newPage
        }))
      })
  }
  handleChangeRowsPerPage = (event) => {
    console.log(event)
    getHistory(parseInt(this.props.authedUser.id), parseInt(event.target.value), 0)
      .then(res => {
        this.setState(() => ({
          historial: res.data.historial,
          rowsPerPage: parseInt(event.target.value),
          page: 0
        }))
      })
  };
  check = (e) => {
    e.preventDefault()
    console.log(this.state)
  }
  render(){    
    const { historial } = this.state
    return (
      <Container className="container-default background-default">
        <Fade>
          <Paper>
            <TableContainer style={{width: "76vw", height: "75vh"}}>
              <Table aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="center">Total Kg</TableCell>
                    <TableCell align="center">Id Transacción</TableCell>
                    <TableCell align="center">Ecopuntos</TableCell>
                  </TableRow>
                </TableHead>
               <TableBody>
                  {historial && historial.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell  style={{color: row.cliente === null && "red"}}>{row.cliente !== null ?row.cliente :"Salida de material"}</TableCell>
                      <TableCell align="center">{(new Date(row.fecha)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                      <TableCell align="center">{row.total_kg}</TableCell>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center" style={{color: row.total_ecopuntos === null && "red", display: "flex", justifyContent: "space-around", alignItems: "center"}}><span>{row.total_ecopuntos !== null ?row.total_ecopuntos :"0"}</span><Link style={{lineHeight: '1', color: "black"}} to={`/detalle/${row.id}?salida=${row.cliente !== null ?false :true}`}><ArrowForwardIcon /></Link></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> 
            <TablePagination
              component="div"
              count={this.state.count}
              page={this.state.page}
              onPageChange={this.handleChangePage}
              rowsPerPage={this.state.rowsPerPage}
              onRowsPerPageChange={this.handleChangeRowsPerPage} />
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

export default connect(mapStateToProps)(Historial)