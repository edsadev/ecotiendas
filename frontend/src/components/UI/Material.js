import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { getEcotiendasByMaterialId, getEcotiendasByMaterialIdForEcoZonal } from '../../utils/api'
import { connect } from 'react-redux'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Link } from 'react-router-dom'


class Material extends React.Component {
  state = {
    ecotiendas: []
  }
  componentDidMount(){
    if (this.props.authedUser.rank === 'keyUser' || this.props.authedUser.rank === 'administrativo'){
      getEcotiendasByMaterialId(this.props.match.params.id)
        .then(res => {
          const ecotiendas = res.data.data
          const ecotiendasId = Object.keys(ecotiendas)
          console.log(ecotiendas, ecotiendasId)
          this.setState(() => ({
            ecotiendas: ecotiendasId.map((id) => {
              return {
                ...ecotiendas[id],
                id
              }
            })
          }))
        })
    } else if (this.props.authedUser.rank === 'ecozonal'){
      getEcotiendasByMaterialIdForEcoZonal(this.props.authedUser.id, this.props.match.params.id)
        .then(res => {
          const ecotiendas = res.data.data
          const ecotiendasId = Object.keys(ecotiendas)
          console.log(ecotiendas, ecotiendasId)
          this.setState(() => ({
            ecotiendas: ecotiendasId.map((id) => {
              return {
                ...ecotiendas[id],
                id
              }
            })
          }))
        })
    }
  }
  render(){
    return (
      <Container className="container-default background-default">
        <Fade>
          <Paper>
            <TableContainer style={{width: "76vw", height: "75vh"}}>
              <Table aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Id Ecotienda</TableCell>
                    <TableCell align="center">Nombre Ecotienda</TableCell>
                    <TableCell align="center">Total Kg</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.ecotiendas && this.state.ecotiendas.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.nombre}</TableCell>
                      <TableCell align="center">{row.peso}</TableCell>
                      <TableCell align="center" style={{color: row.total_ecopuntos === null && "red", display: "flex", justifyContent: "space-around", alignItems: "center"}}><Link style={{lineHeight: '1', color: "black"}} to={`/ecotiendas/${row.id}`}><ArrowForwardIcon /></Link></TableCell>
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

function mapStateToProps({authedUser}){
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(Material)