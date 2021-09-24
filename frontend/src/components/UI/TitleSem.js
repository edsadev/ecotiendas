import React from 'react'

export default class Semaforo extends React.Component {
  renderSemaforo(capacidadActual, capacidadMaxima){
    const total = Math.floor(capacidadActual * 100 / capacidadMaxima)
    if (total >= 0 && total < 50){
      return (
        <span>🟢</span>
      )
    } else if (total >= 50 && total < 70){
      return (
        <span>🟡</span>
      )
    } else if (total >= 70 ){
      return (
        <span>🔴</span>
      )
    }
  }
  render(){
    return (
      <div style={{display: 'inline-block'}}>
        <span>{this.props.text} {this.renderSemaforo(this.props.capActual, this.props.capMaxima)}</span>
      </div>
    )
  }
}