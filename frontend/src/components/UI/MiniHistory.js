import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getDailyHistory } from '../../utils/api'

class MiniHistory extends React.Component {
  state = {
    historial: {},
    historyId: []
  }
  componentDidMount(){
    getDailyHistory(this.props.authedUser.id)
      .then((res) => {
        if(res.data.success){
          const historial = res.data.historial
          const historyId = Object.keys(historial)
            .sort((a,b) => Date.parse(historial[b].fecha) - Date.parse(historial[a].fecha))
          this.setState(() => ({
            historial,
            historyId
          }))
        }
      })
      .catch(err => {
        console.error(err)
      })
  }
  render(){
    const { historial, historyId } = this.state
    const array = []
    for (let i = 0; i < historyId.length; i++){
      array.push(historial[historyId[i]])
    }
    if(array.length === 0){
      return (
        <Container>
          <div style={{display: 'flex', height: "100%", justifyContent: 'center', alignItems: 'center'}}>No hay historial de hoy</div>
        </Container>
      )
    }
    return (
      <Container>
        <Table>
          <tbody>
            {array.map((item) => (
              <tr key={item.id}>
                <td style={{color: item.cliente === null && "red"}}>{item.cliente !== null ?item.cliente :"Salida de material"}</td>
                <td>{item.total_kg} Kg</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    )
  }
}

const Container = styled.div`
  height: 80%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

const Table = styled.table`
  width: 100%;
  th, tr {
    line-height: 48px;
  }
  td {
  }
`

function mapStateToProps({authedUser}) {
  return {
    authedUser,
  }
}

export default connect(mapStateToProps)(MiniHistory)