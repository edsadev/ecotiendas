import React from 'react'
import styled from 'styled-components'

export default function Carga(props){
  return(
    <Container>
      <img 
        alt="Hojas de carga" 
        src="./images/loading.png" 
        className="rotate"
        width="250"
        height="250"
        style={{position: 'relative', top: "25%"}}
        />
        <div className="centered">{props.text}</div>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  text-align: center;
  width: 100%;
  .rotate {
    animation: rotation 2s linear infinite;
  }
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`