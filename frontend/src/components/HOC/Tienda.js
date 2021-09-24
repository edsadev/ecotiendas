import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

class Tienda extends React.Component{
  render(){
    return(
      <Container className="container-default background-default ">
        Tienda
      </Container>
    )
  }
}

const Container = styled.div``

export default connect()(Tienda)