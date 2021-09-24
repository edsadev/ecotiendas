import React from 'react'
import styled from 'styled-components'
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { getProyeccion } from '../../utils/api'

class Proyeccion extends React.Component{
  state = {
    meses: 0
  }

  handleState = (meses) => {
    getProyeccion(parseInt(meses))
      .then((res) => {
        const data = res.data.data
        const ids = Object.keys(data)
        
        function setLabels(){
          return ids.map((id) => data[id].nombre)
        }  
        
        function setData(){
          return ids.map((id) => data[id].peso)
        }

        this.setState(() => ({
          data: {
            labels: setLabels(),
            datasets: [
              {
                label: 'Kg',
                data: setData(),
              },
            ],
          },
          meses
      }))
    }) 
  }

  componentDidMount(){
    this.setState(() => ({
      data: {
        options: {
          maintainAspectRatio: false,
        }
      }
    }))
    
    getProyeccion(parseInt(this.state.meses))
      .then((res) => {
        const data = res.data.data
        const ids = Object.keys(data)
        
        function setLabels(){
          return ids.map((id) => data[id].nombre)
        }  
        
        function setData(){
          return ids.map((id) => data[id].peso)
        }

        this.setState(() => ({
          data: {
            labels: setLabels(),
            datasets: [
              {
                label: 'Kg',
                data: setData(),
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
          }
      }))
    })    
  }

  render(){
    return(
      <Container className="container-default background-default">
        <SubContainer>
          <Botones>
            <Link to="/"><img id="imagen" width="30" alt="Flecha con fondo verde" src="./images/FlechaFondoVerde.png"/></Link>
            <List>
              <li onClick={() => this.handleState(0)} className={this.state.meses === 0 ? "title_green" : "title_lightgreen"}>Actual</li>
              <li onClick={() => this.handleState(3)} className={this.state.meses === 3 ? "title_green" : "title_lightgreen"}><span>3 Meses</span></li>
              <li onClick={() => this.handleState(6)} className={this.state.meses === 6 ? "title_green" : "title_lightgreen"}><span>6 Meses</span></li>
              <li onClick={() => this.handleState(9)} className={this.state.meses === 9 ? "title_green" : "title_lightgreen"}><span>9 Meses</span></li>
              <li onClick={() => this.handleState(12)} className={this.state.meses === 12 ? "title_green" : "title_lightgreen"}><span>12 Meses</span></li>
            </List>
          </Botones>
          <LineWrapper>
            <Line style={{zIndex: 10000}} data={this.state.data && this.state.data} options={this.state.options && this.state.options} />
          </LineWrapper>
        </SubContainer>
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

const SubContainer = styled.div`
  width: 70vw;
  min-height: 80vh;
  background-color: white;
  display: flex;
  flex-flow: column;
  box-shadow: 0px 0px 20px -5px rgba(0,0,0,0.73);
  border-radius: 40px;
`

const Botones = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 36px;
  #imagen{
    transform: rotate(180deg);
  }
`

const List = styled.ul`
  display: flex;
  list-style: none;
  justify-content: flex-end;
  padding: 24px 36px 24px 0;
  li{
    margin-left: 12px;
    cursor: pointer;
  }
`

const LineWrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  padding: 0 40px 40px 40px;
  grid-area: material;
  display: flex;
  justify-content: center;
  flex-flow: column;
`

function mapStateToProps({ materials }){
  return {
    materials
  }
}

export default connect(mapStateToProps)(Proyeccion)