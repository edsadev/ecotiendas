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

import { Page, Text, View, Document, StyleSheet, PDFViewer, Image  } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: '24px',
  },
  section: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
  },
  image: {
    width: '80px',
  },
  normalText: {
    fontSize: '12px'
  },
  title: {
    fontSize: '18px'
  },
  subTitle: {
    fontSize: '16px',
    marginTop: '6px'
  },
  topBorder: {
    borderTop: '1px solid black',
    flexDirection: 'row',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    justifyContent: 'space-between'
  },
  table: {
    marginTop: '24px'
  },
  textFirstColumn: {
    padding: '5px',
    borderRight: '1px solid black',
    fontSize: '16px',
    width: '50%',
  },
  textSecondColumn: {
    padding: '5px',
    fontSize: '16px',
    width: '50%',
  },
  firmas: {
    marginTop: '24px',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  carta: {
    width: '30%',
    height: '100px',
    borderRadius: '12px',
    border: '1px solid black',
    padding: '8px',
    flexDirection: 'column'
  }
});

class Detalle extends React.Component {
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
    this.props.history.push('/history')
  }
  handlePdfDownload = () => {
  }
  render(){
    const { materials } = this.props
    const { data } = this.state
    const salida = this.props.location.search.split("=")[1]
    const fecha = new Date()
    const hoy = fecha.toLocaleDateString("es-ES")
    console.log(this.props, hoy)
    return (
      <Container className="container-default">
        <Fade>
          <Paper>
            <TableContainer style={{width: "76vw", height: "85vh"}}>
              <Details>
                <h2 style={{display: 'flex', alignItems: 'center'}}><ArrowBackIcon style={{cursor: 'pointer', marginRight: '24px'}} onClick={this.handleClick}/>{salida === "true" ? 'Guía de remisión, ' : null}Transacción: #{this.props.match.params.id}</h2>
              </Details>
              {salida !== "true" 
                ? <Table aria-label="simple table" stickyHeader id="tabla-reporte">
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
                : <PDFViewer style={{width: "100%", height: '100%'}}>
                    <Document>
                      <Page size="A4" style={styles.page}>
                        <View
                          style={styles.section}
                        >
                          <Image 
                            src="/images/logo_2.png"
                            style={styles.image}
                          />
                          <View style={{marginLeft: "24px", alignSelf: "flex-end"}}>
                            <Text style={styles.normalText}>R.U.C.: 0992968079001</Text>
                            <Text style={styles.normalText}>VENTA AL POR MAYOR Y MENOR DE CHATARRA Y RECICLAJE</Text>
                            <Text style={styles.normalText}>Cdla. Las prisas Mz. A-1 Solar 17-18. Teléfono: (04) 3800600</Text>
                            <Text style={styles.normalText}>Celular: 0994194969 * Durán - Ecuador</Text>
                            <Text style={styles.normalText}>Fecha: {hoy}</Text>
                          </View>
                        </View>
                        <View>
                          <Text style={styles.title}>Guía de remisión de la transacción: #{this.props.match.params.id}</Text>
                        </View>
                        <View>
                          <Text style={styles.subTitle}>Lista de productos de salida</Text>
                        </View>
                        <View>
                          <View style={styles.table}>
                            <View style={styles.topBorder}>
                              <View style={styles.textFirstColumn}>
                                <Text style={styles.normalText}>Producto</Text>
                              </View>
                              <View style={styles.textSecondColumn}>
                                <Text style={styles.normalText}>Total Kg</Text>
                              </View>
                            </View>
                            {data && data.map((row) => (
                              <View style={styles.row}>
                                <View style={styles.textFirstColumn}>
                                  <Text style={styles.normalText}>{materials[row.material_id].nombre}</Text>
                                </View>
                                <View style={styles.textSecondColumn}>
                                  <Text style={styles.normalText}>{row.cantidad_kg} Kg</Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                        <View style={styles.firmas}>
                          <View style={[styles.carta, {justifyContent: 'center'}]}>
                            <Text style={styles.normalText}>Declaro haber recibido a mi entera satisfacción y sin lugar a ningún reclamo la mercadería detallada en esta guía de remisión</Text>
                          </View>
                          <View style={[styles.carta, {justifyContent: 'flex-end'}]}>
                            <Text style={[styles.normalText, {textAlign: 'center', borderTop: '1px solid black', paddingTop: '4px'}]}>RECIBÍ CONFORME</Text>
                            <Text style={[styles.normalText, {textAlign: 'center'}]}>FIRMA Y SELLO</Text>
                          </View>
                          <View style={[styles.carta, {justifyContent: 'flex-end'}]}>
                            <Text style={[styles.normalText, {textAlign: 'center', borderTop: '1px solid black', paddingTop: '4px'}]}>FIRMA AUTORIZADA</Text>
                          </View>
                        </View>
                      </Page>
                    </Document>
                  </PDFViewer>
              }
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

export default connect(mapStateToProps)(Detalle)

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