import React from 'react'
import { getDetail } from '../../utils/api'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { connect } from 'react-redux'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

import { completTicketInTransit } from '../../utils/api'

class Ticket extends React.Component {
  state = {
    data: []
  }
  componentDidMount(){
    const { id } = this.props.match.params

    getDetail(id)
      .then((res) => {
        this.setState(() => ({
          data: res.data.materiales
        }))
      })
  }
  handleClick = () => {
    this.props.history.goBack()
  }
  handleSubmit = (e) => {
    const { id } = this.props.match.params
    e.preventDefault()
    completTicketInTransit(id)
      .then(res => {
        console.log(res.data)
        if(res.data.success){
          alert(res.data.mensaje)
          this.props.history.goBack()
        } else {
          alert(res.data.mensaje)
        }
      })
      .catch(err => {
        alert('Ocurrio un problema, vuelve a intentarlo')
        console.error(err)
      })
  }
  render(){
    const { materials } = this.props
    const { data } = this.state
    return (
      <Container className="container-default">
        <Fade>
          <Paper style={{borderRadius: '25px'}}>
            <Details>
              <h2 style={{display: 'flex', alignItems: 'center'}}>
                <ArrowBackIcon style={{cursor: 'pointer', marginRight: '24px'}} onClick={this.handleClick}/>
                <span>Ticket #{this.props.match.params.id}</span>
              </h2>
              <Button onClick={this.handleSubmit}>
                <p>Completar ticket</p>
                <CheckCircleOutlineOutlinedIcon style={{marginLeft: '10px'}}/>
              </Button>
            </Details>
            <TableContainer style={{width: "76vw", height: "70vh"}}>
              <Table aria-label="simple table" stickyHeader id="tabla-reporte">
                <TableHead>
                  <TableRow>
                    <TableCell>Material</TableCell>
                    <TableCell align="center">Total Kg</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.map((row) => (
                    <TableRow key={row.material_id}>
                      <TableCell>{materials[row.material_id].nombre}</TableCell>
                      <TableCell align="center">{row.cantidad_kg} Kg</TableCell>
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

function mapStateToProps({ materials }){
  return {
    materials
  }
}

export default connect(mapStateToProps)(Ticket)

const Container = styled.div`
  background-color: #B2DDE7;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  padding-block: 10px;
  padding-inline: 20px;
  border-radius: 15px;
  cursor: pointer;
  background-color: #02735F;
  color: white;
`