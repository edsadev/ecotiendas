import React from 'react'
import { connect } from 'react-redux'
import { receiveInitialDataEcoAdmin } from '../../../actions/shared'
import styled from 'styled-components'
import MiniHistory from '../../UI/MiniHistory'

import { velocimetro, getStockEcoAdmin, getTipoProductos } from '../../../utils/api'

import { Line } from 'react-chartjs-2';

import Boton from '../../UI/Boton'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class Dashboard extends React.Component {
  state = {
    dataKg:  [],
    dataM3:  [],
    color: null,
    data: undefined,
    options: undefined,
    peso: 0,
    tipos_productos: [],
    open: false,
    option: "Plástico",
    selected: 4
  }

  setLabels = (ids, data, tipo_producto = '4') => {
    console.log(data)
    return ids.map((id) => {
      return data[id].tipo_producto.toString() === tipo_producto
        ? data[id].nombre
        : null
    })
  }  
  
  setData = (ids, data, tipo_producto = '4') => {
    return ids.map((id) => {
      return data[id].tipo_producto.toString() === tipo_producto
        ? data[id].peso
        : null
    })
  }

  componentDidMount(){
    this.setState(() => ({
      options: {
        maintainAspectRatio: false,
      }
    }))

    this.props.dispatch(receiveInitialDataEcoAdmin())

    Promise.all([
      velocimetro(this.props.authedUser.id),
      getStockEcoAdmin(this.props.authedUser.id),
      getTipoProductos()
    ]).then((res) => {
      const { cantidad_actual_m3, capacidad_maxima_m3 } = res[0].data.ecotienda
      const data = res[1].data.data
      const ids = Object.keys(data)

      this.setState(() => ({
        tipos_productos: res[2].data.tipos_productos,
        data: {
          labels: this.setLabels(ids, data),
          datasets: [
            {
              label: 'Kg',
              data: this.setData(ids, data),
              fill: false,
              backgroundColor: 'rgba(0,104,0,1.0)',
              borderColor: 'rgba(0,104,0,.4)',
            },
          ],
        },
        options: {
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
        },
        peso: Math.floor(cantidad_actual_m3 * 100 / capacidad_maxima_m3)
      }))
    })    
  }

  handleSelectChange = (e) => {
    this.setState(() => ({
      selected: e.target.value
    }))
  }

  handleOnChange = (e) => {
    Promise.all([
      getTipoProductos(), 
      getStockEcoAdmin(this.props.authedUser.id)
    ])
      .then(res => {
        console.log(res)
        const data = res[1].data.data
        const ids = Object.keys(data)
        this.setState(() => {
          return {
            data: {
              labels: this.setLabels(ids, data, this.state.selected),
              datasets: [
                {
                  label: 'Kg',
                  data: this.setData(ids, data, this.state.selected),
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
    let direccion = ""
    if (this.state.peso >= 0 && this.state.peso < 15){
      direccion = './images/trash/tacho_1.png'
    } else if (this.state.peso >= 15 && this.state.peso < 30){
      direccion = './images/trash/tacho_2.png'
    } else if (this.state.peso >= 30 && this.state.peso < 45){
      direccion = './images/trash/tacho_3.png'
    } else if (this.state.peso >= 45 && this.state.peso < 60){
      direccion = './images/trash/tacho_4.png'
    } else if (this.state.peso >= 60 && this.state.peso < 75){
      direccion = './images/trash/tacho_5.png'
    } else if (this.state.peso >= 75 && this.state.peso < 90){
      direccion = './images/trash/tacho_6.png'
    } else if (this.state.peso >= 90){
      direccion = './images/trash/tacho_7.png'
    } 

    const {tipos_productos} = this.state

    return (
      <Container className="container-default">
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
        <LineWrapper>
          <Button onClick={this.handleOpen}>{this.state.option}</Button>
          <Line style={{zIndex: 10000}} data={this.state.data && this.state.data} options={this.state.options && this.state.options} />
        </LineWrapper>
        <BtnContainer>
          <Boton text="Salida de material" direction="/new-exit" />
          <Boton text="Ingresar material" direction="/preg" />
          {/* <Boton text="Canjear puntos" direction="/" /> */}
        </BtnContainer>
        <TrashContainer>
          <h2>Capacidad de bodega M³</h2>
          <h4>{this.state.peso}%</h4>
          <img src={direccion} alt="basura"></img>
        </TrashContainer>
        <HistorialContainer>
          <h2>Historial diario</h2>
          <MiniHistory />
        </HistorialContainer>
        <ArbolContainer>
          <img alt="Árbol" src="./images/arbol.png"></img>
        </ArbolContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 4vw repeat(2, auto) 24vw 6vw;
  grid-template-rows: 5vh 45vh 45vh 5vh;
  grid-template-areas: 
    '. . . . .'
    '. stock stock btns .'
    '. trash history tree .'
    '. . . tree .';
  .react-reveal {
    height: 100%;
  }
`

const BtnContainer = styled.div`
  display: flex;
  grid-area: btns;
  flex-flow: column;
  justify-content: space-around;
`

const LineWrapper = styled.div`
  grid-area: stock;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-flow: column;
  padding: 0 40px;
`

const TrashContainer = styled.div`
  grid-area: trash;
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-top: 40px;
  img {
    width: 300px;
  }
  @media screen and (max-width: 1366px){
    img{
      width: 200px;
      height: auto;
    }
  }
`

const HistorialContainer = styled(TrashContainer)`
  grid-area: history;
`

const ArbolContainer = styled.div`
  grid-area: tree;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 90%;
  }
`

function mapStatetoProps({authedUser, historial}){
  return {
    authedUser,
    historial
  }
}

export default connect(mapStatetoProps)(Dashboard)