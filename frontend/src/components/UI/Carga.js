import React from 'react'
import styled from 'styled-components'

export default function Carga(props){
  return(
    <IMG 
      alt="Hojas de carga" 
      src="./images/loading.png" 
      className="rotate"
      width="250"
      height="250"
    />
  )
}

const IMG = styled.img`
  animation: rotation 2s linear infinite;
  position: relative; 
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`