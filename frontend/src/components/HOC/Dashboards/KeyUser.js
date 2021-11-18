import React from 'react'
import { connect } from 'react-redux'
import { receiveInitialDataKeyUser } from '../../../actions/shared'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { getGeneralDataGraph, getTipoProductos, getTotalKgAnio } from '../../../utils/api'
import { _setData, _setLabels } from '../../../utils/_helpers'

import { Line } from 'react-chartjs-2';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class KeyUser extends React.Component {
  state = {
    data: undefined,
    options: undefined,
    tipos_productos: [],
    proyeccion: "",
    open: false,
    option: '',
    selected: 4
  }

  componentDidMount(){
    this.setState(() => ({
      options: {
        maintainAspectRatio: false,
      }
    }))
    this.props.dispatch(receiveInitialDataKeyUser())

    // function redirecciona(history, id){
    //   console.log(this)
    //   history.push(`/material/${id}`)
    // }

    Promise.all([getTipoProductos(), getGeneralDataGraph(), getTotalKgAnio()])
      .then((res) => {
        const data = res[1].data.data
        const ids = Object.keys(data)
        // const {history, materials, materialsId} = this.props
        console.log(res)
        this.setState(() => ({
          proyeccion: res[2].data.total,
          option: res[0].data.tipos_productos[0].nombre,
          tipos_productos: res[0].data.tipos_productos,
          data: {
            labels: _setLabels(ids, data),
            datasets: [
              {
                label: 'Kg',
                data: _setData(ids, data),
                fill: false,
                backgroundColor: 'rgba(0,104,0,1.0)',
                borderColor: 'rgba(0,104,0,.4)',
              },
            ],
          },
          options: {
            // onClick: function(e) {
            //   const xLabel = this.scales['x'].getValueForPixel(e.x);
            //   const material = this.scales['x'].ticks[xLabel]
            //   console.log(material)
            //   redirecciona(history, materials[materialsId[material.value]].id)
            // },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                suggestedMin: 0,
              }
            },
            plugins: {
              legend: {
                display: false
              },
              datalabels: {
                display: ctx => {
                  return true;
                },
                formatter: (ctx, data) => {
                  console.log(data)
                  return `${data.dataIndex}`;
                }
              }
            }
          }
        }))
    })    
  }

  handleSelectChange = (e) => {
    this.setState(() => ({
      selected: e.target.value
    }))
  }

  handleOnChange = (e) => {
    Promise.all([getTipoProductos(), getGeneralDataGraph()])
    .then(res => {
        const data = res[1].data.data
        const ids = Object.keys(data)
        this.setState(() => {
          return {
            data: {
              labels: _setLabels(ids, data, this.state.selected),
              datasets: [
                {
                  label: 'Kg',
                  data: _setData(ids, data, this.state.selected),
                  fill: false,
                  backgroundColor: 'rgba(0,104,0,1.0)',
                  borderColor: 'rgba(0,104,0,.4)',
                },
              ]
            },
            option: res[0].data.tipos_productos.find(element => element.id === parseInt(this.state.selected)).nombre
          }
        })
      })
    this.handleOpen()
  }

  setOpen = () => {
    this.setState(() => ({
      open: !this.state.open
    }))
  }

  handleOpen = () => {
    this.setOpen();
  };

  render() {
    const {tipos_productos, proyeccion} = this.state
    const anio = new Date()
    return (
      <Container className="container-default">
        <LineWrapper>
          <Button onClick={this.handleOpen}>{this.state.option}</Button>
          <Line style={{zIndex: 10000}} data={this.state.data && this.state.data} options={this.state.options && this.state.options} />
        </LineWrapper>
        <Dialog open={this.state.open} style={{zIndex: 100000000}}>
          <DialogTitle>Selecciona una opción</DialogTitle>
          <DialogContent>
            <form>
              <FormControl>
                <InputLabel>Producto</InputLabel>
                <Select
                  native
                  onChange={(e) => this.handleSelectChange(e)}
                >
                  <option aria-label="None" value="" selected/>
                  {tipos_productos && tipos_productos.map(producto => (
                    producto.id === 4 
                      ? <option key={producto.id} id={producto.id} value={producto.id}>{producto.nombre}</option>
                      : <option key={producto.id} id={producto.id} value={producto.id}>{producto.nombre}</option>
                  ))}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleOpen} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.handleOnChange} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Tarjetas>
          <Carta id="proy">
            <div className="sub">
              <h4>Proyección</h4>
              <Link to="/proyeccion"><img width="30" alt="Flecha con fondo verde" src="./images/FlechaFondoVerde.png"/></Link>
            </div>
            <h5 style={{color: '#02735F'}}>Año actual: {anio.getFullYear()}</h5>
            <p style={{color: '#6FB85D'}}>{proyeccion} Kg</p>
          </Carta>
          <img style={{maxHeight: "25vh"}} src="./images/Planeta.png" alt="planeta"></img>
          <Carta>
            <div className="sub">
              <h4>Ver EcoTiendas</h4>
              <Link to="/ecotiendas"><img width="30" alt="Flecha con fondo verde" src="./images/FlechaFondoVerde.png"/></Link>
            </div>
            <img style={{ maxHeight: '100px' , margin: 'auto'}} src="./images/Marcador.png" alt="Marcador"></img>
          </Carta>
        </Tarjetas>
      </Container>
    )
  }
}

const Container = styled.div`
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 5vw auto 5vw;
  grid-template-rows: 10vh 50vh 5vh 30vh 5vh;
  grid-template-areas: 
    '. titulo .'  
    '. material .'
    '. . .'
    '. cuadros .'
    '. . .';
  .react-reveal {
    height: 100%;
  }
`

const LineWrapper = styled.div`
  grid-area: material;
  display: flex;
  justify-content: center;
  flex-flow: column;
`

const Tarjetas = styled.div`
  grid-area: cuadros;
  display: flex;
  justify-content: space-around;
  align-items: center;
  #proy{
    background-image: url('./images/Curva.png');
    background-size: cover;
  }
`

const Carta = styled.div`
  padding: 12px 24px;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  border-radius: 12px;
  box-shadow: -1px 1px 12px -1px rgba(0,0,0,0.5);
  min-height: 25vh;
  max-width: 20vw;
  .sub{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

function mapStatetoProps({authedUser, materials}){
  return {
    authedUser,
    materials,
    materialsId: Object.keys(materials)
  }
}

export default connect(mapStatetoProps)(KeyUser)