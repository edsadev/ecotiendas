import React from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default class GoBackArrow extends React.Component{
  handleBack = () => {
    this.props.history.goBack()
  }
  
  render(){
    return (
      <div className={this.props.classTo} style={{display: "inline-block"}}>
        {this.props.goTo 
          ? <ArrowBackIcon style={{cursor:"pointer"}} onClick={() => {
            console.log(this.props.goTo)
            this.props.history.push(this.props.goTo)
          }}/>
          : <ArrowBackIcon style={{cursor:"pointer"}} onClick={this.handleBack}/>
        }
      </div>
    )
  }
}