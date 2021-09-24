import React from 'react'
import {Link} from 'react-router-dom'

export default function Boton(props){
  const {text, direction, estilo} = props
  return (
    <Link style={estilo && estilo} className="btn" to={direction}>
      <span className="btn-icon">
        <img alt="flechas" src="./images/flechas.png"/>
      </span>
      <span className="btn-text">
        <p>
          {text}
        </p>
      </span>
    </Link>
  )
}